(function () {
    "use strict";

    module.exports = function (app, request) {
		app.get("/", function (req, res) {
			return res.status(200).send("oi");
		});
		require("./partials/mapHandler")(app, request);

	};
}());