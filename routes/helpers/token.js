'use strict';

const crypto = require('crypto');
const randomBytes = require('bluebird').promisify(require('crypto').randomBytes);

module.exports = {
	generateRandomTokenClean: function() {
		var bytes = crypto.randomBytes(256);
		var hash = crypto.createHash('sha256');

		hash.update(bytes);
		return hash.digest('hex');
	},

	generateRandomToken: function() {
		return randomBytes(256).then((buffer) => {
			return crypto
				.createHash('sha1')
				.update(buffer)
				.digest('hex');
		});
	}
}