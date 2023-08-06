import { ElementRef, Injectable } from "@angular/core";
import { LogType } from "shared/enums/logType";
import { LogService } from "./log.service";
import { WindowRefService } from './windowRef.service'
import { MessageService } from "./message.service";
import { MessageType } from 'app/shared/services/message.service'
import { YoutubeTrack } from "../data/track";
import { ScreenService, WidthRange } from "./screen.service";

@Injectable({
	providedIn: 'root',
})

/// https://developers.google.com/youtube/iframe_api_reference
/// https://www.npmjs.com/package/ngx-youtube-player
export class YoutubeService {
	private player: YT.Player | undefined;
	private playerElement!: ElementRef<any>;
	private playWhenReady = false
	private isFullScreen = false
	readonly instancePlayedListeners!: Map<string, () => void>
	readonly instanceEndedListeners!: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>

	constructor(private windowRef: WindowRefService, private messageService: MessageService, private screenService: ScreenService, private logService: LogService) {
		this.instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()
	}

	savePlayerElement(playerElement: ElementRef<any>) {
		this.playerElement = playerElement
	}

	onWindowResize(windowWidth: number, _windowHeight: number) {
		if (this.player === undefined) {
			return 0;
		}
		const playerSize = this.getPlayerSize(windowWidth)
		this.player.setSize(playerSize.width, playerSize.height)
		return playerSize.height
	}

	private getPlayerSize(windowWidth: number) {

		const rectMarginPercentageByWidthRange = new Map<WidthRange, number>([[WidthRange.Default, 0], [WidthRange.S, 0.05], [WidthRange.M, 0.15], [WidthRange.L, 0.25], [WidthRange.XL, 0.30]])
		const rectWidthCorrectionByWidthRange = new Map<WidthRange, number>([[WidthRange.Default, 0], [WidthRange.XXS, 16], [WidthRange.XS, 16], [WidthRange.S, 8], [WidthRange.M, 6], [WidthRange.L, 3]])

		return this.screenService.getRectSizeForHorizontalCenter(windowWidth, rectMarginPercentageByWidthRange, rectWidthCorrectionByWidthRange)
	}

	onPlayerReady(player: YT.Player, volume: number, isSelectedTrackWithActiveYoutubeVisuals: boolean, windowWidth: number, _windowHeight: number) {
		this.player = player;
		let playerHeight = 0;
		if (isSelectedTrackWithActiveYoutubeVisuals) {
			const playerSize = this.getPlayerSize(windowWidth)
			this.player.setSize(playerSize.width, playerSize.height)
			playerHeight = playerSize.height
		}
		this.volume = volume

		if (this.playWhenReady) {
			this.play();
		}

		player.getIframe().onfullscreenchange = () => {
			this.isFullScreen = !this.isFullScreen
			this.logService.log(LogType.Info, 'isFullScreen', this.isFullScreen);
			this.logService.log(LogType.Info, 'playerElement', this.playerElement);
		};

		let contentWindow = this.player.getIframe().contentWindow
		this.windowRef.nativeWindow.addEventListener("message", (event: { source: any; data: string; }) => {
			// Check that the event was sent from the YouTube IFrame.
			if (event.source === contentWindow) {
				var data = JSON.parse(event.data);
				// The "infoDelivery" event is used by YT to transmit any
				// kind of information change in the player,
				// such as the current time or volume change.
				if (data.event === "infoDelivery" && data.info && data.info.volume) {
					this.messageService.sendMessage({type: MessageType.YoutubeVolumeChange})
				}
			}
		});
		return playerHeight;
	}

	toFullScreen() {
		this.player?.getIframe().requestFullscreen()
	}

	play() {
		this.playWhenReady = false
		this.player?.playVideo();
		this.instancePlayedListeners.forEach((listener) => listener())
	}

	playFromStart(track: YoutubeTrack) {
		this.logService.log(LogType.Info, 'YoutubeService:playFromStart')

		if (this.player === undefined) {
			this.playWhenReady = true
			return
		}
		let currentIdInPlayer = this.getIdFromVideoUrl(this.player.getVideoUrl())
		this.logService.log(LogType.Info, 'currentIdInPlayer', currentIdInPlayer)
		if (track.youtubeId !== currentIdInPlayer) {
			this.logService.log(LogType.Info, 'loading new youtube id', track.youtubeId)
			this.player.loadVideoById(track.youtubeId)
		}
		else {
			this.play()
		}
	}

	private getIdFromVideoUrl(videoUrl: string) {
		if (!videoUrl) {
			return ''
		}
		return videoUrl.split('?v=')[1]
	}

	pause() {
		this.logService.log(LogType.Info, 'pause() in YoutubeService')
		this.player?.pauseVideo()
	}

	get volume(): number {
		if (this.player?.getVolume() === undefined) {
			return 0
		} else {
			return this.player.getVolume()
		}
	}

	set volume(value: number) {
		this.player?.setVolume(value)
	}

	get muted() {
		if (this.player?.isMuted() === undefined) {
			return true
		} else {
			return this.player.isMuted()
		}
	}

	set muted(value: boolean) {
		if (value) {
			this.player?.mute()
		} else {
			this.player?.unMute()
		}
	}

}
