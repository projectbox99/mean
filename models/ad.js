'use strict';

var mongoose = require('mongoose');

class Ad_schema extends mongoose.Schema {
	constructor() {
		super({
			title: { type: String, required: true },
			category: { type: String, required: true },
			desc: { type: String, required: true },
			photoMain: { type: String },
			photos: [{ type: String }],
			city: { type: String, required: true },
			price: { type: Number, required: true },
			owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
			approved: { type: Boolean, required: true },
			dateCreated: { type: Date, required: true, default: Date.now },
			dateValid: { type: Date, required: true }
		});
	}	// constructor()
}	// class Ad_schema

module.exports = mongoose.model('Ad', new Ad_schema);