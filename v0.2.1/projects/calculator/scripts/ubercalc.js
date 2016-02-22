requirejs.config({waitSeconds:60});
require(["easytab", "j3calc/j3calc", "toast"], function (EasyTab, j3calc, toast) {
	var a = location.pathname.split("/");
	a.pop();
	a.push("manifest.json");
	var path = location.protocol+"//"+location.host+a.join('/');
	if (navigator.mozApps != undefined && localStorage.notNow !== "yes") {
		var req = navigator.mozApps.checkInstalled(path);
		req.onsuccess = function (e) {
			if (!req.result) {
				toast.Toast('<span style="text-decoration:underline;" onclick="navigator.mozApps.install(\''+path+'\')">Install Ubercalc as a Mozilla Web App</span> · <span style="text-decoration:underline;" onclick="localStorage.notNow=\'yes\'";">Not now</span>', 5000);
			}
		}
	}

	/* Polyfill for older browsers... */
	Function.prototype.bind = function(scope) {
		var _function = this;
	
		return function() {
			return _function.apply(scope, arguments);
		}
	}

	/* document.querySelector(All) returns a NodeList instead of Array */
	function list(weirdlist) {
		return Array.prototype.slice.call(weirdlist);
	}

	new EasyTab("calctabs");

	var session = new j3calc.Session("ubercalc");

	/* Every calculator is made of sections which are reusable.
		\begin{calculator modes} */

	function B(label, toadd, color, colspan) {
		this.toadd = toadd || label;
		this.label = label;
		this.color = color || "#f3f3f3";
		this.colspan = colspan || 1;
	}

	function A(opts) {
		this.id = opts.id || "";
		this.label = opts.label || "";
		this.toadd = opts.toadd || "";
		this.color = opts.color || "#f3f3f3";
		this.colspan = opts.colspan || 1;
		this.fn = opts.fn || function () {};
		this.dropdown = opts.dropdown || undefined;
	}

	// It hurts to use <sup> instead of Unicode characters, but mobile support is low :(

	var prevmenu = new A({id: "prev", label: "Prev", toadd:"prv(0)", color:"#BBD4E9", dropdown: function () {
							var prev = session.getPrevious();
							var l = prev.length;
							var mapped = prev.map(function (a,i) { return [a,"prv("+(l-1-i)+")"] });
							return mapped.length != 0 ? mapped : [["0","0"]];
						}});

	var sections = {advanced1: [[new B(",", ",", "#BCCCD9"), new B("ln", "ln(", "#BCCCD9"), new B("log<sub>x</sub>(y)", "log(", "#BCCCD9"), new B("10<sup>x</sup>", "10^", "#BCCCD9")],
								[new B("x<sup>y</sup>", "^", "#BCCCD9"), new B("x<sup>2</sup>", "^2", "#BCCCD9"), new B("√", "sqrt(", "#BCCCD9"), new B("<sup>x</sup>√", "xrt(", "#BCCCD9")],
								[new A({label:"sin", toadd:"sin(", color:"#BCCCD9", dropdown: [["arcsin", "arcsin("]]}), new A({label:"cos", toadd:"cos(", color:"#BCCCD9", dropdown: [["arccos", "arccos("]]}), new A({label:"tan", toadd:"tan(", color:"#BCCCD9", dropdown: [["arctan", "arctan("]]}), new B("x<sup>-1</sup>", "^-1", "#BCCCD9")]],
					basic: [[new B("7"), new B("8"), new B("9"), new B("+", "+", "#BBD4E9")],
							[new B("4"), new B("5"), new B("6"), new B("−","-", "#BBD4E9")],
							[new B("1"), new B("2"), new B("3"), new B("×", "*", "#BBD4E9")],
							[new B("0"), new B("("), new B(")"), new B("÷", "/", "#BBD4E9")],
							[prevmenu, new B(".",".","#BBD4E9"), new A({label:"=", color:"#99cc00", colspan:2, fn: evaluate })]],
					basic2: [[new B("7"), new B("8"), new B("9"), new B("+", "+", "#BBD4E9")],
							[new B("4"), new B("5"), new B("6"), new B("−","-", "#BBD4E9")],
							[new B("1"), new B("2"), new B("3"), new B("×", "*", "#BBD4E9")],
							[new B("0"), new B("("), new B(")"), new B("÷", "/", "#BBD4E9")],
							[prevmenu, new B(".",".","#BBD4E9"), new A({label: "π", toadd:"pi", color:"#BBD4E9", dropdown: [["e","e"], ["c", "299792458"]]}), new A({label:"=", color:"#99cc00", fn: evaluate })]],
					
					statadvanced: [[new A({label:"Clear mem.", toadd:"clr()", color:"#BCCCD9", fn: memclr}),new A({label:'<span style="text-decoration:overline;">x</span>', toadd:"avg()", color:"#BCCCD9", dropdown: [["σ", "sd()"]]}),new B('n', "n()", "#BCCCD9"), new A({label:"M-", color:"#BCCCD9", colspan:1, fn: memrm})]],
					statbasic: [[new B("7"), new B("8"), new B("9"), new B("+", "+", "#BBD4E9")],
							[new B("4"), new B("5"), new B("6"), new B("−","-", "#BBD4E9")],
							[new B("1"), new B("2"), new B("3"), new B("×", "*", "#BBD4E9")],
							[new B("0"), new B("("), new B(")"), new B("÷", "/", "#BBD4E9")],
							[prevmenu, new B(".",".","#BBD4E9"), new A({label:"=", color:"#99cc00", colspan:1, fn: evaluate }), new A({label:"M+", color:"#99cc00", colspan:1, fn: memadd })]],
				   };

	/*  \end{calculator modes} */

	/* Evaluates the current input, calling j3calc. */
	function evaluate(calc) {
		var inp = calc.querySelector("input");
		var input = inp.value;
		var val = session.add(input);
		inp.value = val;
		calc.setAttribute("data-reset", "true");

		list(document.querySelectorAll("#prev .other")).map(function (element) {
			var prev = session.getPrevious();
			element.innerHTML = prev[prev.length-1];
		});

		return val;
	}
	function memadd(calc) {
		var val = evaluate(calc);
		session.memory.add(val);
		toast.Toast("Added to memory");
	}
	function memrm(calc) {
		session.memory.rm();
		toast.Toast("Removed last memory item");
	}
	function memclr(calc) {
		session.memory.clear();
		toast.Toast("Memory cleared");
	}

	/* Appends text to the input. Checks if it should be emptied first (eg after =). */
	function addText(calc, text) {
		if (calc.getAttribute("data-reset") == "true") calc.querySelector("input").value = "";
		calc.querySelector("input").value += text;
		calc.setAttribute("data-reset", "false");
	}

	/* Gets the dropdown elements of an element (it might be a function). */
	function getDropDown(element) {
		var dd = element.dropdown;
		if (typeof dd === 'function') {
			dd = dd();
		}
		return dd;
	}

	list(document.querySelectorAll(".calculator")).map(function (calc) {
		var timeout;

		/* Erase button. In touch devices: long press erases everything. */
		var back = calc.querySelector(".back");
		back.addEventListener("mouseup", function () {
			var l = calc.querySelector("input").value;
			calc.querySelector("input").value = l.substr(0,l.length-1);
		});
		back.addEventListener("touchstart", function (e) {
			timeout = setTimeout(function () {
				calc.querySelector("input").value = "";
			}, 500);
			var l = calc.querySelector("input").value;
			calc.querySelector("input").value = l.substr(0,l.length-1);
			e.preventDefault();
			return false;
		});
		back.addEventListener("touchend", function (e) {
			e.preventDefault();
			clearInterval(timeout);
			return false;
		});

		calc.querySelector("input").ontouchstart = function (e) { /*keycode*/ e.preventDefault(); return false };
		calc.querySelector("input").onkeypress= function (e) { if (e.keyCode == 13 || e.which == 13) { evaluate(calc); }};

		list(calc.querySelectorAll("tbody")).map(function (tbody) {
			var mode = sections[tbody.getAttribute("data-section")];
			for (var row=0; row<mode.length; row++) {
				var elements = mode[row];
				var tr = document.createElement("tr");
				for (var cell=0; cell<elements.length; cell++) {
					var td = document.createElement("td");
					td.setAttribute("colspan", elements[cell].colspan);
					var button = document.createElement("button");
					button.style.background = elements[cell].color;
					if (elements[cell].id) button.setAttribute("id", elements[cell].id);
					button.innerHTML = elements[cell].label; // No textNode because some include <sup>
					var dd = getDropDown(elements[cell]);
					if (dd !== undefined) {
						if (dd.length > 0) button.innerHTML = '<span class="other">'+dd[dd.length-1][0]+'</span><span class="main">'+button.innerHTML+'</span>';

						var data = {};
						var inter;
						var begin = function () {
							var prev = this.el.getAttribute("date-time");
							var t = (new Date()).getTime();
							if (prev != undefined && (t-parseFloat(prev)) < 10) return;
							this.el.setAttribute("date-time", t);
							tim = setTimeout(function () {
								var dd = getDropDown(this.elements[this.cell])
								if (dd.length == 1) {
									addText(this.calc, dd[0][1]);							
								} else {
									// popup...
									var ul = document.createElement("ul");
									var overlay = document.createElement("div");
									ul.className = "popup";
									this.calc.appendChild(ul);

									for (var i=Math.max(0, dd.length-5); i<dd.length; i++) {
										var li = document.createElement("li");
										li.innerHTML = dd[i][0];
										li.setAttribute("data-add", dd[i][1]);
										li.addEventListener("click", function () {
											addText(this.calc, this.li.getAttribute("data-add"));
											ul.parentNode.removeChild(ul);
											document.body.removeChild(this.overlay)
										}.bind({calc:this.calc, li:li, overlay:overlay}));
										ul.appendChild(li);
									}
									var height = ul.clientHeight;
									ul.style.top = (this.el.offsetTop-height)+"px";
									ul.style.left = this.el.offsetLeft+"px";
									ul.style.width = this.el.offsetWidth-2+"px";
									ul.style.zIndex = 10000;
									
									overlay.style.zIndex = 1000;
									overlay.className = "overlay";
									overlay.addEventListener("click", function (e) {
										this.parentNode.removeChild(this);
										document.body.removeChild(e.target);
									}.bind(ul));
									document.body.appendChild(overlay);

								}
							}.bind(this),400);
						};

						var end = function () {
							var delta = (new Date()).getTime()-parseFloat(this.el.getAttribute("date-time"));
							clearTimeout(tim);
							if (delta < 0.4*1000 && delta > 10) { // Sometimes there's an unwanted double click.
								addText(this.calc, this.elements[this.cell].toadd);
							}
						};
						var data = {elements:elements, cell: cell, calc: calc, el: button}
						button.addEventListener("mousedown", begin.bind(data));
						button.addEventListener("touchstart", begin.bind(data));
						button.addEventListener("mouseup", end.bind(data));
						button.addEventListener("touchend", end.bind(data));
					} else if (elements[cell].fn) {
						button.addEventListener("click", function () {
							this.elements[this.cell].fn(this.calc);
						}.bind({elements:elements, cell: cell, calc: calc}));
					} else {
						button.addEventListener("click", function () {
							addText(this.calc, this.elements[this.cell].toadd);
						}.bind({elements:elements, cell: cell, calc: calc}))
					}
					td.appendChild(button);
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			}
		});
	});

	/* Vertically expands the buttons. Also called on window resize. */
	function set_button_size() {
		var tabs = document.querySelector("#calctabs .tabs").offsetHeight;
		list(document.querySelectorAll(".calculator")).map(function (calc) {
			var bsp = parseFloat(window.getComputedStyle(calc).borderSpacing);
			var thead = calc.querySelector("thead").offsetHeight;
			var buttons = list(calc.querySelectorAll("tbody button, tbody select"));
			var nr = calc.querySelectorAll("tr").length-1;
			buttons.map(function (b) {
				var n = (innerHeight-thead-tabs-10-bsp*nr)/nr;
				if (b.tagName.toLowerCase() == "select") {
				}
				b.style.height = n + "px";
			});
		});
	}
	
	window.addEventListener("resize", set_button_size);
	set_button_size();
});