'use strict';

module.exports = {

	loggedIn: (userId, users, jwtmap) => {
		if (users[userId])
			return true;

		return false;
	},

	logOff: (userId, users, jwtmap, cache) => {
		if (users[userId]) {
			let token = users[userId].token;
			delete users[userId];
			if (jwtmap[token]) {
				delete jwtmap[token];
			}
		}
	}
}
