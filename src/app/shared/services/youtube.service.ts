import { BreakpointState } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { LogType } from "shared/enums/logType";
import { LogService } from "./log.service";
import { ScreenService } from "./screen.service";
import { WindowRefService } from './windowRef.service'

@Injectable({
	providedIn: 'root',
})

export class YoutubeService {

	private player: YT.Player | undefined;
	private playWhenReady = false

	readonly instancePlayedListeners!: Map<string, () => void>
	readonly instanceEndedListeners!: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>

	constructor(private screenService: ScreenService, private logService: LogService, private windowRef: WindowRefService) {
		this.instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()
	}

	onPlayerReady(player: YT.Player) {
		this.player = player;
    this.logService.log(LogType.Info, 'onPlayerReady');
    console.log(player.getPlaybackQuality());

		this.screenService.onBpMaxWidthXS().subscribe((onBpMaxWidthXS: BreakpointState) => {
			console.log("************* onBpMaxWidthXS", onBpMaxWidthXS)
			if (onBpMaxWidthXS.matches) {
				console.log("************* isBelowXS TRUE")
				player.setSize(352, 198)
			} else {
				player.setSize(416, 234)
			}
		});
		this.screenService.isBelowS().subscribe((isBelowS: BreakpointState) => {
			console.log("isBelowS", isBelowS)
			if (isBelowS.matches) {
				console.log("************* isBelowS ")
				player.setSize(416, 234)
			} else {
				console.log("************* isBelowS fase ")
			}
		});

		if (this.playWhenReady) {
			this.playViaPlayer();
		}

		this.windowRef.keepIFrameContentWindow(this.player.getIframe().contentWindow)
	}

	// OnPlayerStateChange(playerState: YT.PlayerState) {
	// 	if (playerState == YT.PlayerState.PAUSED) {

	// 	}
	// }

	play() {
		if (this.player === undefined) {
			this.playWhenReady = true
		} else {
			this.playViaPlayer()
		}
	}

	private playViaPlayer() {
		this.player?.playVideo();
		this.instancePlayedListeners.forEach((listener) => listener())
	}

	pause() {
		this.player?.pauseVideo();
	}

	// set volume(value: number) {
	// 	this._volume = value * 100
	// 	this.widget.setVolume(this._volume)
	// }

}
