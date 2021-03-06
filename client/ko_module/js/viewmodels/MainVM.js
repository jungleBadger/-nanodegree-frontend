(function (window) {
    "use strict";

	const infoWindowTemplate = require("../templates/infoWindow");
	const getFoursquareInfo = require("../factory/factory").getFoursquareInfo;

	module.exports = function Constructor(ko) {
		let self = this;
		this.addressFilter = ko.observable();
		this.optionsFilter = ko.observable();
		this.errorMessage = ko.observable("");
		this.map = "";
		this.infoWindow = "";
		this.markers = {};
		this.service = "";
		this.bounds = "";
		this.currentPos = {
			"lat": -22.85833,
			"lng": -47.22
		};
		this.searchBox = "";
		this.autocomplete = "";

		this.showErrorMessage = function (errorMsg) {
			this.errorMessage(errorMsg);
		};
		this.cleanErrorMessage = function () {
			this.errorMessage("");
		};

		this.addMarker = function (marker) {
			this.markers[marker.id] = marker;
		};
		this.cleanMarkers = function () {
			self.hideMarkers();
			self.markers = {};
		};
		this.hideMarkers = function () {
			for (let markerId in self.markers) {
				if (self.markers.hasOwnProperty(markerId)) {
					self.markers[markerId].setMap(null);
				}
			}
		};
		this.showAllMarkers = function () {
			for (let markerId in self.markers) {
				if (self.markers.hasOwnProperty(markerId)) {
					self.markers[markerId].setVisible(true);
				}
			}
		};

		this.hideMarker = function (markerId) {
			self.markers[markerId].setVisible(false);
		};

		this.showMarker = function (markerId) {
			self.markers[markerId].setVisible(true);
		};

		this.animateMarker = function (marker) {
			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(window.google.maps.Animation.BOUNCE);
				window.setTimeout(function () {
					marker.setAnimation(null);
				}, 2000);
			}
		};

		this.optionsList = ko.observableArray([]);
		this.addListOption = function (option) {
			option.selected = ko.observable(false);
			this.optionsList.push(option);
		};
		this.clearOptionList = function () {
			self.optionsList.removeAll();
		};

		this.selectItem = function () {
			self.optionsList().forEach((option) => {
				option.selected(option.id === this.id);
			});

			for (let markerId in self.markers) {
				if (self.markers.hasOwnProperty(markerId)) {
					if (self.markers[markerId].id === this.id) {
						self.animateMarker(self.markers[markerId]);
						self.highlightPlace(this).then((placeData) => {
							self.infoWindow.setContent(
								infoWindowTemplate(
									this.name,
									placeData.photosUrls[0],
									this.formatted_address,
									placeData.foursquareInfo
								)
							);
							self.infoWindow.open(self.map, self.markers[markerId]);
						}).catch((err) => {
							self.showErrorMessage("Unexpected error: " + err);
						});
					}
				}
			}
			self.bounds.extend(this.geometry.location);
			self.map.fitBounds(self.bounds);
			self.map.panTo(self.markers[this.id].getPosition());
		};

		this.highlightPlace = function (place) {
			return new Promise((resolve, reject) => {
				let photosUrl = [];
				self.service.getDetails(place, function (finalResult, innerStatus) {
					if (innerStatus === window.google.maps.places.PlacesServiceStatus.OK) {

						if (finalResult.photos) {
							finalResult.photos.forEach((photo) => {
								try {
									photosUrl.push(photo.getUrl({
										"minWidth": 100,
										"maxWidth": 100
									}));
								} catch (e) {
									console.log(e);
								}
							});
						}
						finalResult.photosUrls = photosUrl;
						getFoursquareInfo({
							"lat": typeof place.geometry.location.lat === "function" ? place.geometry.location.lat() : place.geometry.location.lat,
							"lng": typeof place.geometry.location.lng === "function" ? place.geometry.location.lng() : place.geometry.location.lng,
							"keyword": place.name
						}).then((foursquareResult) => {
							if (foursquareResult && foursquareResult.hasOwnProperty("response")) {
								finalResult.foursquareInfo = foursquareResult.response;
							}
							return resolve(finalResult);
						}).catch((err) => {
							self.showErrorMessage("Error gathering foursquare info: " + err);
							return resolve(finalResult);
						});
					} else {
						reject(innerStatus);
					}
				});

			});
		};

		this.clearResults = function () {
			self.cleanMarkers();
			self.clearOptionList();
		};

		this.filteredOptionsList = ko.computed(() => {

			if (this.optionsFilter()) {
				return this.optionsList().filter((item) => {
					let showItem = item.formatted_address.indexOf(this.optionsFilter()) > -1;
					if (showItem) {
						this.showMarker(item.id);
					} else {
						this.hideMarker(item.id);
					}
					return showItem;
				});
			} else {
				this.showAllMarkers();
				return this.optionsList();
			}


		});

		this.showResults = ko.observable(false);
		this.toggleResults = function () {
			self.showResults(!self.showResults());
		}
	};
}(window));