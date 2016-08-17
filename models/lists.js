'use strict';

var mongoose = require('mongoose');

class List_schema extends mongoose.Schema {
	constructor() {
		super({
			roles: [{ type: String }],
			categories: [{ type: String }],
			cities: [{ type: String }]
		});
	}	// constructor()
}	// class List_schema

module.exports = mongoose.model('List', new List_schema);