import { ElementRef, Injectable } from "@angular/core";
import { LogType } from "shared/enums/logType";
import { LogService } from "./log.service";
import { WindowRefService } from './windowRef.service'
import { MessageService } from "./message.service";
import { MessageType } from 'app/shared/services/message.service'
import { ITrack } from "../data/track";

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

	constructor(private logService: LogService, private windowRef: WindowRefService, private messageService: MessageService) {
		this.instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()
	}

	savePlayerElement(playerElement: ElementRef<any>) {
		this.playerElement = playerElement
	}

	onPlayerReady(player: YT.Player, volume: number) {
		this.player = player;
    this.logService.log(LogType.Info, 'onPlayerReady');

		this.volume = volume

		if (this.playWhenReady) {
			this.playViaPlayer();
		}

		player.getIframe().onfullscreenchange = () => {
			this.isFullScreen = !this.isFullScreen
			console.log(this.isFullScreen)
			if (this.isFullScreen) {
				this.playerElement.nativeElement.classList.remove('hide')
			} else {
				this.playerElement.nativeElement.classList.add('hide')
			}
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
	}

	toFullScreen() {
		this.player?.getIframe().requestFullscreen()
	}

	private currentTime = 0

	play() {
		this.player?.playVideo()
		this.player?.seekTo(this.currentTime, true)
	}

	playFromStart(track: ITrack) {
		if (this.player === undefined) {
			this.playWhenReady = true
		} else {
			let currentIdInPlayer = this.getIdFromVideoUrl(this.player.getVideoUrl())
			console.log('currentIdInPlayer', currentIdInPlayer)
			if (track.youtubeId !== currentIdInPlayer) {
			// 	// this.playWhenReady = true
				console.log('*************** smu *******************')
				console.log(track.youtubeId)
			// 	this.playWhenReady = false
				this.player.loadVideoById(track.youtubeId)
			// 	this.player.playVideo()
			// 	this.instancePlayedListeners.forEach((listener) => listener())
			} else {
				this.playViaPlayer()
			}
		}
	}

	private getIdFromVideoUrl(videoUrl: string) {
		if (!videoUrl) {
			return ''
		}
		return videoUrl.split('?v=')[1]
	}

	private playViaPlayer() {
		this.playWhenReady = false
		this.player?.playVideo();
		this.instancePlayedListeners.forEach((listener) => listener())
	}

	pause() {
		if (this.player === undefined) {
			return
		}
		this.currentTime = this.player.getCurrentTime()
		this.player.pauseVideo();
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
