// import { mat4 } from "gl-matrix";
import {sync} from "./sync";
import {text} from "./text";
import { kdb } from "./kdb"
import { linear } from "./utils"
import {Matrix4} from "../lib-vendor/webgl/cuon-matrix";

export var scroller = function() {
	var shader;
	var texts;

	var projection = new Matrix4();
	var view = new Matrix4();
	var model = new Matrix4();

	var initialize = function(gl) {
        texts = [
        	{
        		text: "WARNING! THINKING OUTSIDE THE BOX MAY CAUSE PERMANENT BRAIN DAMAGE. SIDE EFFECTS MAY INCLUDE, BUT IS NOT LIMITED TO: ANXIETY, CONFUSION, NERVOUSNESS AND INSOMNIA",
        		start: 0,
        		stop: sync.totime(8),
        		x: [1, -6],
        		y: [-0.5, -0.5],
        		scale: 0.01,
        		color: [0.8, 0.2, 0.2]
        	}, {
        		text: "KLOVMAN: CODE",
        		start: sync.totime(2),
        		stop:  sync.totime(3.75),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "VULKANOMAN: MUSIC + CODE",
        		start: sync.totime(4),
        		stop:  sync.totime(5.75),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "             LE CUBE",
        		start: sync.totime(6),
        		stop:  sync.totime(8),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
					}, {
        		text: "            FROM 2014",
        		start: sync.totime(9),
        		stop:  sync.totime(11),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "NOW WITH MASS PSYCHOSIS",
        		start: sync.totime(13),
        		stop:  sync.totime(15),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
					}, {
        		text: "SPHERES ARE BORING",
        		start: sync.totime(16),
        		stop:  sync.totime(19),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "LINES ARE TOO THIN",
        		start: sync.totime(20),
        		stop:  sync.totime(23),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "CUBE IS THE NEW BLACK",
        		start: sync.totime(24),
        		stop:  sync.totime(27),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, { // 8
        		text: "WE ARE CUBING",
        		start: sync.totime(72),
        		stop:  sync.totime(74),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "PANDA DESIGN",
        		start: sync.totime(74),
        		stop:  sync.totime(75),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, { // 10
        		text: "ZWORP",
        		start: sync.totime(75),
        		stop:  sync.totime(76),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "DERIL",
        		start: sync.totime(76),
        		stop:  sync.totime(77),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, { // 12
        		text: "PILGRIM",
        		start: sync.totime(77),
        		stop:  sync.totime(78),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "JONAS + DAVID",
        		start: sync.totime(78),
        		stop:  sync.totime(79),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "ORREBORRE",
        		start: sync.totime(79),
        		stop:  sync.totime(80),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, { // 15
        		text: "BAN",
        		start: sync.totime(80),
        		stop:  sync.totime(81),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "ELIN",
        		start: sync.totime(81),
        		stop:  sync.totime(82),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "SASQ",
        		start: sync.totime(82),
        		stop:  sync.totime(83),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "IRIDON",
        		start: sync.totime(83),
        		stop:  sync.totime(84),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "PIXELJUICE",
        		start: sync.totime(84),
        		stop:  sync.totime(85),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, { // 20
        		text: "XOOMIE",
        		start: sync.totime(85),
        		stop:  sync.totime(86),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "TANIS",
        		start: sync.totime(86),
        		stop:  sync.totime(87),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "GEEZER",
        		start: sync.totime(87),
        		stop:  sync.totime(88),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "MATHMAN",
        		start: sync.totime(88),
        		stop:  sync.totime(89),
        		fadeTime: sync.totime(0.25),
        		color: [1, 1, 1]
        	}, {
        		text: "YOU",
        		start: sync.totime(89),
        		stop:  sync.totime(91),
        		fadeTime: sync.totime(0.5),
        		color: [1, 1, 1]
        	}
        ];

        for (var i = 0; i < texts.length; i++) {
			texts[i].message = text.create(texts[i].text);
        }

		shader = new kdb.Program('v_solid', 'f_text');
		shader.attribute('vertex');
		shader.uniform('uProjection');
		shader.uniform('uView');
		shader.uniform('uModel');
		shader.uniform('uColor');
		gl.lineWidth(3);

		var bottom = -9/16;
		var top = 9/16;
		projection.ortho(-1, 1, bottom, top, 0.1, 100);
	};

	var nextdistortion = 0;
	var distortion = 0;

	var scroll = function(gl, time, index, globaltime) {
		var detail = texts[index];
		if (time < detail.start || detail.stop < time) {
			return;
		}
		var alpha = (time - detail.start) / (detail.stop - detail.start);

		var x = detail.x[0] + alpha * (detail.x[1] - detail.x[0]);
		var y = detail.y[0] + alpha * (detail.y[1] - detail.y[0]);
		var z = -1;

		var scale = detail.scale || 0.02;
		model.setIdentity();
		model.translate(x, y, z);
		model.scale(scale, scale, scale);

		gl.uniformMatrix4fv(shader.u.uModel, false, model.elements);
		gl.uniform3f(shader.u.uColor, detail.color[0], detail.color[1], detail.color[2]);

		var message = detail.message;
		message.bind(gl, shader.a.vertex);

		if (index === 0) {
			var a = sync.interval(globaltime, 64, 4, 80, 4);
			message.drawPartially(gl, 1 - a*distortion);

			if (globaltime >= nextdistortion) {
				nextdistortion = globaltime + 0.1;
				distortion = Math.random();
			}

		} else {
			message.draw(gl);
		}
	};


	var fadein = function(gl, time, index) {
		var detail = texts[index];
		if (detail === undefined || time < detail.start || detail.stop < time) {
			return;
		}
		var alpha = (time - detail.start) / (detail.stop - detail.start);
		var message = detail.message;

		var scale = detail.scale || 0.02;
		var x =  -0.98; //(message.biggestXPos / 2)*scale;
		var y = 9/16 - 0.015;
		var z = -1;

		model.setIdentity();
		model.translate(x, y, z);
		model.scale(scale, scale, scale);

		gl.uniformMatrix4fv(shader.u.uModel, false, model.elements);
		gl.uniform3f(shader.u.uColor, detail.color[0], detail.color[1], detail.color[2]);

		var fadeTime = detail.fadeTime || sync.totime(1);
		var fade = linear.in(time, detail.start, fadeTime)*linear.out(time, detail.stop-fadeTime, fadeTime);

		message.bind(gl, shader.a.vertex);
		message.drawPartially(gl, fade);
	};

	var update = function(gl, time, dt) {
		shader.use();
		gl.uniformMatrix4fv(shader.u.uProjection, false, projection.elements);
		gl.uniformMatrix4fv(shader.u.uView, false, view.elements);

		gl.lineWidth(2);
		if (sync.tounit(time) < 88) {
			var warning = time - sync.totime(8);
			scroll(gl, warning % sync.totime(8), 0, time) ;
		}

		fadein(gl, time, 1);
		fadein(gl, time, 2);
		fadein(gl, time, 3);
		fadein(gl, time, 4);

		fadein(gl, time, 5);
		fadein(gl, time, 6);
		fadein(gl, time, 7);

		fadein(gl, time, 8);
		fadein(gl, time, 9);
		fadein(gl, time, 10);
		fadein(gl, time, 11);
		fadein(gl, time, 12);
		fadein(gl, time, 13);
		fadein(gl, time, 14);
		fadein(gl, time, 15);
		fadein(gl, time, 16);
		fadein(gl, time, 17);
		fadein(gl, time, 18);
		fadein(gl, time, 19);
		fadein(gl, time, 20);
		fadein(gl, time, 21);
		fadein(gl, time, 22);
		fadein(gl, time, 23);
		fadein(gl, time, 24);
	};

	return {
		initialize : initialize,
		update : update
	};
}();
