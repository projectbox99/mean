'use strict';

var Lists = require('../../models/lists');


module.exports = {

	addCityIfNotExists: (city, cities) => {
		if (city && cities) {
			let cityUpper = city.toUpperCase();

			let found = false;
			for (let i = 0; i < cities.length && !found; ++i) {
				if (cityUpper === cities[i].toUpperCase())
					found = !found;
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
                console.error('Error updating lists!');
                return false;
            }

            return true;
        });
    },

    categoryInCache: (category, categories) => {
    	if (category && categories) {
    		let found = false;
    		for (let i = 0; i < categories.length && !found; ++i) {
    			if (category === categories[i])
    				found = !found;
    		}

    		return found;
    	}
    },

    removeCategoryFromCache: (category, categories) => {
    	if (category && categories) {
    		let foundAtIndex = -1;
    		for (let i = 0; i < categories.length && foundAtIndex < 0; ++i) {
    			if (category === categories[i])
    				foundAtIndex = i;
    		}

    		if (foundAtIndex > -1) {
    			categories.splice(foundAtIndex, 1);
    		}

    		return categories;
    	}
    }
}
