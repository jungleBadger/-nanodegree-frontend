(function () {
	"use strict";



	process.env.FOURSQUARE_ID = "SG3UI3JYSRXY0YY32LEYN0J1AIMCACII4TCW2M52N1YWJK4H";
	process.env.FOURSQUARE_KEY = "PTPRJ0CDIVDKMPU4KK41GNGVYJDXIBOQHTV5VFQTXHSYA2P3";
	process.env.FOURSQUARE_VERSION_DATE = "20171115";
	const request = require("request");
	const BASE_URL = "https://api.foursquare.com/v2";
	const CLIENT_ID = process.env.FOURSQUARE_ID;
	const API_KEY = process.env.FOURSQUARE_KEY;
	const VERSION_DATE = process.env.FOURSQUARE_VERSION_DATE;
	const RESULT_LIMIT = "1";
	module.exports = {
		"getVenueInfo": function (lat, lng, keyword) {
			return new Promise((resolve, reject) => {
				if (!lat || !lng) {
					return reject("Missing parameters");
				}
				request.get(
					[BASE_URL, "/venues/search",
						"?key=", API_KEY,
						"&client_id=", CLIENT_ID,
						"&client_secret=", API_KEY,
						"&ll=", [lat, lng].join(","),
						(keyword ? "&query=" + keyword : ""),
						"&limit=", RESULT_LIMIT,
						"&v=", VERSION_DATE
					].join(""),
					(err, body, response) => {
						return err ? reject(err) : resolve(response);
					}
				);
			});
		}
	}

}());
