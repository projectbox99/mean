'use strict';

module.exports = {

	logOff: (userId, users, jwtmap, cache)=> {
		if (users[userId]) {
			let token = users[userId].token;
			delete users[userId];
			if (jwtmap[token]) {
				delete jwtmap[token];
			}
		}
	}
}
