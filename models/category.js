'use strict';

var mongoose = require('mongoose');

class Category_schema extends mongoose.Schema {
	constructor() {
		super({
			name: { type: String, required: true }
		});
	}	// constructor()
}	// class Category_schema

module.exports = mongoose.model('Category', new Category_schema);