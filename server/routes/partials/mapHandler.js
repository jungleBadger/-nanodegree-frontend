(function () {
    "use strict";

    module.exports = function (app, request) {
		app.get("/getMap", function (req, res) {
			request.get(
				`https://maps.googleapis.com/maps/api/js?libraries=geometry&key=${process.env.MAPS_API_KEY}`,
				(err, body, response) => {
					return err ? res.status(500).send(err) : res.status(200).send(response);
				}
			);
		});

		app.get("/geocoding", function (req, res) {
			request.get(
				`https://maps.googleapis.com/maps/api/js?libraries=geometry&key=${process.env.MAPS_API_KEY}`,
				(err, body, response) => {
					return err ? res.status(500).send(err) : res.status(200).send(response);
				}
			);
		});

		app.get("/reverseGeocoding", function (req, res) {
			if (req.query.lat && req.query.lng) {
				request.get(
					`https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.query.lat},${req.query.lng}&key=${process.env.MAPS_API_KEY}`,
					(err, body, response) => {
						return err ? res.status(500).send(err) : res.status(200).send(response);
					}
				);
			} else {
				return res.status(403).send("Can not proceed without lat and lng parameters");
			}

		});

		app.get("/matrix", function (req, res) {
			if (req.query.origins && req.query.destinations) {
				request.get(
					`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${req.query.origins}&destinations=${req.query.destinations}&key=${process.env.MAPS_API_KEY}`,
					(err, body, response) => {
						return err ? res.status(500).send(err) : res.status(200).send(response);
					}
				);
			} else {
				return res.status(403).send("Can not proceed without lat and lng parameters");
			}
		});

		app.get("/directions", function (req, res) {
			if (req.query.origin && req.query.destination) {
				request.get(
					`https://maps.googleapis.com/maps/api/directions/json?origin=${req.query.origins}&destination=${req.query.destinations}&key=${process.env.MAPS_API_KEY}`,
					(err, body, response) => {
						return err ? res.status(500).send(err) : res.status(200).send(response);
					}
				);
			} else {
				return res.status(403).send("Can not proceed without lat and lng parameters");
			}
		});

		app.get("/getStaticMap", function (req, res) {
			request.get(
				`https://maps.googleapis.com/maps/api/staticmap?${process.env.MAPS_apiKey}`,
				(err, body, response) => {
					return err ? res.status(500).send(err) : res.status(200).send(response);
				}
			);
		});
	}

}());