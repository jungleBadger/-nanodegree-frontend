(function () {
	"use strict";

	module.exports = function (localTitle, imgSrc, localAddress) {
		return `<div class="infowindow"><h5>${localTitle}</h5><img src="${imgSrc}" /><div>${localAddress}</div></div>`;
	}

}());