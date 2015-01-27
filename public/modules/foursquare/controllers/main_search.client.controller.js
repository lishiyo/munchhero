angular.module('foursquare')

.directive('noScroll', function($document) {
	return {
		restrict: 'A',
		link: function($scope, $element, $attr) {

			$document.on('touchmove', function(e) {
				e.preventDefault();
			});
		}
	}
})

.controller('MainSearchController', ['$scope', '$stateParams', '$location', 'Authentication', '$http', '$templateCache',
	function($scope, $stateParams, $location, Authentication, $http, $templateCache, TDCardDelegate) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		var url = $location.url();
		
		var getFoodPics = function() {
			$http.get(url).
				success(function(data, status, headers, config) {					
					$scope.venues = data.venuesArr;
					$scope.photos = data.photosArr;
				
					$scope.latLng = [];
					$scope.venues.forEach(function(venue){
						$scope.latLng.push({
							lat: Number(venue.location.lat),
							lng: Number(venue.location.lng),
							name: venue.name,
							rating: venue.rating,
							price: venue.price
						});
					}, this);
				
				window.latLng = $scope.latLng;
				
				console.log("success latLng", $scope.latLng);
				}).
				error(function(data, status, headers, config) {
					console.log("error", data);
				});
		};
		
		$scope.loadAll = function(){
			getFoodPics();
		};
		
		
	}																									 
	
]);
