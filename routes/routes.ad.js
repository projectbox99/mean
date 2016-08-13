'use strict';

const Ad = require('../models/ad');

/**
 *		Ad
 */
module.exports = function (router) {
    router.get('/api/ads', (req, res, next) => {
        Ad.find((err, ads) => {
            if (err) {
                console.error('Error retrieving ad list!');
                return res.status(500).json({
                    msg: 'Error fetching ad data!'
                });
            }

            res.status(200).json({
                data: ads
            });
        });
    });

    router.get('/api/ads/:adId', (req, res, next) => {
        var adId = req.params.adId;
        next();
    }, (req, res) => {
        Ad.findById(adId, (err, mongoResponse) => {
            if (err) {
                console.error(`Error finding ad: ${adId}`);
                return res.status(500).json({
                    msg: 'Error finding ad!'
                });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });

    router.post('/api/ads', (req, res, next) => {
        var ad = new Ad({
            title: req.body.title,
            category: req.body.category,
            desc: req.body.desc,
            photos: req.body.photos,
            city: req.body.city,
            price: req.body.price,
            owner: req.body.owner,
            dateCreated: req.body.dateCreated,
            dateValid: req.body.dateValid
        });

        ad.save((err, mongoResponse) => {
            if (err) {
                console.error('Error creating ad!');
                return res.status(500).json({
                    msg: 'Error saving ad data!'
                });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });

    router.put('/api/ads/:adId', (req, res, next) => {
        var adId = req.params.adId;
        next();
    }, (req, res) => {
        Ad.findByIdAndUpdate(adId, {
            title: req.body.title,
            category: req.body.category,
            desc: req.body.desc,
            photos: req.body.photos,
            city: req.body.city,
            price: req.body.price,
            owner: req.body.owner,
            dateCreated: req.body.dateCreated,
            dateValid: req.body.dateValid
        }, {
            new: true,
            upsert: false,
            runValidators: true
        }, (err, mongoResponse) => {
            if (err) {
                console.error('Error updating ad!');
                return res.status(500).json({
                    msg: `Error updating ad data for ${adId}!`
                });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });

    router.delete('/api/ads/:adId', (req, res, next) => {
        var adId = req.params.adId;
        next();
    }, (req, res) => {
        Ad.findByIdAndRemove(adId, {}, (err, mongoResponse) => {
            if (err) {
                console.error('Error deleting ad!');
                return res.status(500).json({
                    msg: `Error deleting ad: ${adId}`
                });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });
}