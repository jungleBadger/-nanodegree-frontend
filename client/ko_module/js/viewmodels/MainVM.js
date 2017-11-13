(function () {
    "use strict";

    module.exports = function Constructor(ko) {
		let self = this;
		this.addressFilter = ko.observable();
		this.optionsList = ko.observableArray([]);
		this.clearOptionList = function () {
			console.log(self.optionsList());
			self.optionsList.removeAll();
		};
		this.map = "";
		this.infoWindow = "";
		this.markers = [];
		this.bounds = "";
		this.currentPos = {
			"lat": -22.85833,
			"lng": -47.22
		};
		this.searchBox = "";
		this.autocomplete = "";
		this.addMarker = function (marker) {
			this.markers.push(marker);
		};
		this.cleanMarkers = function () {
			self.hideMarkers();
			self.markers = [];
		};
		this.hideMarkers = function () {
			self.markers.forEach((marker) => {
				marker.setMap(null);
			});
		};
		this.addListOption = function (option) {
			this.optionsList.push(option);
		};

		this.test = function (optionIndex) {
			console.log(optionIndex);
			console.log(this);
			self.bounds.extend(this.geometry.location);
			self.map.fitBounds(self.bounds);
		};

		this.clearResults = function () {
			self.cleanMarkers();
			self.clearOptionList();


		}


		// this.computedTest = ko.computed(() => {
		// 	return this.addressFilter() ?
		// 		this.test().filter((item) => {
		// 			return item.x.indexOf(this.addressFilter()) > -1
		// 		}) :
		// 		this.test();
		// });
	};
}());