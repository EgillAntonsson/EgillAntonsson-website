import { createNoise2D } from 'simplex-noise';
import { kdb } from "./kdb";
import { camera } from "./camera";
import { sync } from "./sync";
import { mat4 } from "gl-matrix";

export var landscape = function() {
	var W = 100;
	var H = 200;

	var buffer, shader;

	var initialize = function(gl) {
		var vertices=[];

    	// var simplex = new SimplexNoise(new Alea(2));
			var noise2D = createNoise2D();

		var fbm = function(x, y) {
			var value = 0;

			value += Math.abs(1.00 * noise2D(0.005*x, 0.005*y));
			value += 0.50 * noise2D(0.01*x, 0.01*y);
			value += 0.25 * noise2D(0.02*x, 0.02*y);
			value += 0.12 * noise2D(0.04*x, 0.04*y);

			return value * 5;
		};

		var push = function(x, y) {
			var xlimit = Math.max(0, x*x/6000 - 0.1);
			var ylimit = Math.max(0, y*y/80000 - 1);
			var scale = xlimit + ylimit;


			vertices.push(y);
			vertices.push(fbm(x, y)*scale);
			vertices.push(x);
		};

		var scale = 8;
		for (var y=0;y<H;y++) {
			var reverse = (y & 1);
			for (var x=0;x<W;x++) {
				var ax = reverse ? W-x-1 : x;
				var ay = y;

				var px = scale * (ax - Math.floor(W/2));
				var py = scale * (ay - Math.floor(H/2));
				var py1 = py + scale;


				if (y > 0 && (y&1) === 0 && x === 0) {
					push(px, py);
				}

				push(px, py);
				push(px, py1);

				if ((y&1) === 1 && x + 1 === W) {
					push(px, py);
				}
			}
		}
		buffer = kdb.staticBuffer(3, vertices);

		shader = new kdb.Program('v_solid', 'f_plasma');
		shader.attribute('vertex');
		shader.uniform('uProjection');
		shader.uniform('uView');
		shader.uniform('uModel');
		shader.uniform('uTime');
		shader.uniform('uMix');
	};

	var update = function(gl, time, dt) {
		var projection = camera.projection();
		var view = camera.view();
		var model = mat4.create()

		// make the plasma fade in with the fade-in of the synth (not in music right now, but will be)
		var plasma = sync.interval(time, 28, 4, 84, 4);
		var desaturate = sync.interval(time, 64, 2, 80, 4);

		shader.use();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(shader.a.vertex);
		gl.vertexAttribPointer(shader.a.vertex, buffer.stride, gl.FLOAT, false, 0, 0);


		// commenting out for now

		// gl.uniformMatrix4fv(shader.u.uProjection, false, projection.elements);
		// gl.uniformMatrix4fv(shader.u.uView, false, view.elements);
		// gl.uniformMatrix4fv(shader.u.uModel, false, model.elements);

		gl.uniform1f(shader.u.uTime, time);
		gl.uniform2f(shader.u.uMix, plasma, desaturate);
		gl.uniform3f(shader.u.uColor, 1, 0, 1);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffer.elements);
	};

	return {
		initialize : initialize,
		update : update
	};
}();

// From http://baagoe.com/en/RandomMusings/javascript/
function Alea() {
  return (function(args) {
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    if (args.length == 0) {
      args = [+new Date];
    }
    var mash = Mash();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < args.length; i++) {
      s0 -= mash(args[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(args[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(args[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;

    var random = function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
    random.uint32 = function() {
      return random() * 0x100000000; // 2^32
    };
    random.fract53 = function() {
      return random() +
        (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Alea 0.9';
    random.args = args;
    return random;

  } (Array.prototype.slice.call(arguments)));
};

function Mash() {
	var n = 0xefc8249d;

	var mash = function (data) {
			data = data.toString();
			for (var i = 0; i < data.length; i++) {
					n += data.charCodeAt(i);
					var h = 0.02519603282416938 * n;
					n = h >>> 0;
					h -= n;
					h *= n;
					n = h >>> 0;
					h -= n;
					n += h * 0x100000000; // 2^32
			}
			return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
	};

	mash.version = 'Mash 0.9';
	return mash;
}
