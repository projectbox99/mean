'use strict';

var Lists = require('../models/lists');


/**
 *		Lists
 */

module.exports = app => {
    app.get('/api/lists', (req, res, next) => {
        Lists.findOne((err, lists) => {
            if (err) {
                console.error('Error retrieving lists!');
                return res.status(500).json({
                    msg: 'Error fetching lists data!'
                });
            }

            // let categoriesCount = lists.categories.count;

            res.status(200).json({
                data: { categories: lists.categories, cities: lists.cities, roles: lists.roles }
            });
        });
    });
}