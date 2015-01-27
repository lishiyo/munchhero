'use strict'

var async = require('async');
var http = require('http');
var https = require('https');
var secrets = require('./foursquare_config');
var foursquareClientId = process.env.FS_CLIENT_ID || secrets.foursquare.clientId;
var foursquareClientSecret = process.env.FS_CLIENT_SECRET || secrets.foursquare.clientSecret;
var photoObjs = [];

// get food pics for one venue
var getOneFood = function(vId, cb){
	var options = {
		host: 'api.foursquare.com',
		port: 443,
		path: '/v2/venues/' + vId + "/photos?limit=2&v=20150125&client_id=" + foursquareClientId + '&client_secret=' + foursquareClientSecret,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	
	var req = https.get(options, function(res) {
		var dataChunks = [];	
		res.on('data', function(chunk) {
			dataChunks.push(chunk);				
		}).on('end', function() {
			var body = Buffer.concat(dataChunks);
			var stringBody = body.toString('utf-8');
			var parsedData = JSON.parse(stringBody);
			var photoData = parsedData['response']['photos']['items'];
			for (var i = 0; i < photoData.length ; i++) {
				var obj = {
					url: photoData[i]['prefix']+"300x300"+photoData[i]['suffix'],
					venueId: vId
				}						
				if (obj !== undefined) {
					photoObjs.push(obj);
				}				
			}	
			
			cb(null);
		});
	});
	
	req.on('error', function(error) {
		cb(error);
	});
	
	req.end();
}


module.exports = getOneFood;