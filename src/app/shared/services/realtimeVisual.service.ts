import {ElementRef, Injectable} from "@angular/core"
import {kdb} from '../services/realtimeVisualJs/lecube/kdb'
import {sync} from '../services/realtimeVisualJs/lecube/sync'
import {camera} from '../services/realtimeVisualJs/lecube/camera'
import {roller} from '../services/realtimeVisualJs/lecube/roller'
import {landscape} from '../services/realtimeVisualJs/lecube/landscape'
import {text} from '../services/realtimeVisualJs/lecube/text'
import {fade} from '../services/realtimeVisualJs/lecube/fade'
import {scroller} from '../services/realtimeVisualJs/lecube/scroller'
import { LogService } from "./log.service"
import { LogType } from 'shared/enums/logType'
import { ScreenService, WidthRange } from "./screen.service"

@Injectable({
	providedIn: 'root',
})

/**
 * Service for managing the WebGL canvas and rendering realtime visuals.
 * Hardcoded to a large extent to Lecube, which can hold until I have another realtime visual to implement.
 */
export class RealtimeVisualService {
	private playerWidth = 400
	private playerHeight = 300
	private initialized = false

	constructor(private logService: LogService, private screenService: ScreenService) {}

	/**
	 * Initializes the WebGL canvas and sets the sync unit to 85 BPM.
	 * onWindowResize should be called before init.
	 * @returns The height of the player.
	 */
	init(webGlCanvasElement: ElementRef<any>) {
		var gl = kdb.initialize(webGlCanvasElement.nativeElement, this.playerWidth, this.playerHeight);
		if (gl === null) {
			this.logService.log(LogType.Error, 'Could not initialize WebGL');
		} else {
			sync.init(85.0/60.0); // set the sync unit to 85 BPM
			this.initialize(gl);
			this.initialized = true
		}
		return this.playerHeight
	}

	onWindowResize(windowWidth: number, windowHeight: number, parentLeft: number, _parentWidth: number, playerMargin: number) {
		const playerSize = this.getPlayerSize(windowWidth, windowHeight, parentLeft, playerMargin)
		kdb.resize(playerSize.playerWidth, playerSize.playerHeight)
		this.playerWidth = playerSize.playerWidth
		this.playerHeight = playerSize.playerHeight
		return this.playerHeight
	}

	private getPlayerSize(windowWidth: number, windowHeight: number, parentLeft: number, playerMargin: number) {

		console.log('playerMargin', playerMargin)
		console.log('windowWidth', windowWidth)
		console.log('windowHeight', windowHeight)
		console.log('parentLeft', parentLeft)

		const widthRange = this.screenService.getCurrentWidthRange(windowWidth)
		let playerMarginLeftRightPercentage = 0
		// setting the offset to align with bottom horizontal line of the page
		let offset = 15
		switch (widthRange) {
			case WidthRange.XXS:
				playerMarginLeftRightPercentage = 0
				offset = 15
				break
			case WidthRange.XS:
				playerMarginLeftRightPercentage = 0
				offset = 15
				break
			case WidthRange.S:
				playerMarginLeftRightPercentage = 0.05
				offset = 15
				break
			case WidthRange.M:
				playerMarginLeftRightPercentage = 0.15
				offset = 15
				break
			case WidthRange.L:
				playerMarginLeftRightPercentage = 0.25
				offset = 20
				break
			case WidthRange.XL:
				playerMarginLeftRightPercentage = 0.30
				offset = 25
				break
		}


		console.log('widthRange', widthRange)
		console.log(playerMarginLeftRightPercentage)

		// let w = windowWidth
		// let bodyMarginLeftRightPercentage = 0.05
		// playerMarginLeftRightPercentage = 0

		// let playerContainerWidth = windowWidth * (1 - (bodyMarginLeftRightPercentage * 2))
		let playerContainerWidth = windowWidth - (parentLeft * 2)
		let w = playerContainerWidth * (1 - (playerMarginLeftRightPercentage * 2))
		let playerWidth = w - offset

		let nineSixteenRatio = 0.5625
		let playerHeight = playerWidth * nineSixteenRatio

		console.log(playerHeight, playerWidth, playerContainerWidth, w, offset)

		return { playerWidth, playerHeight }
		// return { playerWidth: orgW + offset, playerHeight: orgH }

		// const widthRange = this.screenService.getCurrentWidthRange(windowWidth)
		// let widthMultiplier = 1.0
		// // TODO: figure out why leftOffset is needed to center the player
		// let leftOffset = 6
		// // left property is set in css media screen
		// switch (widthRange) {
		// 	case WidthRange.S:
		// 		widthMultiplier = 0.8
		// 		leftOffset = 0
		// 		break
		// 	case WidthRange.M:
		// 		widthMultiplier = 0.6
		// 		leftOffset = -15
		// 		break
		// 	case WidthRange.L:
		// 		widthMultiplier = 0.5
		// 		leftOffset = -35
		// 		break
		// 	case WidthRange.XL:
		// 		widthMultiplier = 0.4
		// 		leftOffset = -50
		// 		break
		// }


		// var playerWidth = windowWidth
		// playerWidth *= widthMultiplier
		// playerWidth -= (parentLeft + leftOffset) * 2

		// var playerHeight = windowHeight;

		// if (playerWidth < playerHeight * 16 / 9) {
		// 	playerHeight = Math.floor(playerWidth * 9 / 16)
		// } else {
		// 	playerWidth = Math.floor(playerHeight * 16 / 9)
		// }

		// return { playerWidth, playerHeight }
	}

	private initialize(gl: { enable: (arg0: any) => void; DEPTH_TEST: any; CULL_FACE: any; }) {
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);

		camera.initialize(gl);
		roller.initialize(gl);
		landscape.initialize(gl);
		text.initialize(gl);
		fade.initialize(gl);
		scroller.initialize(gl);

		kdb.loop(this.main);
		kdb.setStartTime(-11.2)
		kdb.doPause()
	}

	playFromStart() {
		if (!this.initialized) {
			return
		}
		kdb.setStartTime(0)
		kdb.resume()
		// kdb.setStartTime(-100)
	}

	private main(gl: { clearColor: (arg0: number, arg1: number, arg2: number, arg3: number) => void; clear: (arg0: number) => void; COLOR_BUFFER_BIT: number; DEPTH_BUFFER_BIT: number; }, time: number, dt: any) {
		var end = 136;
		// cycle the background color over 2 beats
		var u = sync.unit(time, 2);
		var c = (Math.sin(u*3.1415) + 1.0) * 0.1;

		if (time >= end) {
			c = 1;
		}
		gl.clearColor(c, c, c, 1);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		if (time >= end) {
			kdb.doPause()
			return;
		}
		camera.update(gl, time, dt);
		landscape.update(gl, time, dt);
		roller.update(gl, time, dt);
		text.update(gl, time, dt);
		scroller.update(gl, time, dt);
		fade.update(gl, time, dt);
	}
	pause() {
		if (!this.initialized) {
			return
		}
		kdb.doPause()
	}

	resume() {
		if (!this.initialized) {
			return
		}
		var time = kdb.getStartTime();
		kdb.resume()
		var offsetToSyncTimeWithMusic = 0.6;
		kdb.setStartTime(time + offsetToSyncTimeWithMusic);
	}

}
