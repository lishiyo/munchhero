'use strict';

// Setting up route
angular.module('foursquare').config(['$stateProvider',
	function($stateProvider) {
		// search routing
		$stateProvider.
		state('mainSearch', {
			url: '/searchFood',
			templateUrl: 'modules/foursquare/views/main_search.client.view.html'
		});
	}
]);