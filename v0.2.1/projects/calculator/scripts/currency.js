define(function () {
	var list = [["AED", "United Arab Emirates Dirham"], ["ARS", "Argentine Peso"], ["AUD", "Australian Dollars"], ["BGN", "Bulgarian Lev"], ["BND", "Brunei Dollar"], ["BOB", "Bolivian Boliviano"], ["BRL", "Brazilian Real"], ["CAD", "Canadian Dollars"], ["CHF", "Swiss Francs"], ["CLP", "Chilean Peso"], ["CNY", "Yuan Renminbi"], ["COP", "Colombian Peso"], ["CSD", "Old Serbian Dinar"], ["CZK", "Czech Koruna"], ["DEM", "Deutsche Marks"], ["DKK", "Denmark Kroner"], ["EEK", "Estonian Kroon"], ["EGP", "Egyptian Pound"], ["EUR", "Euros"], ["FJD", "Fiji Dollar"], ["FRF", "French Franks"], ["GBP", "British Pounds Sterling"], ["HKD", "Hong Kong Dollars"], ["HRK", "Croatian Kuna"], ["HUF", "Hungarian Forint"], ["IDR", "Indonesian Rupiah"], ["ILS", "Israeli Shekel"], ["INR", "Indian Rupee"], ["JPY", "Japanese Yen"], ["KES", "Kenyan Shilling"], ["KRW", "South Korean Won"], ["LTL", "Lithuanian Litas"], ["MAD", "Moroccan Dirham"], ["MTL", "Maltese Lira"], ["MXN", "Mexico Peso"], ["MYR", "Malaysian Ringgit"], ["NOK", "Norway Kroner"], ["NZD", "New Zealand Dollars"], ["PEN", "Peruvian Nuevo Sol"], ["PHP", "Philippine Peso"], ["PKR", "Pakistan Rupee"], ["PLN", "Polish New Zloty"], ["ROL", "Romanian Leu"], ["RON", "New Romanian Leu"], ["RSD", "Serbian Dinar"], ["RUB", "Russian Rouble"], ["SAR", "Saudi Riyal"], ["SEK", "Sweden Kronor"], ["SGD", "Singapore Dollars"], ["SIT", "Slovenian Tolar"], ["SKK", "Slovak Koruna"], ["THB", "Thai Baht"], ["TRL", "Turkish Lira"], ["TRY", "New Turkish Lira"], ["TWD", "New Taiwan Dollar"], ["UAH", "Ukrainian Hryvnia"], ["USD", "US Dollars"], ["VEB", "Venezuela Bolivar"], ["VEF", "Venezuela Bolivar Fuerte"], ["VND", "Vietnamese Dong"], ["ZAR", "South African Rand"]];
	function getRate(a,b,callback) {
		var script = document.createElement("script");
		window.fn = function () {
			callback();
			script.parentNode.removeChild(script);
		};
		script.type = "text/javascript";
		script.src = "http://rate-exchange.appspot.com/currency?from="+a+"&to="+b+"&callback=fn";
		document.head.appendChild(script);
	}

	return {
		getRate: getRate,
		list: list
	}
});