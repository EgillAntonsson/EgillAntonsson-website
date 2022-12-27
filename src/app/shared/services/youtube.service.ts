import { ElementRef, Injectable } from "@angular/core";
import { LogType } from "shared/enums/logType";
import { LogService } from "./log.service";
import { WindowRefService } from './windowRef.service'
import { MessageService } from "./message.service";
import { MessageType } from 'app/shared/services/message.service'

@Injectable({
	providedIn: 'root',
})

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
				if (
					data.event === "infoDelivery" &&
					data.info &&
					data.info.volume
				) {
					// this.musicService.setMasterGainFromYoutubePlayer(data.info.volume / 100)
					// this.musicService.setMutedFromYoutubePlayer(data.info.muted)
					this.messageService.sendMessage({type: MessageType.YoutubeVolumeChange})
				}
			}
		});
	}

	toFullScreen() {
		this.player?.getIframe().requestFullscreen()
	}

	play() {
		if (this.player === undefined) {
			this.playWhenReady = true
		} else {
			this.playViaPlayer()
		}
	}

	private playViaPlayer() {
		this.playWhenReady = false
		this.player?.playVideo();
		this.instancePlayedListeners.forEach((listener) => listener())
	}

	pause() {
		this.player?.pauseVideo();
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
