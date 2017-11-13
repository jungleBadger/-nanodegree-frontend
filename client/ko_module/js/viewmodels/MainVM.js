(function () {
    "use strict";

    module.exports = function Constructor(ko) {
		this.addressFilter = ko.observable();
		this.test = ko.observableArray([]);
		this.map = "";
		this.infoWindow = "";
		this.currentPos = {
			"lat": -22.85833,
			"lng": -47.22
		};

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
	}

}());