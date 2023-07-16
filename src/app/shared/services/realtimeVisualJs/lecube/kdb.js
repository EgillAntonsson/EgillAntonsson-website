import { WebGLUtils } from "../lib-vendor/webgl/webgl-utils";

export var kdb = function() {
	var canvas = null;
	var gl = null;
	var pause = false;
	var updateCallback = null;
	var startTime = 0;
	var showTime = true;
	var shaderMap = {};
	var canvasId = "";

	var setStartTime = function(time) {
		startTime = time
	}

	var getStartTime = function() {
		return startTime
	}

	/**
	 * Initialize WebGL and KDB.
	 * @param {string} canvasId
	 * @param {int} width
	 * @param {int} height
	 */
	var initialize = function(canvasId, width, height) {
		this.canvasId = canvasId
		canvas = document.getElementById(this.canvasId)

		canvas.width = width;
		canvas.height = height;

		window.addEventListener('keydown', function(e) {
			switch (e.key) {
				case 32:
					showTime = true;
					break;
				case 77:
					document.getElementById("WebAudio").pause();
					break;
				case 27:
					togglePause();
					var audio = document.getElementById("WebAudio");
					if (audio.paused) {
						audio.play();
					} else {
						audio.pause();
					}
					break;
				case 'b':
					console.log('b pressed')
					startTime += 2;
					showTime = true;
					break;
				case 'f':
					startTime -= 2;
					showTime = true;
					break;
				default:
					console.log(e.key);
			}
		});

		try {
			gl = WebGLUtils.setupWebGL(canvas);
			gl.getExtension('OES_standard_derivatives');
			gl.viewport(0, 0, canvas.width, canvas.height);
			console.log("KDB: viewport (" + width + ", " + height + ")");
			return gl;
		} catch (e) {
			console.log("Could not initialize WebGL", e);
			return null;
		}
	};

	var resize = function(width, height) {
		if (this.canvasId === undefined || this.canvasId === null) {
			return
		}

		console.log("smu")

		const canvasTemp = gl.canvas

		canvasTemp.width = width;
		canvasTemp.height = height;

		gl.viewport(0, 0, width, height)

		canvas = document.getElementById(this.canvasId)
		canvas.width = width;
		canvas.height = height;
	};

	/**
	 * Toggles the pause state.
	 */
	var togglePause = function() {
		if (updateCallback === null) {
			// not started yet
			return;
		}
		pause = !pause;
		if (pause) {
			console.log("KDB: Paused");
		} else {
			console.log("KDB: Unpaused");
			loop(updateCallback);
		}
	};

	/**
	 * Set the function that should be used in the main loop.
	 * @param {function(gl, time, deltaTime)} callback
	 */
	var loop = function(callback) {
		if (showTime) {
			console.log("Time: " + startTime);
		}
		updateCallback = callback;
		startTime = performance.now()*0.001;
		var lastFrame = startTime;
		var tick = function(time) {
			if (!isNaN(time)) {
				var t = time*0.001;
				var dt = (t - lastFrame);
				lastFrame = t;
				var tt = Math.max(0, t - startTime);
				callback(gl, tt, dt);
			}
			if (!pause) {
				requestAnimationFrame(tick);
			}
		};
		tick();
	};

	/**
	 * Turn on fullscreen.
	 */
	var fullscreen = function() {
		var el = document.documentElement;
		var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
	 	//rfs.call(el);
	};

	/**
	 * Load an image from a dataUrl.
	 * @param {base64encoded data} data
	 * @param {function(width, height, pixeldata) callback
	 */
	var loadImage = function(data, callback) {
		var image = new Image();
		image.onload = function() {
		    var canvas = document.createElement('canvas');
		    canvas.width = image.width;
		    canvas.height = image.height;

		    var context = canvas.getContext('2d');
		    context.drawImage(image, 0, 0);
		    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

		    callback(image.width, image.height, imageData);
		};
		image.src = data;
	};

	var loadText = function(text) {
	    var canvas = document.createElement('canvas');
	    canvas.width = 400;
	    canvas.height = 40;

	    var context = canvas.getContext('2d');
	    context.fillStyle = "#00FF00";
	    context.textAlign = "center";
	    context.textBaseline = "top";
	    context.font = "32px monospace";
	    context.fillText(text, canvas.width/2, 0);
	    return context.getImageData(0, 0, canvas.width, canvas.height);
	};

	var staticBuffer = function(stride, vertices) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		buffer.elements = vertices.length / stride;
		buffer.stride = stride;
		return buffer;
	};

	/** Shader utilities */
	var shader = {
		/**
		 * Compile a shader from the source in a script tag with the type set to:
		 *  'x-shader/x-fragment' for fragment shaders
		 *  'x-shader/x-vertex' for vertex shaders
		 *  @return A shader id or null
		 */
		compile : function(elementId) {
			var element = document.getElementById(elementId);
			if (!element) {
				console.log("Can't find element " + elementId);
				return null;
			}

			if (element.type == "x-shader/x-fragment") {
				shader = gl.createShader(gl.FRAGMENT_SHADER);
			} else if (element.type == "x-shader/x-vertex") {
				shader = gl.createShader(gl.VERTEX_SHADER);
			} else {
				console.log("Unsupported shader type: " + element.type);
				return null;
			}

			// element.innerText is not recognized by firefox, so this the workaround
			var source = element[document.textContent === null ? 'textContent' : 'innerText'].trim();
			gl.shaderSource(shader, source);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.log("Can't compile shader " + elementId, gl.getShaderInfoLog(shader));
				return null;
			}

			return shader;
		},

		/**
		 * Links together a vertex shader and a fragment shader to a shader program.
		 * @param {shader id} vertexShader
		 * @param {shader id} fragmentShader
		 * @return Program id or null
		 */
		link : function(vertexShader, fragmentShader) {
			var program = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);

			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				console.log("Can't link program ");
				return null;
			}

			return program;
		}
	};

	/**
	 * Creates a dynamic array buffer for the data.
	 * @param {int} tride Stride of the data, vertex data usually have 3
	 * @param {array} data Data to put in the buffer
	 */
	var Buffer = function(stride, data) {
		this.id = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
		this.elements = data.length / stride;
		this.stride = stride;
	};

	/**
	 * Bind the buffer.
	 */
	Buffer.prototype.bind = function() {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
	};

	/**
	 * Update the buffer with new data.
	 * @param {int} offset The offset to update at
	 * @param {array} data Data to update
	 */
	Buffer.prototype.update = function(offset, data) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
		gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(data));
	};

	/**
	 * Creates a shader program.
	 */
	var Program = function(vertexShaderId, fragmentShaderId) {
		this.shaderid=vertexShaderId+fragmentShaderId;
		this.a = {};
		this.u = {};

		if (shaderMap[this.shaderid] !== undefined) {
			var cache = shaderMap[this.shaderid];
			this.program = cache.program;
		} else {
			var vertex = kdb.shader.compile(vertexShaderId);
			var fragment = kdb.shader.compile(fragmentShaderId);
			this.program = kdb.shader.link(vertex, fragment);

			shaderMap[this.shaderid] = {
				program : this.program
			};
		}

		if (this.program === null) {
			throw "Can't create Program<"+vertexShaderId+", "+fragmentShaderId+">";
		}
	};

	/**
	 * Start using the program.
	 */
	Program.prototype.use = function() {
		if (window.activeShader === undefined || window.activeShader !== this.shaderid) {
			gl.useProgram(this.program);
		}
		window.activeShader = this.shaderid;
	};

	/**
	 * Adds an attribute to the program which is available on <THIS>.a.<ATTRIBUTE NAME>.
	 * @param {string} name Name of the attribute.
	 */
	Program.prototype.attribute = function(name) {
		this.a[name] = gl.getAttribLocation(this.program, name);
		if (this.a[name] < 0) {
			console.log("Attribute " + name + " was not found");
		}
	};

	/**
	 * Adds an uniform to the program which is available on <THIS>.a.<UNIFORM NAME>.
	 * @param {string} name Name of the uniform.
	 */
	Program.prototype.uniform = function(name) {
		this.u[name] = gl.getUniformLocation(this.program, name);
		if (this.u[name] === undefined) {
			console.log("Uniform " + name + " was not found");
		}
	};

	return {
		initialize : initialize,
		resize : resize,
		fullscreen : fullscreen,
		togglePause : togglePause,
		loop : loop,
		loadImage : loadImage,
		loadText : loadText,
		staticBuffer : staticBuffer,
		shader : shader,
		Program : Program,
		Buffer : Buffer,
		setStartTime:	setStartTime,
		getStartTime:	getStartTime
	};
}();


