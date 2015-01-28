'use strict';

angular.module('foursquare', ['ionic', 'ionic.contrib.ui.tinderCards'])
	.config(['$stateProvider',
		function($stateProvider) {
			// search routing
			$stateProvider.
			state('mainSearch', {
				url: '/searchFood',
				templateUrl: 'modules/foursquare/views/main_search.client.view.html'
			});
		}
]);