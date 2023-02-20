import { ElementRef, Injectable } from "@angular/core";
import { LogType } from "shared/enums/logType";
import { LogService } from "./log.service";
import { WindowRefService } from './windowRef.service'
import { MessageService } from "./message.service";
import { MessageType } from 'app/shared/services/message.service'
import { HtmlElementService } from './htmlElement.service'
import { YoutubeTrack } from "../data/track";

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
	private playerHeight = 200;

	readonly instancePlayedListeners!: Map<string, () => void>
	readonly instanceEndedListeners!: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>

	constructor(private windowRef: WindowRefService, private messageService: MessageService, private logService: LogService, private htmlService: HtmlElementService) {
		this.instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()
	}

	savePlayerElement(playerElement: ElementRef<any>) {
		this.playerElement = playerElement
	}

	onWindowInitSize(width: number, _height: number) {
		this.playerWidth = width
	}

	onWindowResize(width: number, _height: number) {
		this.setPlayerSize(width)
	}

	private setPlayerSize(width: number) {
		if (this.player === undefined) {
			return
		}

		// below is ok for now
		// the margin has to match the margin in styles.css

		let playerMargin = 0
		if (width < 451) {
			playerMargin = 0
			console.log('below or equal 451')
		} else if (width <= 703) {
			playerMargin = 0.1
			console.log('below or equal 703')
		} else if (width <= 1053) {
			playerMargin = 0.2
			console.log('below or equal 1053')
		} else if (width <= 1403) {
			playerMargin = 0.3
			console.log('below or equal 1403')
		} else if (width <= 2000) {
			playerMargin = 0.35
			console.log('below or equal 2000')
		} else  {
			playerMargin = 0.37
			console.log('above 2000')
		}

		this.logService.log(LogType.Info, 'YoutubeService:setPlayerSize: width before', width);

		let w = width
		let bodyMargin = 0.05
		let offset = 3 //0.009

		let playerContainerWidth = w * (1 - (bodyMargin * 2))

		console.log(playerContainerWidth)

		w = playerContainerWidth * (1 - (playerMargin * 2))

		console.log('width after',w)

		this.playerWidth = w + offset

		let nineSixteenRatio = 0.5625
		this.playerHeight = this.playerWidth * nineSixteenRatio

		this.player.setSize(this.playerWidth, this.playerHeight)

		let headerContainerElement = this.htmlService.get('headerContainer')
		let headerBackgroundElement = this.htmlService.get('headerBackground')

		// height has to match what is in styles.css and view calculation
		// nav tag is calculated height 35px
		// padding at top and add below player set to 22
		let contHeight = 22 + 35 + this.playerHeight

		headerContainerElement.value.nativeElement.style.height =  contHeight + 'px'
		headerBackgroundElement.value.nativeElement.style.height =  contHeight + 'px'
	}

	onPlayerReady(player: YT.Player, volume: number, isSelectedTrackWithActiveYoutubeVisuals: boolean) {
    this.logService.log(LogType.Info, 'onPlayerReady, width and heigh:', this.playerWidth, this.playerHeight);
		this.player = player;
		if (isSelectedTrackWithActiveYoutubeVisuals) {
			this.setPlayerSize(this.playerWidth)
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
