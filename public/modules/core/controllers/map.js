'use strict';

var setUpMap = function(){
	var getLocation = function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else { 
				console.log("Geolocation is not supported by this browser.");
		}
	}

	var showPosition = function(position) {
		var theLatLng = new google.maps.LatLng(Number(position.coords.latitude), Number(position.coords.longitude)); 
		console.log("showposition", theLatLng);

		document.getElementById('lat').setAttribute("value", position.coords.latitude);
		document.getElementById('lng').setAttribute("value", position.coords.longitude);

		var mapOptions = {
			zoom: 15,
			center: theLatLng
		};

		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		var centerMarker = new google.maps.Marker({
			position: theLatLng,
			map: map,
			title: "Center",
			icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
		});

		var infoWindows = [];
		var markers = [];
		var latLngBounds = new google.maps.LatLngBounds();

// 		lat: Number(venue.location.lat),
// 		lng: Number(venue.location.lng),
// 		name: venue.name,
// 		rating: venue.rating,
// 		price: venue.price
		if (latLng !== undefined && latLng.length > 0) {
			latLng.forEach(function(item){
				infoWindows.push(new google.maps.InfoWindow({
					content: "<div>" + item.name + "</div>" + "<div>" + "Rating: " + item.rating + "</div>" +
						"<div>" + "Price Level: " + item.price + "</div>"
				}));

				var latLng = new google.maps.LatLng(item.lat, item.lng);

				markers.push(new google.maps.Marker({
					position: latLng,
					map: map,
					title: item.name,
					icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
				}));
				
				latLngBounds.extend(latLng);
			});
		}

		map.setCenter(latLngBounds.getCenter());
		map.fitBounds(latLngBounds);

		//console.log(infoWindows)
		for (var i = 0; i < markers.length; i++) {
			google.maps.event.addListener(markers[i], 'click', function(innerKey) {
				var clicks = 0;
				return function() {
					// console.log(infoWindows[i]);
					clicks++;
					infoWindows[innerKey].open(map, markers[innerKey]);
				}
			}(i));
		}
	}

	getLocation();
}