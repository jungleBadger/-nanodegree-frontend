(function () {
	"use strict";

	const httpClient = require("../../../etc/js/http");
	module.exports = {
		"getStaticMap": function () {
			return httpClient.get("/getStaticMap");
		},
		"getMatrix": function (opts) {
			return httpClient.get(
				`/matrix?origins=${encodeURIComponent(opts.origins)}&destinations=${encodeURIComponent(opts.destinations)}`
			);
		},
		"getDirections": function (opts) {
			return httpClient.get(
				`/directions?origin=${encodeURIComponent(opts.origin)}&waypoints=${encodeURIComponent(opts.waypoints)}&destination=${encodeURIComponent(opts.destination)}`
			);
		},
		"getFavoriteLocations": function () {
			return httpClient.get("/getFavLocations");
		},
		"getFoursquareInfo": function (opts) {
			return httpClient.get(
				`/foursquare?lat=${encodeURIComponent(opts.lat)}&lng=${encodeURIComponent(opts.lng)}&keyword=${encodeURIComponent(opts.keyword)}`
			)
		}
	}
}());