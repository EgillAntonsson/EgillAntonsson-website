import {Injectable} from "@angular/core"
import {kdb} from '../services/realtimeVisualJs/lecube/kdb'
import {sync} from '../services/realtimeVisualJs/lecube/sync'
import {camera} from '../services/realtimeVisualJs/lecube/camera'
import {roller} from '../services/realtimeVisualJs/lecube/roller'
import {landscape} from '../services/realtimeVisualJs/lecube/landscape'
import {text} from '../services/realtimeVisualJs/lecube/text'
import {fade} from '../services/realtimeVisualJs/lecube/fade'
import {scroller} from '../services/realtimeVisualJs/lecube/scroller'

@Injectable({
	providedIn: 'root',
})

/*
 * Hardcoded to Lecube, which can hold until I have another realtime visual to implement.
 */
export class RealtimeVisualService {

	private playerWidth = 400
	private playerHeight = 300

	constructor() {}

	// onWindowResize should be called before init.
	init() {
		var gl = kdb.initialize("WebGLCanvas", this.playerWidth, this.playerHeight);
		if (gl === null) {
			alert("Could not initialize WebGL");
		} else {
			sync.init(85.0/60.0); // set the sync unit to 85 BPM

			this.initialize(gl, this.playerWidth, this.playerHeight);
		}

		return this.playerHeight
	}

	onWindowResize(windowWidth: number, windowHeight: number, offsetLeft: number) {
		const playerSize = this.getPlayerSize(windowWidth, windowHeight, offsetLeft)
		kdb.resize(playerSize.playerWidth, playerSize.playerHeight)
		this.playerWidth = playerSize.playerWidth
		this.playerHeight = playerSize.playerHeight
		return this.playerHeight
	}

	private getPlayerSize(windowWidth: number, windowHeight: number, offsetLeft: number) {
		var playerWidth = windowWidth
		console.log(offsetLeft)
		playerWidth -= offsetLeft * 2
		var playerHeight = windowHeight

		if (playerWidth < playerHeight*16/9) {
			playerHeight = Math.floor(playerWidth * 9 / 16);
		} else {
			playerWidth = Math.floor(playerHeight * 16 / 9);
		}

		// divide the size by two to save some power during development
		// the CSS style on #WebGLCanvas will scale it up by two to compensate
		// w /= 2;
		// h /= 2;

		return {playerWidth, playerHeight}
	}

	initialize(gl: { enable: (arg0: any) => void; DEPTH_TEST: any; CULL_FACE: any; }, _w: number, _h: number) {
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);

		camera.initialize(gl);
		roller.initialize(gl);
		landscape.initialize(gl);
		text.initialize(gl);
		fade.initialize(gl);
		scroller.initialize(gl);


		// seems to be only used for below DEBUG background effect.

		// quad = geometry.quad(1);

		// background = new kdb.Program('v_background', 'f_background');
		// background.attribute('vertex');


		// const musicElement = this.document.getElementById("music");
		// if (musicElement != null) {
		// 	const music = musicElement as HTMLAudioElement;
		// 	music.play();
		// }

			kdb.loop(this.main);

			kdb.setStartTime(-11.2)
			kdb.togglePause()
		}

	playFromStart(windowWidth: number, windowHeight: number, offsetLeft: number) {
		this.getPlayerSize(windowWidth, windowHeight, offsetLeft)
		kdb.setStartTime(0)
		kdb.togglePause()
	}

	main(gl: { clearColor: (arg0: number, arg1: number, arg2: number, arg3: number) => void; clear: (arg0: number) => void; COLOR_BUFFER_BIT: number; DEPTH_BUFFER_BIT: number; }, time: number, dt: any) {
		var end = 136;
		// cycle the background color over 2 beats
		var u = sync.unit(time, 2);
		var c = (Math.sin(u*3.1415) + 1.0) * 0.1;

		if (time >= end) {
			c = 1;
		}
		gl.clearColor(c, c, c, 1);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


		// DEBUG background effect
		//background.use();
		//quad.bind(gl, background.a.vertex);
		//quad.draw(gl);
		//gl.clear(gl.DEPTH_BUFFER_BIT);

		if (time >= end) {
			kdb.togglePause();
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
		kdb.togglePause();
	}

	resume() {
		var time = kdb.getStartTime();
		kdb.togglePause();
		var offsetToSyncTimeWithMusic = 0.6;
		kdb.setStartTime(time + offsetToSyncTimeWithMusic);
	}

}
