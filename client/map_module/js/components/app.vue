<template>
	<main id="app">
		<div id="wrapper">
			<div>
				<input type="number" v-model="lat" />
				<input type="number" v-model="lng" />
				<button @click="addMarker">Add Marker</button>
			</div>
			<div id="map"></div>
		</div>
	</main>
</template>

<script type="text/javascript">
	(function () {
		"use strict";

		const MapModel = require("../model/GmapModel");
		const Position = require("../model/Position");

		module.exports = {
			"name": "app",
			"data": function () {
				return {
					"locations": [],
					"markers": [],
					"devices": {},
					"map": "",
					"lat": 40.7413549,
					"lng": -74.0089934,
					"infoWindow": new window.google.maps.InfoWindow(),
					"geoCoder": new window.google.maps.Geocoder,
					"streetViewService": new window.google.maps.StreetViewService()
				}
			},
			"beforeMount": function () {
				window.setTimeout(() => {
					this.map = new window.google.maps.Map(document.getElementById("map"), new MapModel(-22.85833, -47.22));
				}, 0);
			},
			"components": {
			},

			"socket": {
				"events": {
				}
			},
			"methods": {
				"getAddress": function (lat = 0, lng = 0) {
					return new Promise((resolve, reject) => {
						this.geoCoder.geocode({
							"location": {
								"lat": lat,
								"lng": lng
							}
						}, (results, status) => {
							if (results && results.length && results[1]) {
								resolve(results[1].formatted_address);
							} else {
								reject({results, status});
							}
						});
					});
				},
				"setContent": function (lat, lng, address, id) {
					let wrapper = document.createElement("div");
					let removeBtn = document.createElement("button");
					let latInfo = document.createElement("span");
					let lngInfo = document.createElement("span");
					let addressInfo = document.createElement("div");
					addressInfo.appendChild(document.createTextNode(address));
					latInfo.appendChild(document.createTextNode(lat));
					lngInfo.appendChild(document.createTextNode(lng));
					removeBtn.appendChild(document.createTextNode("Remove"));
					removeBtn.addEventListener("click", () => {
						this.markers[this.markers.findIndex((marker) => {return marker.id === id})].setMap(null);
					});
					wrapper.appendChild(addressInfo);
					wrapper.appendChild(latInfo);
					wrapper.appendChild(lngInfo);
					wrapper.appendChild(removeBtn);
					return wrapper;
				},
				"addMarker": function () {
					let position = new Position({
						"id": Date.now(),
						"lat": this.lat,
						"lng": this.lng
					});
					let marker = new window.google.maps.Marker({
						"id": position.id,
						"position": position,
						"map": this.map,
						"title": position.id.toString(),
						"icon": "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
						"animation": window.google.maps.Animation.DROP
					});
					marker.addListener("click", () => {
						console.log(position);
						this.getAddress(position.lat, position.lng).then((address) => {
							this.infoWindow.setContent(this.setContent(position.lat, position.lng, address, position.id));
							this.infoWindow.open(this.map, marker);
						}).catch((err) => {
							console.log(err);

						});

					});

					this.markers.push(marker);

				}
			}
		};
	}());
</script>
<style scoped>
	#app {
		width: 100%;
		height:100%;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		display: flex;
		overflow: hidden;
	}

	#app > * {
		box-sizing: inherit;
	}

	#wrapper {
		flex: 1;
		flex-direction: column;
		display: flex;
		width: 100%;
		height: 100%;
	}

	#map {
		width: 100%;
		flex: 1;
		min-height: 50%;
	}

</style>