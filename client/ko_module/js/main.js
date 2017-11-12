(function (window) {
	"use strict";


	const ko = require("knockout");
	const GmapModel = require("./model/GmapModel");
	const http = require("../../etc/js/http");


	http.get("/matrix?origins=4800 El camino Real, Los Altos, CA&destinations=2465 Lathem Street, Mountain View, CA").then((response) => console.log(response));

	let elements = {
		"mapEl": "",
		"get": function (el) {
			return elements[el];
		},
		"set": function (el, val) {
			elements[el] = val;
		}
	};


	let ViewModel = function () {
		return {
			"addressFilter": ko.observable(),
			"test": ko.observableArray([]),
			"map": "",
			"addTestItem": function () {
				this.test.push({
					"x": this.addressFilter()
				});
			}
		}
	};

	let app = {
		"init": function () {
			elements.set("mapEl", document.getElementById("map"));
			ko.applyBindings(new ViewModel());
			ViewModel.map = new window.google.maps.Map(elements.get("mapEl"), new GmapModel(-22.85833, -47.22));
		}
	};


	window.onload = app.init;



}(window));