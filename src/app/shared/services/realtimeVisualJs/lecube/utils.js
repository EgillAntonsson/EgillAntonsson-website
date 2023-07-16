// var smoothstep = function(min, max, value) {
// 	var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
// 	return x*x*(3 - 2*x);
// };

// var fract = function(x) {
// 	return x - Math.floor(x);
// };

export var clamp = function(x, low, high) {
	return Math.min(high, Math.max(low, x));
};

export var ease = {
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

export var linear = {
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

// From http://baagoe.com/en/RandomMusings/javascript/
export var alea = function() {
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
