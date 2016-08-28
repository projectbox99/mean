'use strict';

const Ad = require('../models/ad');

/**
 *		Ad
 */
module.exports = app => {
    app.post('/api/ads/list', (req, res, next) => {
        if (!req.body || !req.body.user) {
            console.log('No body!');
            return res.status(500).json({
                data: 'Error: req.body not found...'
            });
        }

        let owner = req.body.user;
        if (owner !== "__unapproved__") {
            Ad.find({ owner: owner }, (err, ads) => {
                if (err) {
                    console.error(`Error retrieving ad list: ${err}`);
                    return res.status(500).json({
                        data: 'Error fetching ad data!'
                    });
                }

                res.status(200).json({
                    data: ads
                });
            });
        } else {
            Ad.find({ approved: false }, (err, ads) => {
                if (err) {
                    console.error(`Error retrieving ad list: ${err}`);
                    return res.status(500).json({
                        data: 'Error fetching ad data!'
                    });
                }

                res.status(200).json({
                    data: ads
                });
            });
        }
    });

    app.get('/api/ads', (req, res, next) => {
        Ad.find((err, ads) => {
            if (err) {
                console.error('Error retrieving ad list!');
                return res.status(500).json({
                    data: 'Error fetching ad data!'
                });
            }

            res.status(200).json({
                data: ads
            });
        });
    });

    app.get('/api/ads/:adId', (req, res, next) => {
        let adId = req.params.adId;
        console.log(`GET:/api/ads/${adId}`);

        Ad.findById(adId, (err, mongoResponse) => {
            if (err) {
                console.error(`Error finding ad: ${adId}`);
                return res.status(500).json({
                    data: 'Error finding ad!'
                });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });

    app.post('/api/ads', (req, res, next) => {
        if (!(req.body && req.body.title)) {
            return res.status(500).json({ data: "Error: missing body"});
        }

        console.log(`BODY in app: ${JSON.stringify(req.body)}`);
        if (!req.body.price || !typeof Number(req.body.price) === "number") {
            return res.status(400).json({ data: "Error: Bad or missin price parameter" });
        }

        next();
    }, (req, res) => {
        let created = new Date();
        let expires = new Date().setDate(created.getDate() + 60);

        let ad = new Ad({
            title: req.body.title,
            category: req.body.category,
            desc: req.body.desc,
            photoMain: req.body.photoMain,
            photos: req.body.photos || "",
            city: req.body.city,
            price: Number(req.body.price),
            owner: req.body.owner,
            approved: req.body.approved || false,
            dateCreated: created,
            dateValid: expires
        });

        ad.save((err, mongoResponse) => {
            if (err) {
                console.error(`Error creating ad: ${err}`);
                return res.status(500).json({ data: "Error saving ad data!" });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });

    app.put('/api/ads/:adId', (req, res, next) => {
        var adId = req.params.adId;

        Ad.findByIdAndUpdate(adId, {
            title: req.body.title,
            category: req.body.category,
            desc: req.body.desc,
            photos: req.body.photos,
            city: req.body.city,
            price: req.body.price,
            owner: req.body.owner,
            approved: req.body.approved || false,
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

    app.delete('/api/ads/:adId', (req, res, next) => {
        var adId = req.params.adId;

        Ad.findByIdAndRemove(adId, {}, (err, mongoResponse) => {
            if (err) {
                console.error('Error deleting ad!');
                return res.status(500).json({
                    data: `Error deleting ad: ${adId}`
                });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });
}