(function () {
	"use strict";

	module.exports = function (localTitle, imgSrc, localAddress) {
		let imgUrl = imgSrc ? `<img src="${imgSrc}" />` : "<div>No picture available</div>";
		return `<div class="infowindow"><h5>${localTitle}</h5>${imgUrl}<div>${localAddress}</div></div>`;
	}

}());