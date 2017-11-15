(function (window) {
	"use strict";

	const ko = require("knockout");
	const GmapModel = require("./model/GmapModel");
	const getFavLocations = require("./factory/factory").getFavoriteLocations;

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


			if (window && !window.google) {
				return vms.main.showErrorMessage("ERROR LOADING GOOGLE MAPS LIBRARY. APP UNAVAILABLE");
			}

			let initialPoint = new window.google.maps.LatLng(vms.get("main", "currentPos").lat, vms.get("main", "currentPos").lng);
			vms.set("main", "map", new window.google.maps.Map(
				elements.get("mapEl"),
				new GmapModel(vms.get("main", "currentPos").lat, vms.get("main", "currentPos").lng)
			));

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

			vms.set("main", "service", new window.google.maps.places.PlacesService(vms.get("main", "map")));
			vms.get("main", "service").nearbySearch({
				"location": initialPoint,
				"radius": "100",
				"query": "restaurant",
				"openNow": true
			}, function (results, status) {
				if (status === window.google.maps.places.PlacesServiceStatus.OK) {
					if (results && results.length) {
						results.forEach(function (place) {
							let isDuplicated = vms.get("main", "markers")[place.id];
							if (!isDuplicated) {
								vms.get("main", "service").getDetails(place, function (finalResult, innerStatus) {
									if (innerStatus === window.google.maps.places.PlacesServiceStatus.OK) {
										methods.generateNewOption(finalResult);
									} else if (innerStatus === window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
										vms.main.showErrorMessage("Error gathering nearby locations: You exceeded API limits");
									} else {
										vms.main.showErrorMessage("Unknown error: " + innerStatus);
									}
								});
							}
						});
					}
				} else {
					vms.main.showErrorMessage("Unexpected error: " + status);
				}
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
					vms.main.showErrorMessage("Error getting fav locations: " + err);
				})

			});
		}
	};

	window.onload = app.init;

}(window));