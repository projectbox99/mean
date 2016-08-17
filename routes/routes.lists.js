'use strict';

var Lists = require('../models/lists');


/**
 *		Lists
 */

module.exports = function (router) {
    router.get('/api/lists', (req, res, next) => {
        Lists.find((err, lists) => {
            if (err) {
                console.error('Error retrieving lists!');
                return res.status(500).json({
                    msg: 'Error fetching lists data!'
                });
            }

            res.status(200).json({
                data: lists
            });
        });
    });
}