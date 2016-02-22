define(function () {
	return {
		Toast: function (text,time) {
			var e = document.createElement("div");
			e.className = "toast";
			e.innerHTML = text;
			document.body.appendChild(e);
			e.style.marginLeft = -e.offsetWidth/2+"px";
			e.style.opacity = 1;
			setTimeout(function () {
				e.style.opacity = 0;
			}, time || 2000);
		}
	}
})