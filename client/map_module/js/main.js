/**
 * Created by danielabrao on 22/06/17.
 */

(function () {
    "use strict";

	const Vue = require("vue");
	const App = require("./components/app.vue");
	// const socket = require("vue-websocket").default;
	// Vue.use(socket, document.location.href);
	new Vue({
		"el": "#app",
		"render": function (h) {
			return h(App);
		}
	});
}());
