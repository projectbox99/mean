'use strict';

var crypto = require('crypto');
var randomBytes = require('bluebird').promisify(require('crypto').randomBytes);

module.exports = {
	generateRandomTokenClean: function() {
		let bytes = randomBytes(256);
		const hash = createHash('sha1');

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