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

		if (latLng) {
			latLng.forEach(function(item){
				infoWindows.push(new google.maps.InfoWindow({
					content: "<div>" + item[2] + "</div>" + "<div>" + "Rating: " + item[3] + "</div>" +
						"<div>" + "Price Level: " + item[4] + "</div>"
				}));

				var latLng = new google.maps.LatLng(item[0], item[1]);

				markers.push(new google.maps.Marker({
					position: latLng,
					map: map,
					title: item[2],
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


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		var loadScript = function() {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=setUpMap';
			document.body.appendChild(script);
		}

		loadScript();
	}																									 
	
]);