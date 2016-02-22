define(function () {

	var object = {
		getOperatorData: function (op) {
			return {"associativity": associativity[op], "precedence": precedence[op]}
		},

		getFunction: function (a) {
			var fn = functions[a];
			if (fn) return {"fn": fn, "length": fn.length};
			else return false;
		}
	};

	var associativity = {
		"+": 0,
		"-": 0,
		"*": 0,
		"/": 0,
		"^": 1
	}

	var precedence = {
		"+": 2,
		"-": 2,
		"*": 3,
		"/": 3,
		"^": 4
	}

	function avg() {
		var l = object.session.memory.list;
		var n = 0;
		l.map(function (e) { n += e; });
		return n/l.length;
	}

	var functions = {
		"*": function (a, b) { return a * b; },
		"/": function (a, b) { return a / b; },
		"+": function (a, b) { return a + b; },
		"-": function (a, b) { return a - b; },
		"^": function (a, b) { return Math.pow(a, b); },
		"min": function (a, b) { return Math.min(a, b); },
		"max": function (a, b) { return Math.max(a, b); },
		"sqrt": function (a) { return Math.sqrt(a); },
		"xrt": function (b,a) { return Math.pow(a, 1/b); },
		"sin": function (a) { return Math.sin(a); },
		"cos": function (a) { return Math.cos(a); },
		"tan": function (a) { return Math.tan(a); },
		"arcsin": function (a) { return Math.asin(a); },
		"arccos": function (a) { return Math.acos(a); },
		"arctan": function (a) { return Math.atan(a); },
		"ln": function (a) { return Math.log(a); },
		"log": function (a,b) { return Math.log(b)/Math.log(a); },
		"prv": function (a) { var prev = object.session.getPrevious(); return prev[prev.length-1-a] || 0; },
		"avg": avg,
		"sd": function () {
			var l = object.session.memory.list;
			var n = 0;
			l.map(function (e) {
				n += e*e;
			})
			n = n/l.length;
			n -= Math.pow(avg(), 2);
			return Math.sqrt(n);
		},
		"n": function () { return object.session.memory.list.length; }
	}

	return object;
})