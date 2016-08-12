'use strict';

var mongoose = require('mongoose');

class User_schema extends mongoose.Schema {
	constructor() {
		super({
			username: { type: String, required: true },
			password: { type: String, required: true },
			namesFirst: String,
			namesLast: String,
			email: String,
			phone1: String,
			phone2: String,
			skypeId: String,
			photo: String,
			role: { type: Number, required: true, default: 0 },
			dateCreated: { type: Date, required: true, default: Date.now }
		});
	}	// constructor()
}	// class User_schema

module.exports = mongoose.model('User', new User_schema);