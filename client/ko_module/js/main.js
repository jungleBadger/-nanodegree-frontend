(function (window) {
	"use strict";


	const ko = require("knockout");
	const GmapModel = require("./model/GmapModel");
	const getMatrix = require("./factory/factory").getMatrix;
	const getDirections = require("./factory/factory").getDirections;

	getMatrix({
		"origins": "4800 El camino Real, Los Altos, CA",
		"destinations": "2465 Lathem Street, Mountain View, CA"
	}).then((response) => console.log(response));

	getDirections({
		"origin": "4800 El camino Real, Los Altos, CA",
		"waypoints": "Palo Alto, CA|Springfield, CA",
		"destination": "2465 Lathem Street, Mountain View, CA"
	}).then((response) => console.log(response));


	let markers = [];
	let vms = require("./helpers/vms");
	let elements = require("./helpers/elements");
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
			vms.get("main", "searchBox").addListener("places_changed", function() {
				let places = vms.get("main", "searchBox").getPlaces();
				if (!places || !places.length) {
					return;
				}
				// Clear out the old markers.
				markers.forEach(function(marker) {
					marker.setMap(null);
				});
				markers = [];

				// For each place, get the icon, name and location.
				let bounds = new window.google.maps.LatLngBounds();
				places.forEach(function(place) {
					if (!place.geometry) {
						console.log("Returned place contains no geometry");
						return;
					}
					let icon = {
						"url": place.icon,
						"size": new window.google.maps.Size(71, 71),
						"origin": new window.google.maps.Point(0, 0),
						"anchor": new window.google.maps.Point(17, 34),
						"scaledSize": new window.google.maps.Size(25, 25)
					};

					// Create a this.marker for each place.
					markers.push(new window.google.maps.Marker({
						"map": vms.get("main", "map"),
						"icon": icon,
						"title": place.name,
						"position": place.geometry.location
					}));

					if (place.geometry.viewport) {
						// Only geocodes have viewport.
						bounds.union(place.geometry.viewport);
					} else {
						bounds.extend(place.geometry.location);
					}
				});
				vms.get("main", "map").fitBounds(bounds);
			});

			return this;
		},
		"init": function () {
			vms.main = new ViewModel(ko);
			ko.applyBindings(vms.main);
			app.getHTMLElements().initGeoLocation().then((location) => {
				console.log("your atual location is: " + location);
			}).catch((err) => {
				console.log(err);
			}).then(() => {
				app.initGMaps();
			});
		}
	};

	window.onload = app.init;

}(window));