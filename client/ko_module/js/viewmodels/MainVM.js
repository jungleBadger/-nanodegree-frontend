(function (window) {
    "use strict";

    module.exports = function Constructor(ko) {
		let self = this;
		this.addressFilter = ko.observable();
		this.optionsFilter = ko.observable();

		this.map = "";
		this.infoWindow = "";
		this.markers = {};
		this.bounds = "";
		this.currentPos = {
			"lat": -22.85833,
			"lng": -47.22
		};
		this.searchBox = "";
		this.autocomplete = "";

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
		this.animateMarker = function (marker) {
			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(window.google.maps.Animation.BOUNCE);
				window.setTimeout(function () {
					marker.setAnimation(null);
				}, 2000);
			}
		}

		this.optionsList = ko.observableArray([]);
		this.addListOption = function (option) {
			console.log(option);
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
						self.infoWindow.open(self.map, self.markers[markerId]);
					}
				}
			}
			self.bounds.extend(this.geometry.location);
			self.map.fitBounds(self.bounds);
		};
		this.clearResults = function () {
			self.cleanMarkers();
			self.clearOptionList();
		};

		this.filteredOptionsList = ko.computed(() => {
			return this.optionsFilter() ?
				this.optionsList().filter((item) => {
					return item.formatted_address.indexOf(this.optionsFilter()) > -1
				}) :
				this.optionsList();
		});

		this.showResults = ko.observable(false);
		this.toggleResults = function () {
			self.showResults(!self.showResults());
		}
	};
}(window));