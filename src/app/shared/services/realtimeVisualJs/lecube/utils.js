var smoothstep = function(min, max, value) {
	var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
	return x*x*(3 - 2*x);
};

var fract = function(x) {
	return x - Math.floor(x);
};

var clamp = function(x, low, high) {
	return Math.min(high, Math.max(low, x));
};

var ease = {
	// t: current time, b: begInnIng value, c: change In value, d: duration	
	in: function (t, b, c, d) {
		if (t < 0) { return b; }
		if (t > d) { return b + c; }
		return c*(t/=d)*t*t + b;
	},
	out: function (t, b, c, d) {
		if (t < 0) { return b; }
		if (t > d) { return b + c; }
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	inOut: function (t, b, c, d) {
		if (t < 0) { return b; }
		if (t > d) { return b + c; }
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}
};

var linear = {
	in : function(t, start, duration) {
		if (t <= start) {
			return 0;
		}
		if (t >= start + duration) {
			return 1;
		}
		return (t - start) / duration;
	},
	out : function(t, start, duration) {
		return 1 - linear.in(t, start, duration);
	}	
};