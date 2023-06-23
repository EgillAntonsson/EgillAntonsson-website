import { kdb, geometry } from "./kdb"
// import { sync } from './sync';

export var fade = function() {
	var quad, shader;

	var initialize = function(gl) {
		quad = geometry.quad(1);

		shader = new kdb.Program('v_background', 'f_background');
		shader.attribute('vertex');
		shader.uniform('uColor');

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	};

	var update = function(gl, time, dt) {
		var alpha = 1 - sync.interval(time, 0, 1, 95, 1);

		shader.use();
		quad.bind(gl);

		gl.uniform4f(shader.u.uColor, 1, 1, 1, alpha);

		gl.enable(gl.BLEND);
		quad.draw(gl);
		gl.disable(gl.BLEND);
	};

	return {
		initialize : initialize,
		update : update
	};
}();
