import { mat4, vec3 } from "gl-matrix";
import { kdb, geometry } from "./kdb";
import { sync } from "./sync";
import { camera } from "./camera";
import { clamp, alea } from "./utils";

export var roller = function() {
	var cube, shader;
	var model = mat4.create();

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

		mat4.identity(matrix);
		var degrees = -90*alpha;
		var radians = degrees * Math.PI / 180;
		const axis = vec3.create();
		axis[0] = 0;
		axis[1] = 0;
		axis[2] = 1;
		mat4.translate(matrix, matrix, [-x, y, 0]);

		// TODO: fix the rotation
		// mat4.rotate(matrix, matrix, radians, axis);

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

		// debug
		// T = T + 14;
		// console.log(T);

		var alpha = step*(T % 1);

		// console.log(alpha);

		var dx = step * Math.floor(sync.tounit(2*t)) * 2;
		var dxfract = 2*alpha;

		var c = sync.interval(time, 4, 4, 62, 2) * 0.5;
		var color = [c,0,0];


		var projection = camera.projection();
		var view = camera.view();

		shader.use();
		cube.bind(gl, shader.a.vertex);

		gl.uniformMatrix4fv(shader.u.uProjection, false, projection);
		gl.uniformMatrix4fv(shader.u.uView, false, view);
		gl.uniform3f(shader.u.uColor, color[0], color[1], color[2]);

		roll(model, clamp(alpha*1.2, 0, 1));

		var m = mat4.create();

		for (var i=0;i<CUBE_COUNT;i++) {
			var p = cubes[i];

			if (lecube[i][0] <= p[0] + dx) {
				p = lecube[i];
				mat4.translate(m, model, [p[0], p[1], p[2]]);
			} else {
				mat4.translate(m, model, [p[0] + dx, p[1], p[2]]);

				// INFO: This is probably needed when when the rotation is fixed
				// m.concat(model); // old way, just for reference
				// mat4.multiply(m, m, model); // new way
			}

			gl.uniformMatrix4fv(shader.u.uModel, false, m);

			cube.draw(gl);
		}
	};

	return {
		initialize : initialize,
		update : update
	};
}();
