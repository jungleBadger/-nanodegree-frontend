(function (window) {
	"use strict";


	const ko = require("knockout");
	const GmapModel = require("./model/GmapModel");
	const getMatrix = require("./factory/factory").getMatrix;
	const getDirections = require("./factory/factory").getDirections;

	let infowindow;
	let marker;

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
	let elements = {
		"mapEl": "",
		"searchBox": "",
		"autocompleteBox": "",
		"get": function (el) {
			return elements[el];

		},
		"set": function (el, val) {
			elements[el] = val;
		}
	};


	let ViewModel = function () {
		this.addressFilter = ko.observable();
		this.test = ko.observableArray([]);
		this.map = "";
		this.searchBox = "";
		this.autocomplete = "";
		this.addTestItem = function () {
			if (!this.addressFilter()) {
				return false;
			}
			this.test.push({
				"x": this.addressFilter()
			});
		};
		this.computedTest = ko.computed(() => {
			return this.addressFilter() ?
				this.test().filter((item) => {
					return item.x.indexOf(this.addressFilter()) > -1
				}) :
				this.test();
		});
	};



	let app = {
		"init": function () {
			elements.set("mapEl", document.getElementById("map"));
			elements.set("searchBox", document.getElementById("pac-input"));
			elements.set("autocompleteBox", document.getElementById("pac-input-2"));
			ko.applyBindings(new ViewModel());
			ViewModel.map = new window.google.maps.Map(elements.get("mapEl"), new GmapModel(-22.85833, -47.22));
			ViewModel.searchBox = new window.google.maps.places.SearchBox(elements.get("searchBox"));
			// ViewModel.map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(elements.get("searchBox"));
			ViewModel.autocomplete = new window.google.maps.places.Autocomplete(elements.get("autocompleteBox"));
			ViewModel.autocomplete.bindTo("bounds", ViewModel.map);
			infowindow = new window.google.maps.InfoWindow();
			marker = new window.google.maps.Marker({
				map: ViewModel.map,
				anchorPoint: new window.google.maps.Point(0, -29)
			});
			ViewModel.searchBox.addListener("places_changed", function() {
				let places = ViewModel.searchBox.getPlaces();

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
						url: place.icon,
						size: new window.google.maps.Size(71, 71),
						origin: new window.google.maps.Point(0, 0),
						anchor: new window.google.maps.Point(17, 34),
						scaledSize: new window.google.maps.Size(25, 25)
					};

					// Create a marker for each place.
					markers.push(new window.google.maps.Marker({
						map: ViewModel.map,
						icon: icon,
						title: place.name,
						position: place.geometry.location
					}));

					if (place.geometry.viewport) {
						// Only geocodes have viewport.
						bounds.union(place.geometry.viewport);
					} else {
						bounds.extend(place.geometry.location);
					}
				});
				ViewModel.map.fitBounds(bounds);
			});


			ViewModel.autocomplete.addListener("place_changed", function() {
				infowindow.close();
				marker.setVisible(false);
				let place = ViewModel.autocomplete.getPlace();
				if (!place.geometry) {
					// User entered the name of a Place that was not suggested and
					// pressed the Enter key, or the Place Details request failed.
					return;
				}

				// If the place has a geometry, then present it on a map.
				if (place.geometry.viewport) {
					ViewModel.map.fitBounds(place.geometry.viewport);
				} else {
					ViewModel.map.setCenter(place.geometry.location);
					ViewModel.map.setZoom(17);  // Why 17? Because it looks good.
				}
				marker.setIcon(/** @type {google.maps.Icon} */({
					url: place.icon,
					size: new window.google.maps.Size(71, 71),
					origin: new window.google.maps.Point(0, 0),
					anchor: new window.google.maps.Point(17, 34),
					scaledSize: new window.google.maps.Size(35, 35)
				}));
				marker.setPosition(place.geometry.location);
				marker.setVisible(true);

				let address = "";
				if (place.address_components) {
					address = [
						(place.address_components[0] && place.address_components[0].short_name || ""),
						(place.address_components[1] && place.address_components[1].short_name || ""),
						(place.address_components[2] && place.address_components[2].short_name || "")
					].join(" ");
				}

				infowindow.setContent("<div><strong>" + place.name + "</strong><br>" + address);
				infowindow.open(ViewModel.map, marker);
			});




		}
	};


	window.onload = app.init;



}(window));