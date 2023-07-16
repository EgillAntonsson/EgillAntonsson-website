var text = function() {
	var coords = 'GIOMJL0AMOIG0IGMO0COMGI0OMGILJ0CBN0OMGIUS0AMGIO0GHN0GHTS0AMIKO0BN0MGHNHIO0MGIO0GIOMG0SGIOM0UIGMO0MGI0IGJLOM0BNO0GMOI0GJNLI0GMNHNOI0GOKMI0GMOIUS0GIMO'.split(0);

	var decode = function(text) {
		var biggestXPos = 0;
		var vertices = [];
		var caret = 0;

		var push = function(px, py) {
			var scale = 1;
			var xPos = scale * (px+caret);
			vertices.push(xPos);
			vertices.push(scale * -py);
			vertices.push(0);
			if (xPos > biggestXPos) {
				biggestXPos = xPos;
			}
		};

		var addLine = function(a, b) {
			push(a%3, Math.floor(a/3));
			push(b%3, Math.floor(b/3));
		};

		for (var i=0;i<text.length;i++) {
			var P = coords[text.charCodeAt(i)-65];
			if (P) {
				for (var j=1;j<P.length;j++) {
					addLine(P.charCodeAt(j-1)-65,P.charCodeAt(j)-65);
				}
				if (text[i]==='I'||text[i]==='J') addLine(3,4);
				if (text[i]==='F'||text[i]==='T') addLine(3,5);
			}
			caret += 3;			
		}		

		return [vertices, biggestXPos];
	};

	var create = function(text) {
		var retArr = decode(text);
		var vertices = retArr[0];
		var biggestXPos = retArr[1];
		var buffer = kdb.staticBuffer(3, vertices);

		return {
			bind : function(gl, attribute) {
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);	
				gl.enableVertexAttribArray(attribute);		
				gl.vertexAttribPointer(attribute, buffer.stride, gl.FLOAT, false, 0, 0);			
			},
			draw : function(gl) {
				gl.drawArrays(gl.LINES, 0, buffer.elements);
			},
			biggestXPos : biggestXPos
		};		
	};

	var shader;
	var textDisplayObjList, curTxtIndex, hasNew16BeatHappened;

	var initialize = function(gl) {
		var wordList = [
				"GEOMETRY",
	            "DIMENSIONAL",
	            "SOLID",
	            "OBJECT",
	            "BOUNDED",
	            "SQUARE",
	            "FACES",
	            "SIDES",
	            "VERTEX",
	            "REGULAR",
	            "HEXAHEDRON",
	            "PLATONIC",
	            "SOLIDS",
	            "PARALLELEPIPED",
	            "EQUILATERAL",
	            "CUBOID",
	            "RHOMBOHEDRON",
	            "PRISM",
	            "ORIENTATIONS",
	            "TRIGONAL",
	            "TRAPEZOHEDRON",
	            "DUAL",
	            "OCTAHEDRON",
	            "CUBICAL",
	            "OCTAHEDRAL",
	            "FACETS",
	            "SYMMETRY"];
        textDisplayObjList = [];
        for (var i = 0; i < wordList.length; i++) {
			textDisplayObjList.push(create(wordList[i]));
        }
		curTxtIndex = 0;
		curBeatIndex = -1;
		hasNew16BeatHappened = false;

		shader = new kdb.Program('v_solid', 'f_text');
		shader.attribute('vertex');
		shader.uniform('uProjection');
		shader.uniform('uView');
		shader.uniform('uModel');
		shader.uniform('uColor');
		gl.lineWidth(3);
	};

	var model = new Matrix4();

	var update = function(gl, time, dt) {
		var unit = sync.tounit(time);
		if (unit < 16 || unit >= 28) {
			return;
		}

		var index = sync.get16partIndex(time);
		hasNew16BeatHappened = curBeatIndex;
		if (curBeatIndex != index) {
			curBeatIndex = index;
		}

		if ((index == 1 ||
				index == 3 ||
				index == 5 ||
				index == 6 ||
				index == 9 ||
				index == 11 ||
				index == 14 ||
				index == 15) && 
			hasNew16BeatHappened) {

			var projection = camera.projection();
			var view = camera.view();

			var curText = textDisplayObjList[curTxtIndex % textDisplayObjList.length];
			curTxtIndex++;

			if (unit < 20) {
				model.setTranslate(-225.0, 32.0, (curText.biggestXPos / 2) + 6.0);
                model.rotate(90, 0, 1, 0);
			}
			else if (unit < 24) {
				model.setTranslate(-190.0 + (curText.biggestXPos / 2), 40.0, 40.0);
                model.rotate(180, 0, 1, 0);
			}
			else if (unit < 28) {
                model.setTranslate(-210.0 - (curText.biggestXPos / 2), 35.0, -40.0);
            }

			shader.use();
			gl.uniformMatrix4fv(shader.u.uProjection, false, projection.elements);
			gl.uniformMatrix4fv(shader.u.uView, false, view.elements);
			gl.uniformMatrix4fv(shader.u.uModel, false, model.elements);
			gl.uniform3f(shader.u.uColor, 0, 0.9, 0);

			curText.bind(gl, shader.a.vertex);
			curText.draw(gl);
		}
	};

	return {
		initialize : initialize,
		update : update
	};
}();
