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

	onWindowResize(windowWidth: number, _windowHeight: number) {
		const rectMarginPercentageByWidthRange = new Map<WidthRange, number>([[WidthRange.Default, 0], [WidthRange.S, 0.05], [WidthRange.M, 0.15], [WidthRange.L, 0.25], [WidthRange.XL, 0.30]])
		const rectWidthCorrectionByWidthRange = new Map<WidthRange, number>([[WidthRange.Default, 0], [WidthRange.XXS, 16], [WidthRange.XS, 16], [WidthRange.S, 8], [WidthRange.M, 6], [WidthRange.L, 3]])
		const playerSize = this.screenService.getRectSizeForHorizontalCenter(windowWidth, rectMarginPercentageByWidthRange, rectWidthCorrectionByWidthRange)

		kdb.resize(playerSize.width, playerSize.height)
		this.playerWidth = playerSize.width
		this.playerHeight = playerSize.height
		return this.playerHeight
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
		const randomStartTime = this.getRandomStartTimeForStillImage()
		kdb.setStartTime(randomStartTime)
		kdb.doPause()
	}

	playFromStart() {
		if (!this.initialized) {
			return
		}
		kdb.setStartTime(0)
		kdb.resume()
	}

	getRandomStartTimeForStillImage() {
		const min = -110 // around the end of the track
		const max = -50 // around the start of the track
		return Math.random() * (max - min) + min
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
