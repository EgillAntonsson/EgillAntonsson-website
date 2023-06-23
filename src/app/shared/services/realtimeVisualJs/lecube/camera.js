import { mat4, vec3 } from "gl-matrix";
import { sync } from "./sync";

export var camera = function() {
	var projection = mat4.create();
	var view = mat4.create();
	var model = mat4.create();

	var eyeX = 10;
	var eyeY = 10;
	var eyeZ = 15;

	var centerX = 0;
	var centerY = 0;
	var centerZ = 0;

	var initialize = function(gl) {
		gl.disable(gl.CULL_FACE);
		// projection.SetPerspective(90, 16/9, 0.1, 1000);
		mat4.perspectiveNO(projection, 90, 16/9, 0.1, 1000);
	};

	var overTheTop = function(t, offsetX) {
		eyeX = offsetX + 5*t;
		eyeY = 5;
		eyeZ = 5;
		centerX = eyeX - 2;
		centerY = eyeY - 1;
		centerZ = eyeZ;
	};

	var closeRight = function(t, offsetX) {
		eyeX = offsetX + 10*t;
		eyeY = 5;
		eyeZ = -10;
		centerX = eyeX + 2;
		centerY = eyeY;
		centerZ = eyeZ + 10;
	};

	var closeLeft = function(t, offsetX) {
		eyeX = offsetX + 5*t;
		eyeY = 5;
		eyeZ = 15;
		centerX = eyeX - 2;
		centerY = eyeY;
		centerZ = eyeZ - 10 - t;
	};

	var update = function(gl, time, dt) {
		var unit = sync.tounit(time);
		var t, radius;
		if (unit < 2) {
			// far away
			eyeX = -300 + 10*time;
			eyeY = 20;
			eyeZ = -50;
			centerX = -250;
			centerY = eyeY;
			centerZ = eyeZ + 150;
		} else if (unit < 4) {
			// midle range
			t = time - sync.totime(2);
			eyeX = -300 + 10*t;
			eyeY = 10;
			eyeZ = -20;
			centerX = eyeX + 2;
			centerY = eyeY;
			centerZ = eyeZ + 10;
		} else if (unit < 6) {
			closeRight(time - sync.totime(4), -300);
		} else if (unit < 12) {
			overTheTop(time - sync.totime(8), -220);
		} else if (unit < 16) {
			closeLeft(time - sync.totime(12), -280);
		} else if (unit < 20) {
			// in front
			t = time - sync.totime(18);
			eyeX = -160 + 2*t;
			eyeY = 1;
			eyeZ = 5;
			centerX = eyeX - 4;
			centerY = eyeY + 0.5;
			centerZ = eyeZ;
		} else if (unit < 24) {
			closeRight(time - sync.totime(20), -260);
		} else if (unit < 28) {
			closeLeft(time - sync.totime(24), -240);
		} else if (unit < 32) {
			// over the top again...
			t = time - sync.totime(28);
			eyeX = -120 + 2*t;
			eyeY = 15;
			eyeZ = 5;
			centerX = eyeX - 2;
			centerY = eyeY - 2;
			centerZ = eyeZ;
		} else if (unit < 72) {
			t = time - sync.totime(32);

			var tc = ease.inOut(time - sync.totime(54), 0, 1, sync.totime(10));

			centerX = -100 + ease.inOut(time - sync.totime(44), 0, 24, sync.totime(20));
			centerY = 1;
			centerZ = 4;

			radius = 15 + 10*sync.fadein(t, 0, 8) - ease.inOut(time - sync.totime(62), 0, 10, sync.totime(6));

			var angle = 3 + 0.1 * ease.inOut(t, 0, sync.totime(55-32), sync.totime(55-32));
			eyeX = centerX + Math.sin(angle)*radius + tc * 2;
			eyeY = 8 + 16 * sync.fadein(t, 0, 8) - tc*4 ;
			eyeZ = centerZ + Math.cos(angle)*radius - tc*4;
		} else {
			t = time - sync.totime(72);

			centerX = -60;
			centerY = 1;
			centerZ = 4;

			radius = 40 + ease.inOut(t, 0, 30, sync.totime(96-72));

			eyeX = centerX + Math.sin(t*0.25)*radius;
			eyeY = 15 + ease.inOut(t, 0, 35, sync.totime(96-72));
			eyeZ = centerZ + Math.cos(t*0.25)*radius;
		}


		const eye = vec3.create();
eye[0] = eyeX;
eye[1] = eyeY;
eye[2] = eyeZ;

const center = vec3.create();
center[0] = centerX;
center[1] = centerY;
center[2] = centerZ;

const up = vec3.create();
up[0] = 0;
up[1] = 1;
up[2] = 0;

		mat4.lookAt(view, eye, center, up)
		// view.setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, 0, 1, 0);
	};

	return {
		initialize : initialize,
		update : update,
		projection : function() { return projection; },
		view : function() { return view; }
	};
}();
