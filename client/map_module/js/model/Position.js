(function () {
    "use strict";

    module.exports = function Constructor(data) {
		return {
			"id": data.id || Date.now(),
			"lat": Number(data.lat),
			"lng": Number(data.lng)
		}
	}

}());