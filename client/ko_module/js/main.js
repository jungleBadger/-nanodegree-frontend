(function (window) {
	"use strict";

	const ko = require("knockout");
	const GmapModel = require("./model/GmapModel");
	const getMatrix = require("./factory/factory").getMatrix;
	const getDirections = require("./factory/factory").getDirections;
	const getFavLocations = require("./factory/factory").getFavoriteLocations;

	getMatrix({
		"origins": "4800 El camino Real, Los Altos, CA",
		"destinations": "2465 Lathem Street, Mountain View, CA"
	}).then((response) => console.log(response));

	getDirections({
		"origin": "4800 El camino Real, Los Altos, CA",
		"waypoints": "Palo Alto, CA|Springfield, CA",
		"destination": "2465 Lathem Street, Mountain View, CA"
	}).then((response) => console.log(response));


	let vms = require("./helpers/vms");
	let elements = require("./helpers/elements");
	let methods = require("./helpers/methods")(vms);
	let ViewModel = require("./viewmodels/MainVM");
	let app = {
		"getHTMLElements": function () {
			elements.set("mapEl", document.getElementById("map"));
			elements.set("searchBox", document.getElementById("pac-input"));
			return this;
		},
		"initGeoLocation": function () {
			return new Promise((resolve, reject) => {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition((position) => {
						vms.set("main", "currentPos", {
							"lat": position.coords.latitude,
							"lng": position.coords.longitude
						});
						resolve(position);
					}, function() {
						reject("Error gathering location");
					});
				} else {
					reject("Browser does not support geo queries");
				}
			});
		},
		"initGMaps": function () {
			vms.set("main", "map", new window.google.maps.Map(
				elements.get("mapEl"),
				new GmapModel(vms.get("main", "currentPos").lat, vms.get("main", "currentPos").lng))
			);
			vms.set("main", "searchBox", new window.google.maps.places.SearchBox(elements.get("searchBox")));
			vms.set("main", "infoWindow",  new window.google.maps.InfoWindow());
			vms.set("main", "marker", new window.google.maps.Marker({
				map: vms.get("main", "map"),
				anchorPoint: new window.google.maps.Point(0, -29)
			}));
			vms.set("main", "bounds", new window.google.maps.LatLngBounds());
			vms.get("main", "searchBox").addListener("places_changed", function() {
				let places = vms.get("main", "searchBox").getPlaces();
				if (!places || !places.length) {
					return;
				}
				places.forEach(methods.generateNewOption);
				vms.get("main", "map").fitBounds(vms.get("main", "bounds"));
			});

			return this;
		},
		"init": function () {
			vms.main = new ViewModel(ko);
			ko.applyBindings(vms.main);
			ko.onError = function(error) {
				alert(error);
			};
			app.getHTMLElements().initGeoLocation().then((location) => {
				console.log("your atual location is: " + location);
			}).catch((err) => {
				console.log(err);
			}).then(() => {
				app.initGMaps();
				getFavLocations().then((data) => {
					data.forEach(methods.generateNewOption);
				}).catch((err) => {
					alert("Error getting fav locations: " + err);
				})

			});
		}
	};

	window.onload = app.init;

}(window));