import { ElementRef, Injectable } from "@angular/core";
import { LogType } from "shared/enums/logType";
import { LogService } from "./log.service";
import { WindowRefService } from './windowRef.service'
import { MessageService } from "./message.service";
import { MessageType } from 'app/shared/services/message.service'
import { ITrack } from "../data/track";
import { ScreenService, WidthRange } from './screen.service'

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

	private playerWidth = 200;
	private readonly playerHeight = 200;

	readonly instancePlayedListeners!: Map<string, () => void>
	readonly instanceEndedListeners!: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>

	constructor(private windowRef: WindowRefService, private messageService: MessageService, private logService: LogService, private screenService: ScreenService) {
		this.instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()

		console.log(this.screenService)
	}

	savePlayerElement(playerElement: ElementRef<any>) {
		this.playerElement = playerElement
	}

	onWindowResize(width: number, _height: number) {
		this.setPlayerSize(width)

		// this.player?.setSize(width, this.playerHeight)
		// this.playerWidth = width
	}

	private setPlayerSize(width: number = 0) {
		console.log('width before', width)
		let w = 0
		if (width > 0) {
			let bodyMargin = 0.05
			let offset = 0.009
			w = width * (1 + offset - (bodyMargin * 2))

			if (this.screenService.currentWidthRange !== WidthRange.XS) {
				let playerMargin = 0.1
				switch (this.screenService.currentWidthRange) {
					case WidthRange.S:
						playerMargin = 0.1
						break;

					case WidthRange.M:
						playerMargin = 0.2
					break;

					default:
						break;
				}

				// w = w * (1 - ((playerMargin - 0.01) * 2))

				console.log(playerMargin)
				w = w * (1 - (playerMargin * 2))
			}
		} else {
			w = this.playerWidth
		}

		console.log('w after', w)

		this.player?.setSize(w, this.playerHeight)
		this.playerWidth = w
	}

	onPlayerReady(player: YT.Player, volume: number) {
    this.logService.log(LogType.Info, 'onPlayerReady');
		this.player = player;
		this.setPlayerSize()
		// this.player.setSize(this.playerWidth, this.playerHeight)
		this.volume = volume

		if (this.playWhenReady) {
			this.play();
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

	// private currentTime = 0

	// private ws = [150, 200, 250, 300, 350, 400]
	// private i = 0

	play() {
		this.playWhenReady = false
		this.player?.playVideo();
		this.instancePlayedListeners.forEach((listener) => listener())

		// this.player?.setSize(this.ws[this.i], this.ws[this.i])
		// this.i = this.i + 1
	}

	playFromStart(track: ITrack) {
		if (this.player === undefined) {
			this.playWhenReady = true
		} else {
			let currentIdInPlayer = this.getIdFromVideoUrl(this.player.getVideoUrl())
			console.log('currentIdInPlayer', currentIdInPlayer)
			if (track.youtubeId !== currentIdInPlayer) {
			// 	// this.playWhenReady = true
				console.log('*********** loading new youtube id ***************')
				console.log(track.youtubeId)
			// 	this.playWhenReady = false
				this.player.loadVideoById(track.youtubeId)
			// 	this.player.playVideo()
			// 	this.instancePlayedListeners.forEach((listener) => listener())
			} else {
				this.play()
			}
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

		// if (this.player === undefined) {
		// 	return
		// }
		// this.currentTime = this.player.getCurrentTime()
		// this.player.pauseVideo();
		// this.logService.log(LogType.Info, 'currentTime', this.currentTime)
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
