// import { mat4, vec3 } from "gl-matrix";
import { kdb, geometry } from "./kdb";
import { sync } from "./sync";
import { camera } from "./camera";
import { clamp, alea } from "./utils";
import {Matrix4} from "../lib-vendor/webgl/cuon-matrix";

export var roller = function() {
	var cube, shader;
	var model = new Matrix4();

	var CUBE_COUNT = 60;
	var cubes = [];
	var lecube = [];

	var pattern = 	"#...###...###.#.#.###.###" +
					"#...#.....#...#.#.#.#.#.." +
					"#...##....#...#.#.###.##." +
					"#...#.....#...#.#.#.#.#.." +
					"###.###...###.###.###.###";

	var edgeDistance = Math.sqrt(2)-1;
	var roll = function(matrix, alpha) {
		var x = -2*alpha;
		var y = Math.sin(3.1415*alpha) * edgeDistance;

		matrix.setIdentity();
		matrix.translate(-x, y, 0);
		matrix.rotate(-90*alpha, 0, 0, 1);

		return matrix;
	};

	var initialize = function(gl) {
		gl.disable(gl.CULL_FACE);

		cube = geometry.cube(1);
		shader = new kdb.Program('v_solid', 'f_solid');
		shader.attribute('vertex');
		shader.uniform('uProjection');
		shader.uniform('uView');
		shader.uniform('uModel');
		shader.uniform('uColor');

		var i, x, y, z;
		var random = new alea(1);

		var offset = [-250, 1, 0];
		for (i=pattern.length-1;i>=0;i--) {
			if (pattern.charAt(i) == '.') {
				continue;
			}

			var px = (i % 25);
			var py = parseInt(i / 25);

			x = offset[0] + 2 * px;
			y = offset[1];
			z = offset[2] + 2 * py;

			lecube.push([x, y, z]);
		}

		var occupied = {};
		var last = null;
		var current = null;
		var lastZ = -1;
		var delta = 0;
		for (i=0;i<CUBE_COUNT;i++) {
			z = lecube[i][2];

			if (lastZ != z) {
				lastZ = z;
				last = current;
				current = [];
				delta = Math.floor(random()*4);
			}

			delta += 1 + Math.floor(random()*3);

			if (last !== null) {
				for (var j=0;j<last.length;j++) {
					if (lecube[i][0] - 2*delta === last[j]) {
						delta++;
						break;
					}
				}
			}
			current.push(lecube[i][0] - 2*delta);

			x = lecube[i][0] - 2*delta;
			y = lecube[i][1];

			lecube[i][0] += 150;

			cubes.push([x,y,z]);
		}
	};

	var update = function(gl, time, dt) {
		var t = time - sync.totime(7.5);
		t += 0.1 * sync.step(time, 32);

		var step = sync.step(t, 0);

		var T = t*2.0*60.0/85.0;
		var alpha = step*(T % 1);

		var dx = step * Math.floor(sync.tounit(2*t)) * 2;
		var dxfract = 2*alpha;

		var c = sync.interval(time, 4, 4, 62, 2) * 0.5;
		var color = [c,0,0];


		var projection = camera.projection();
		var view = camera.view();

		shader.use();
		cube.bind(gl, shader.a.vertex);

		gl.uniformMatrix4fv(shader.u.uProjection, false, projection.elements);
		gl.uniformMatrix4fv(shader.u.uView, false, view.elements);
		gl.uniform3f(shader.u.uColor, color[0], color[1], color[2]);

		roll(model, clamp(alpha*1.2, 0, 1));

		var m = new Matrix4();

		for (var i=0;i<CUBE_COUNT;i++) {

			var p = cubes[i];

			if (lecube[i][0] <= p[0] + dx) {
				p = lecube[i];
				m.setTranslate(p[0], p[1], p[2]);
			} else {
				m.setTranslate(p[0] + dx, p[1], p[2]);
				m.concat(model);
			}

			gl.uniformMatrix4fv(shader.u.uModel, false, m.elements);

			cube.draw(gl);
		}
	};

	return {
		initialize : initialize,
		update : update
	};
}();
