'use strict';

/**
 * Module dependencies.
 */

module.exports = function(app) {
	var foursquare = require('../../app/controllers/foursquare.server.controller');
	
	// foursquare search Routes
	app.route('/searchFood').get(foursquare.searchFood);		
};