export var geometry = function() {

	var quad = function(size) {
		var buffer = kdb.staticBuffer(3, [-size, -size, 0, size, -size, 0, -size, size, 0, size, size, 0]);
		return {
			bind : function(gl, attribute) {
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.enableVertexAttribArray(attribute);
				gl.vertexAttribPointer(attribute, buffer.stride, gl.FLOAT, false, 0, 0);
			},
			draw : function(gl) {
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffer.elements);
			}
		};
	};

	var cube = function(size) {
		var s = size;
		var buffer = kdb.staticBuffer(3, [
				 s, -s, -s,	// A
				 s, -s,  s,	// B
				-s, -s, -s,	// C
				-s, -s,  s,	// D
				-s,  s,  s,	// E
				 s, -s,  s,	// B
				 s,  s,  s, // F
				 s,  s, -s,	// G
				-s,  s,  s,	// E
				-s,  s, -s,	// H
				-s, -s, -s,	// C
				 s,  s, -s,	// G
				 s, -s, -s,	// A
				 s, -s,  s	// B
			]);
		return {
			bind : function(gl, attribute) {
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.enableVertexAttribArray(attribute);
				gl.vertexAttribPointer(attribute, buffer.stride, gl.FLOAT, false, 0, 0);
			},
			draw : function(gl) {
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffer.elements);
			}
		};
	};

	return {
		quad : quad,
		cube : cube
	};
}();
