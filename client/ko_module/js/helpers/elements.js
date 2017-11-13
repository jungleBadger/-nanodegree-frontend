(function () {
    "use strict";

    module.exports = {
		"mapEl": "",
		"searchBox": "",
		"get": function (el) {
			return this[el];

		},
		"set": function (el, val) {
			this[el] = val;
		}
	};

}());