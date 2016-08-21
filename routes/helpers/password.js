'use strict';

var crypto = require('crypto-js');
// var encrypted = require('bluebird').promisify(crypto.AES.encrypt);

const secret_key = 'grumpy & MEAN';

module.exports = {
	encryptPswdClean: function(pswd) {
		// return crypto.AES.encrypt(pswd, secret_key).toString();
		return crypto.SHA256(pswd).toString();
	},

	encryptPswdPromise1: function(pswd) {
		return new Promise((resolve) => {
			resolve(crypto.AES.encrypt(pswd, secret_key).toString());
		});
	}
}