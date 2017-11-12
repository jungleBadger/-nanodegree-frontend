(function () {
    "use strict";

    module.exports = function (app, request) {
		app.get("/getMap", function (req, res) {
			request.get(
				`https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_apiKey}`,
				(err, body, response) => {
					return err ? res.status(500).send(err) : res.status(200).send(response);
				}
			);
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