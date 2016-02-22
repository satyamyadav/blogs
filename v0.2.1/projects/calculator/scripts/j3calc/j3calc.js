define(["./infix", "./functions"], function (Infix, Functions) {

	/* Evaluates a postfix notation token list.
	   Session is a j3calc.Session object, with data such as previous entries. */
	function evaluate(tokens, session) {
		Functions.session = session;

		var stack = [];

		for (var i=0; i<tokens.length; i++) {
			var token = tokens[i]

			if (!isNaN(token)) {
				stack.push(token);
			} else {
				var fn = Functions.getFunction(token);
				if (!fn) {
					return {"status": "error", "value": "Unknown command '"+token+"'"};
				} else if (fn.length > stack.length) {
					return {"status": "error", "value": "Not enough parameters"};
				} else {
					var values = stack.splice(stack.length-fn.length, stack.length);
					var res = fn.fn.apply({}, values);
					stack.push(res);
				}
			}
		}

		if (stack.length > 1) {
			return {"status": "error", "value": "Too many values in input"};
		} else {
			return {"status": "ok", "value": stack[0]}
		}
	}

	/* Simple wrapper for localStorage. Everything is JSON-stored, even strings. */
	var Storage = function (name) {
		this.get = function (key, def) {
			var a = JSON.parse(localStorage.getItem(name+"-"+key));
			return a || def;
		}
		this.put = function (key, val) {
			localStorage.setItem(name+"-"+key, JSON.stringify(val));
		}
	}

	var Memory = function (storage) {
		this.list = storage.get("memory", []);

		this.add = function (e) {
			this.list.push(e);
			this.update();
		}
		this.rm = function (e) {
			this.list.pop();
			this.update();
		}
		this.update = function () {
			storage.put("memory", this.list);
		}
		this.clear = function () {
			this.list = [];
			storage.put("memory", []);
		}
	}

	return {
		Session: function (name) {
			var storage = new Storage(name);

			this.memory = new Memory(storage);

			this.getPrevious = function () {
				return storage.get("results", []);
			}

			this.add = function (string) {
				var postfix = Infix.toPostfix(string);
				if (postfix.status == "ok") {
					var result = evaluate(postfix.value, this);
					if (result.status == "ok" && !isNaN(result.value)) {
						var out = result.value;
						var arr = storage.get("results", []);
						arr.push(out);
						storage.put("results", arr);
						return out;
					} else {
						return "<error: "+result.value+">";
					}
				} else {
					return "<error: "+postfix.value+">";
				}
			}
		},
		eval: evaluate
	}
});