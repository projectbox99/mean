'use strict';

let mongoose = require('mongoose');
let Promise = require('bluebird');

// Get models
let List = mongoose.model('List', require('../models/lists'));


exports.getLists = () => {
	List.find().exec().then((lists) => {
		console.info("LISTS retrieved successfully!");
		return Promise.resolve([ lists.roles, lists.categories, lists.cities ]);
	}, (err) => {
		console.error(`Failed to retrieve LISTS from DB: ${err}`);
		return Promise.reject(err);
	});
}	// getLists()
