<template>
	<main id="app">
		<div id="wrapper">
			<div id="map"></div>
		</div>
	</main>
</template>

<script type="text/javascript">
	(function () {
		"use strict";

		const MapModel = require("../model/gmapModel");

		module.exports = {
			"name": "app",
			"data": function () {
				return {
					"locations": [],
					"markers": {},
					"devices": {},
					"map": "",
					"infoWindow": new window.google.maps.InfoWindow(),
					"geoCoder": new window.google.maps.Geocoder
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
		height:100%;
	}

	#map {
		width: 100%;
		height: 100%;
	}

</style>