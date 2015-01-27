'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Photo Schema - each photo holds upvoter_ids array and votes count
 * https://book.discovermeteor.com/chapter/voting
 */
var PhotoSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	url: {
		type: String,
		default: '',
		trim: true,
		required: 'must have image'
	},
	venueId: {
		type: String,
		default: '',
		trim: true,
		required: "must belong to a venue"
	},
	votes: {
		type: Number,
		default: 0
	},
	upvoter_ids: {
		type: Array
	}
});

mongoose.model('Photo', PhotoSchema);