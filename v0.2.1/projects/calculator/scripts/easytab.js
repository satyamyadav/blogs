define(function () {

	window.ontouchmove = function (e) {e.preventDefault(); return false; } // Disable touch scrolling

	/* document.querySelector(All) returns a NodeList instead of Array */
	function list(weirdlist) {
		return Array.prototype.slice.call(weirdlist);
	}

	return function TabView (id) {
		var current = 0;

		var element = document.getElementById(id);
		var initial;

		/* Switch tabs swiping. */
		element.ontouchstart = function (e) {
			initial = e.changedTouches[0].pageX;
		}

		element.ontouchend = function (e) {
			var delta = e.changedTouches[0].pageX-initial;
			if (Math.abs(delta) > innerWidth/3) {
				if (delta > 0) {
					open(-1);
				} else {
					open(1);
				}
			}
			initial = undefined;
		}

		/* Opens a tab $delta$ away from the current one. */
		function open(delta) {
			var num = current+delta;
			if (num >= element.querySelectorAll(".tabs li").length || num < 0) { return; }

			var menu = element.querySelector(".tabs li:nth-child("+(num+1)+")");
			list(element.querySelectorAll(".tabs li")).map(function (tohide) {tohide.className = "";})
			menu.className = "active";
			list(element.querySelectorAll("section")).map(function (v) {
				v.style.marginLeft = parseFloat(v.style.marginLeft)-delta*100+"%";
				v.style.opacity = 0.5;
			});
			var id = menu.getAttribute("data-id");
			document.getElementById(id).style.opacity = 1;
			current = num;
		}

		list(element.querySelectorAll(".tabs li")).map(function (e, num) {
			if (num == 0) e.className = "active";
			/* Open the tab also by clicking the tab, not only swiping. */
			e.addEventListener("click", function () {
				var delta = num-current;
				open(delta);
			});
		});

		/* Move away the tabs. The switching is done modifying the margins. */
		list(element.querySelectorAll(".contents section")).map(function (e, i) {
			e.style.marginLeft = 100*i+"%";
		});
	};
});