'use strict';

module.exports = {

	getToken: data => {
		if (data){
			let regex = /^.* (.*)$/i;
			return regex.exec(data)[1];	
		}

		return "";
	},

	getUserIdFromToken: (token, jwtmap) => {
		if (token && jwtmap) {
			if (jwtmap[token] && jwtmap[token].user)
				return jwtmap[token].user.toString();
		}

		return "";
	},

	getUserRoleFromToken: (token, jwtmap) => {
		if (token && jwtmap) {
			if (jwtmap[token] && jwtmap[token].role)
				return jwtmap[token].role.toString();
		}

		return "";
	}
}
