(function () {
	"use strict";
	// "CmRSAAAAsHHOUANqZxZ8oJQutUw-pLrMmMuBYMeeUt6NXVnapEmRfOxfy227z49zZ2pv7xh7hzjbZygL_Gnah3weg7I4VXAPPHAWM6iIPiF0gSAsv3cWgZVW-Jmt_9dylpLxF3xtEhAyuZ1GhdBDDIvV22miKZARGhRgQj4VzIojzxfcf8B6xlGkdZq2jw"
	const request = require("request");
	const BASE_URL = "https://maps.googleapis.com/maps/api";
	const API_KEY = process.env.MAPS_API_KEY;
	module.exports = {
		"getMapClient": function (opts = {}) {
			return new Promise((resolve, reject) => {
				request.get(
					[BASE_URL, "/js",
						"?key=", API_KEY,
						(opts.libraries ? "&libraries=" + opts.libraries : ""),
					].join(""),
					(err, body, response) => {
						return err ? reject(err) : resolve(response);
					}
				);
			});
		},
		"geocoding": function (opts = {}) {
			return new Promise((resolve, reject) => {
				if (opts && (!opts.address)) {
					return reject("Missing parameters");
				}
				request.get(
					[BASE_URL, "/geocode/json",
						"?address=", opts.address,
						"&key=",API_KEY
					].join(""),
					(err, body, response) => {
						return err ? reject(err) : resolve(response);
					}
				);
			});
		},
		"reverseGeocoding": function (opts = {}) {
			return new Promise((resolve, reject) => {
				if (opts && (!opts.lat || !opts.lng)) {
					return reject("Missing parameters");
				}
				request.get(
					[BASE_URL, "/geocode/json",
						"?latlng=", opts.lat, ",", opts.lng,
						"&key=",API_KEY
					].join(""),
					(err, body, response) => {
						return err ? reject(err) : resolve(response);
					}
				);
			});
		},
		"matrix": function (opts = {}) {
			return new Promise((resolve, reject) => {
				if (opts && (!opts.origins || !opts.destinations)) {
					return reject("Missing parameters");
				}
				request.get(
					[BASE_URL, "/distancematrix/json",
						"?origins=", opts.origins,
						"&destinations=", opts.destinations,
						"&key=",API_KEY
					].join(""),
					(err, body, response) => {
						return err ? reject(err) : resolve(response);
					}
				);
			});
		},
		"directions": function (opts = {}) {
			return new Promise((resolve, reject) => {
				if (opts && (!opts.origin || !opts.destination)) {
					return reject("Missing parameters");
				}
				opts.waypoints = opts.waypoints ? (Array.isArray(opts.waypoints) ? opts.waypoints.join("|") : opts.waypoints) : "";
				request.get(
					[BASE_URL, "/directions/json",
						"?origin=", opts.origin,
						(opts.waypoints ? ("&waypoints=" + opts.waypoints) : ""),
						"&destination=", opts.destination,
						"&key=",API_KEY
					].join(""),
					(err, body, response) => {
						return err ? reject(err) : resolve(response);
					}
				);
			});
		}
	};

}());