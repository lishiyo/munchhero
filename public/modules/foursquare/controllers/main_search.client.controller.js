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
	
])

.controller('CardsCtrl', ['$scope', '$stateParams', '$location', 'Authentication', '$http', '$templateCache', 
	function($scope, TDCardDelegate) {
	
		console.log('CARDS CTRL');

		var cardTypes = [
			{ image: 'https://pbs.twimg.com/profile_images/546942133496995840/k7JAxvgq.jpeg' },
			{ image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png' },
			{ image: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg' },
		];

		$scope.cards = Array.prototype.slice.call(cardTypes, 0);

		$scope.cardDestroyed = function(index) {
			$scope.cards.splice(index, 1);
		};

		$scope.addCard = function() {
			var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
			newCard.id = Math.random();
			$scope.cards.push(angular.extend({}, newCard));
		}
}])

.controller('CardCtrl', ['$scope', '$stateParams', '$location', 'Authentication', '$http', '$templateCache', 
	function($scope, TDCardDelegate) {
		console.log("cardCtrl", TDCardDelegate);
		
		$scope.cardSwipedLeft = function(index) {
			console.log('LEFT SWIPE');
			$scope.addCard();
		};
		$scope.cardSwipedRight = function(index) {
			console.log('RIGHT SWIPE');
			$scope.addCard();
		};
}]);

