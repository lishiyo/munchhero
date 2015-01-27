angular.module('foursquare').controller('MainSearchController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		console.log("mainsearchcontroller");
		
// 		var loadScript = function() {
// 			var script = document.createElement('script');
// 			script.type = 'text/javascript';
// 			script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=setUpMap';
// 			document.body.appendChild(script);
// 		}

// 		loadScript();
	}																									 
	
]);