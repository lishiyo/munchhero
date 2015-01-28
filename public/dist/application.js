'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.utils', 'ngSanitize', 'ionic', 'ionic.contrib.ui.tinderCards'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);


//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('foursquare');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
		
		// Set photos
		Menus.addMenuItem('topbar', 'Map Search', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'Search Places', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'Swipe Food', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict'

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

angular.module('core')

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
})

.controller('HomeController', ['$scope', 'Authentication', '$location', 
	function($scope, Authentication, $location) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		$scope.loadScript = function(){
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=setUpMap';
			document.body.appendChild(script);
		};
		
		// http://field-neutral.codio.io:3000/#!/searchFood?query=pizza&lat=40.811597299999995&lng=-73.9589499
		$scope.getSearch = function(){			
			var lat = angular.element( document.querySelector( '#lat' ) ).val();
			var lng = angular.element( document.querySelector( '#lng' ) ).val();
			
			var url = '/searchFood?query=' + this.query + "&lat=" + lat + "&lng=" + lng;
			console.log("getSearch", url);
			
			$location.path("/searchFood").search({
				query: this.query,
				lat: lat,
				lng: lng
			});
			
		}
	}																									 	
]);
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
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
angular.module('foursquare')

.directive('noScroll', ["$document", function($document) {
	return {
		restrict: 'A',
		link: function($scope, $element, $attr) {
			$document.on('touchmove', function(e) {
				e.preventDefault();
			});
		}
	}
}])

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
				
					$scope.createCards();
				
				}).error(function(data, status, headers, config) {
					console.log("error", data);
				});
		};
		
		$scope.loadAll = function(){
			getFoodPics();
		};
		
		// upon click, show card data
		$scope.showData = function(card) {
			console.log("clicked showdata", card, card.vName);
			
			var dataBox = angular.element( document.querySelector( 'div.card-data' ) );
			
			dataBox.toggleClass('hidden');     
		};
		
		$scope.createCards = function(){
			$scope.cardTypes = $scope.photos;
			$scope.cards = Array.prototype.slice.call($scope.cardTypes, 0);
		};
	
		$scope.cardDestroyed = function(index) {
			$scope.cards.splice(index, 1);
		};

		$scope.addCard = function() {
			var newCard = $scope.cardTypes[Math.floor(Math.random() * $scope.cardTypes.length)];
			newCard.id = Math.random();
			$scope.cards.push(angular.extend({}, newCard));
		}
		
	}																									 
	
])

// .controller('CardsCtrl', ['$scope', '$stateParams', '$location', 'Authentication', '$http', '$templateCache', 
// 	function($scope, TDCardDelegate) {
	
// 		var cardTypes = [
// 			{ image: 'https://pbs.twimg.com/profile_images/546942133496995840/k7JAxvgq.jpeg' },
// 			{ image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png' },
// 			{ image: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg' },
// 		];

// 		$scope.createCards = function(){
// 			console.log("cardsCtrl", $scope.photos);

// 			$scope.cardTypes = $scope.photos.map(function(obj){
// 				return { image: obj.url }
// 			});

// 			console.log("cardTypes in cardsCtrl", $scope.cardTypes);
// 		};
		
		
// 		$scope.cards = Array.prototype.slice.call($scope.cardTypes, 0);

// 		$scope.cardDestroyed = function(index) {
// 			$scope.cards.splice(index, 1);
// 		};

// 		$scope.addCard = function() {
// 			var newCard = $scope.cardTypes[Math.floor(Math.random() * $scope.cardTypes.length)];
// 			newCard.id = Math.random();
// 			$scope.cards.push(angular.extend({}, newCard));
// 		}
// }])

.controller('CardCtrl', ['$scope', '$stateParams', '$location', 'Authentication', '$http', '$templateCache', 
	function($scope, TDCardDelegate) {
			
		$scope.cardSwipedLeft = function(index) {
			console.log('LEFT SWIPE');
			$scope.addCard();
		};
		$scope.cardSwipedRight = function(index) {
			console.log('RIGHT SWIPE');
			$scope.addCard();
		};
}]);


'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);