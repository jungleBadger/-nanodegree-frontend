/**
 * Created by danielabrao on 01/07/17.
 */
(function () {
	"use strict";

	const httpClient = require("../../../etc/js/http");
	module.exports = {
		"getStaticMap": function () {
			return httpClient.get("/getStaticMap");
		}
	}
}());