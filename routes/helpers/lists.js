'use strict';

var Lists = require('../../models/lists');


module.exports = {

	addCityIfNotExists: (city, cities) => {
		if (city && cities) {
			let cityUpper = city.toUpperCase();

			let found = false;
			for (let i = 0; i < cities.length && !found; i++) {
				if (cityUpper === cities[i].toUpperCase())
					found = true;
			}

			if (!found) {
				cities.push(city);
			}
		}

		return cities;
	},

	updateCitiesInDb: cities => {
		console.log(`In updateCitiesInDb(${cities})`);
		Lists.findOneAndUpdate({}, { cities: cities }, (err, lists) => {
            if (err) {
                console.error('Error retrieving lists!');
                return false;
            }

            return true;
        });
    }
}
