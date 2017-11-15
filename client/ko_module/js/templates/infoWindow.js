(function () {
	"use strict";

	module.exports = function (localTitle, imgSrc, localAddress, foursquareInfo) {
		console.log(foursquareInfo.venues);
		let imgUrl = imgSrc ? `<img src="${imgSrc}" />` : "<div>No picture available</div>";
		let foursquareInfoBlock = "<div>";
		try {
			if (foursquareInfo && foursquareInfo.venues &&
				Array.isArray(foursquareInfo.venues) &&
				typeof foursquareInfo.venues[0] === "object") {

				if (foursquareInfo.venues[0].hasOwnProperty("hereNow")) {
					foursquareInfoBlock += `<div class="4square-info">People checked in: ${foursquareInfo.venues[0].hereNow.count || 0}</div>`;
				}

				if (foursquareInfo.venues[0].hasOwnProperty("contact")) {
					if (foursquareInfo.venues[0].contact.hasOwnProperty("facebookName")) {
						foursquareInfoBlock += `<div class="4square-info">Facebook name: ${foursquareInfo.venues[0].contact.facebookName}</div>`;
					}
					if (foursquareInfo.venues[0].contact.hasOwnProperty("formattedPhone")) {
						foursquareInfoBlock += `<div class="4square-info">Phone: ${foursquareInfo.venues[0].contact.formattedPhone}</div>`;
					}
				}


			} else {
				foursquareInfoBlock += "No data from foursquare";
			}
		} catch (e) {
			console.log(e);
		}

		foursquareInfoBlock += "</div>";


		return `<div class="infowindow"><h5>${localTitle}</h5><div class="info-block">${imgUrl} ${foursquareInfoBlock}</div><div>${localAddress}</div></div>`;
	}

}());