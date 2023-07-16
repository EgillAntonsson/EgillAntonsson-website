export var sync = function() {
	var units = 85.0 / 60.0;

	var sixteenPart = units / 8;

	// each unit is two quarter notes
	var tounit = function(time) { return time / units; };

	var totime = function(unit) { return unit * units; };

	var get16partIndex = function(time) {
		return Math.floor(time / sixteenPart) % 16;
	};

	var init = function(u) {
		units = u;
	};

	var fadein = function(time, start, duration) {
		var u = tounit(time);
		if (u <= start) {
			return 0;
		}
		if (u >= start + duration) {
			return 1;
		}
		return (u - start) / duration;
	};

	var fadeout = function(time, start, duration) {
		return 1 - fadein(time, start, duration);
	};

	var interval = function(time, start, dur0, stop, dur1) {
		return fadein(time, start, dur0)*fadeout(time, stop, dur1);
	};

	var unit = function(time, x) {
		return (tounit(time) % x) / x;
	};

	var step = function(time, x) {
		return tounit(time) >= x ? 1 : 0;
	};

	function smoothstep(min, max, value) {
  		var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
  		return x*x*(3 - 2*x);
	}

	return {
		init : init,
		fadein : fadein,
		fadeout : fadeout,
		interval : interval,
		unit : unit,
		tounit : tounit,
		totime : totime,
		get16partIndex : get16partIndex,
		step : step,
		smoothstep : smoothstep
	};
}();
