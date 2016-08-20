'use strict';

var crypto = require('crypto');
var randomBytes = require('bluebird').promisify(crypto.randomBytes);

module.exports = {
	generateRandomToken: function() {
		return randomBytes(256).then((buffer) => {
			return crypto
				.createHash('sha1')
				.update(buffer)
				.digest('hex');
		});
	}
}