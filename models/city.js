'use strict';

var mongoose = require('mongoose');

class City_schema extends mongoose.Schema {
	constructor() {
		super({
			name: { type: String, required: true }
		});
	}	// constructor()
}	// class City_schema

module.exports = mongoose.model('City', new City_schema);