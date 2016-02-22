define(["./functions"], function (Functions) {
	var split_tokens = ['*','/','+','-','^', '(', ')',','];
	var cont_tokens = ['.'];
	var ignore_tokens = [' '];

	function isParenthesis(a) { return a == '(' || a == ')'; }
	function isOperator(a) { return ['*', '/', '+', '-', '^'].indexOf(a) != -1; }
	function isArgumentSeparator(a) { return a == ','; }
	function isNumber(a) { return !isNaN(a); }
	function isFunction(a) { return !isNumber(a) && !isOperator(a) && !isArgumentSeparator(a) && !isParenthesis(a); }

	/* Last non-empty element in an array. */
	function getLast(arr) {
		var n = arr.filter(function (a) { return a !== ""; });
		return n[n.length-1];
	}

	/* Tokenizes a postfix expression. */
	function tokenize(string) {

		var out = [""];
		var next_sign = "+";

		string = string.replace("pi", Math.PI+"");
		string = string.replace("e", Math.E+"");

		string.split("").map(function (v) {
			if (ignore_tokens.indexOf(v) != -1) {

			} else if (split_tokens.indexOf(v) != -1) { // starts a new empty token
				var last = getLast(out);
				if (v == "-" && out.length == 1 && out[0] == "") {
					out[0] += "-";
				} else if (v == "-" && !isNumber(last)) {
					next_sign = "-";
				} else {
					out.push(v);
					out.push("");
				}
			} else if (cont_tokens.indexOf(v) != -1) { // decimal separator: no new token
				out[out.length-1] += v;
			} else if (!isNaN(v)) { // numbers
				if (!isNaN(getLast(out)) || out[out.length-1] == "-") out[out.length-1] += v;
				else out.push(next_sign+v);
				next_sign = "+";
			} else { // for functions et. al.
				if (!out[out.length-1] || isNaN(out[out.length-1])) out[out.length-1] += v;
				else out.push(""+v);
			}
		})
		return out.filter(Boolean); // remove empty elements such as "".
	}

	/* Shunting yard algorithm: infix to postfix. */
	function shuntingYard(tokens) {
		var output = [];
		var stack = [];

		for (var i=0; i<tokens.length; i++) {
			var token = tokens[i];

			if (isNumber(token)) { // If it is a number, add it to the output queue
				output.push(parseFloat(token));
			} else if (isFunction(token)) {
				stack.push(token);
			} else if (isArgumentSeparator(token)) {
				var j = stack.length;
				var mismatch = true;
				while (j--) {
					var element = stack[j];
					if (element == '(') {
						mismatch = false;
						break;
					} else {
						output.push(stack.pop());
					}
				}

				if (mismatch) {
					return {"status": "error", "value": "Parenthesis mismatch"};
				}
			} else if (isOperator(token)) {
				var j = stack.length;
				while (j>0) {
					var last = stack[j-1];
					if (isOperator(last)) {
						var op1 = Functions.getOperatorData(token);
						var op2 = Functions.getOperatorData(last);
						if ((op1.associativity == 0 && op1.precedence <= op2.precedence) ||
							(op1.precedence < op2.precedence)) {
							output.push(stack.pop());
						}
						j--;
					} else {
						break;
					}
				}
				stack.push(token);
			} else if (token == '(') {
				stack.push(token);
			} else if (token == ')') {
				var j = stack.length;
				var mismatch = true;
				while (j--) {
					var element = stack[j];
					if (element == '(') {
						mismatch = false;
						break;
					} else {
						output.push(stack.pop());
					}
				}

				if (mismatch) {
					return {"status": "error", "value": "Parenthesis mismatch"};
				}
				stack.pop();
				if (stack.length > 0 && isFunction(stack[stack.length-1])) {
					output.push(stack.pop());
				}
			}
		}

		var k = stack.length;
		while (k--) {
			var e = stack[k];
			if (isParenthesis(e)) {
				return {"status": "error", "value": "Parenthesis mismatch"};
			}
			output.push(e);
		}
		
		return {"status": "ok", "value": output};
	}

	return {
		toPostfix: function (string) {
			var tokens = tokenize(string);
			return shuntingYard(tokens);
		}
	}
})