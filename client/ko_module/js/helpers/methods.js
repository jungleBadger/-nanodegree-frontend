(function (window) {
	"use strict";

	module.exports = function (vms) {
		return {
			"generateNewOption": function (place) {
				vms.main.addListOption(place);
				if (!place.geometry) {
					console.log("Returned place contains no geometry");
					return;
				}
				let icon = {
					"url": place.icon,
					"scaledSize": new window.google.maps.Size(25, 25)
				};

				// Create a this.marker for each place.
				let marker = new window.google.maps.Marker({
					"id": place.id,
					"map": vms.get("main", "map"),
					"icon": icon,
					"title": place.name,
					"position": place.geometry.location,
					"animation": window.google.maps.Animation.DROP

				});

				marker.addListener("click", function () {
					vms.main.animateMarker(marker);
					vms.get("main", "infoWindow").setContent(place.name);
					vms.get("main", "infoWindow").open(vms.get("main", "map"), marker);
				});

				vms.main.addMarker(marker);

				if (place.geometry.viewport) {
					// Only geocodes have viewport.
					vms.get("main", "bounds").union(place.geometry.viewport);
				} else {
					vms.get("main", "bounds").extend(place.geometry.location);
				}
			}
		}
	};

}(window));