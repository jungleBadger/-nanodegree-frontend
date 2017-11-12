(function () {
    "use strict";

    module.exports = function (app, request) {
		app.get("/", function (req, res) {
			return res.status(200).render("./map_module/index.html");
		});
		require("./partials/mapHandler")(app, request);

	};
}());