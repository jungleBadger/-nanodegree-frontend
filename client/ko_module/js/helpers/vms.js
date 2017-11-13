(function () {
    "use strict";

    module.exports = {
		"main": {},
		"get": function (vm, prop) {
			return this[vm][prop];
		},
		"set": function (vm, prop, value) {
			this[vm][prop] = value;
		}
	};

}());