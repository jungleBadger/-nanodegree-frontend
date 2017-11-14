(function () {
    "use strict";

    module.exports = function (app, request) {
		const maps = require("../../helpers/maps");
		const favoriteLocations = require("../../model/favLocations");
		app.get("/getMap", function (req, res) {
			maps.getMapClient({
				"libraries": req.query.libraries
			}).then((mapClient) => {
				return res.status(200).send(mapClient);
			}).catch((err) => {
				return res.status(500).send(err);
			});
		});

		app.get("/geocoding", function (req, res) {
			maps.geocoding({
				"address": req.query.address
			}).then((result) => {
				return res.status(200).send(result);
			}).catch((err) => {
				return res.status(500).send(err);
			});
		});

		app.get("/reverseGeocoding", function (req, res) {
			maps.reverseGeocoding({
				"lat": req.query.lat,
				"lng": req.query.lng
			}).then((result) => {
				return res.status(200).send(result);
			}).catch((err) => {
				return res.status(500).send(err);
			});
		});

		app.get("/matrix", function (req, res) {
			maps.matrix({
				"origins": req.query.origins,
				"destinations": req.query.destinations
			}).then((result) => {
				return res.status(200).send(result);
			}).catch((err) => {
				return res.status(500).send(err);
			});
		});

		app.get("/directions", function (req, res) {
			maps.directions({
				"origin": req.query.origin,
				"waypoints": req.query.waypoints,
				"destination": req.query.destination
			}).then((result) => {
				return res.status(200).send(result);
			}).catch((err) => {
				return res.status(500).send(err);
			});
		});

		app.get("/getStaticMap", function (req, res) {
			request.get(
				`https://maps.googleapis.com/maps/api/staticmap?${process.env.MAPS_apiKey}`,
				(err, body, response) => {
					return err ? res.status(500).send(err) : res.status(200).send(response);
				}
			);
		});

		app.get("/getFavLocations", function (req, res) {
			return res.status(200).send(favoriteLocations);
		});
	}

}());