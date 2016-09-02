'use strict';

const Ad = require('../models/ad');

var getToken = require('./helpers/tokens').getToken;
var getUserIdFromToken = require('./helpers/tokens').getUserIdFromToken;
var getUserRoleFromToken = require('./helpers/tokens').getUserRoleFromToken;

var addCityIfNotExists = require('./helpers/lists').addCityIfNotExists;
var updateCitiesInDb = require('./helpers/lists').updateCitiesInDb;

var loggedIn = require('./helpers/users').loggedIn;
/**
 *		Ad
 */
module.exports = app => {
    app.post('/api/ads/search', (req, res, next) => {
        if (!req.body || !req.body.str) {
            return res.status(500).json({ data: 'Error: req.body not found...' });
        }

        let str = req.body.str;
        let cat = req.body.cat ? req.body.cat : "";
        let city = req.body.city ? req.body.city : "";

        console.info(`${str} - ${cat} - ${city}`);

        let terms = str.split(' ');
        let termsRegEx = '.*' + terms.join('|') + '.*';
        console.info(`${termsRegEx}`);

        Ad.find(
            {
                title: new RegExp(termsRegEx, 'i'),
                category: new RegExp('.*' + cat + '.*', 'i'),
                city: new RegExp('.*' + city + '.*', 'i'),
                approved: true
            },
            (err, ads) => {
                if (err) {
                    console.error('Error retrieving ad list!');
                    return res.status(500).json({ data: 'Error fetching ad data!' });
                }

                if (!ads) {
                    return res.status(200).json({ data: { count: 0, ads: [] } })
                }

                return res.status(200).json({ data: { count: ads.length, ads: ads }});
            }
        );
    });

    app.post('/api/ads/list', (req, res, next) => {
        if (!req.body || !req.body.user) {
            return res.status(500).json({ data: 'Error: req.body not found...' });
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
                return res.status(500).json({ data: 'Error fetching ad data!' });
            }

            res.status(200).json({
                data: ads
            });
        });
    });

    app.get('/api/ads/:startIdx/:count', (req, res, next) => {
        if (!req.params || !req.params.startIdx || !req.params.count) {
            return res.status(400).json({ data: 'Bad request - missing start index/ count parameters' });
        }

        // let count;
        Ad.find({ approved: true }, (err, ads) => {
            if (err) {
                console.error(`Error retrieving ads ${req.params.startIdx} - ${req.params.startIdx + req.params.count}`);
                return res.status(500).json({ data: 'Error fetching ad data!' });
            }

            res.status(200).json({ data: { count: app.locals.adsCount, ads: ads }});
        }).skip(req.params.startIdx).limit(req.params.count);
    });

    app.get('/api/ads/:adId', (req, res, next) => {
        if (!req.params || !req.params.adId) {
            return res.status(400).json({
                data: 'Bad request - no ad id supplied'
            });
        }

        let adId = req.params.adId;

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
        if (!req.body || !req.body.title) {
            return res.status(500).json({ data: "Error: missing body"});
        }

        let token = getToken(req.headers['authorization']);

        if (!token) {
            return res.status(400).json({
                data: 'Not authorized'
            });
        }

        let tokenUserId = getUserIdFromToken(token, app.locals.jwtmap);
        if (!loggedIn(tokenUserId, app.locals.users, app.locals.jwtmap)) {
            return res.status(400).json({
                data: 'Not authorized - not logged in'
            });
        }

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
            approved: req.body.approved,
            dateCreated: created,
            dateValid: expires
        });

        ad.save((err, mongoResponse) => {
            if (err) {
                console.error(`Error creating ad: ${err}`);
                return res.status(500).json({ data: "Error saving ad data!" });
            }

            // update server cache
            if (app.locals.adsCount)
                app.locals.adsCount++;
            if (app.locals.cache && app.locals.cache.get('ADS_COUNT'))
                app.locals.cache.put('ADS_COUNT', app.locals.cache.get('ADS_COUNT') + 1);
            // console.info(`${chalkBold('[ MongoDB ]')} ADS_COUNT: ${app.locals.adsCount} (Incremented)`);

            res.status(200).json({
                data: mongoResponse
            });
        });
    });

    app.put('/api/ads/:adId', (req, res, next) => {
        if (!req.params || !req.params.adId) {
            return res.status(400).json({ data: 'Bad request - missing ad id' });
        }

        let adId = req.params.adId;

        if (!req.body || !req.body.title) {
            return res.status(500).json({ data: "Error: missing body"});
        }

        let token = getToken(req.headers['authorization']);

        if (!token) {
            return res.status(400).json({ data: 'Not authorized' });
        }

        let tokenUserId = getUserIdFromToken(token, app.locals.jwtmap);
        let tokenUserRole = getUserRoleFromToken(token, app.locals.jwtmap);

        if (!loggedIn(tokenUserId, app.locals.users, app.locals.jwtmap) && tokenUserRole === 'regular') {
            return res.status(400).json({ data: 'Not authorized - not logged in' });
        }

        if (!req.body.price || !typeof Number(req.body.price) === "number") {
            return res.status(400).json({ data: "Error: Bad or missin price parameter" });
        }

        if (req.body.approved && req.body.city) {
            // update app.locals.cities
        	let newCities = addCityIfNotExists(req.body.city, app.locals.cities);
            // update app.local.cache.get('CITIES')
            app.locals.cache.put('CITIES', app.locals.cities);
            // update DB.Lists
            updateCitiesInDb(app.locals.cities);
        }

        let previousApprovedStatus;
        if (tokenUserRole === 'admin' || tokenUserRole === 'supervisor' || tokenUserId === req.body.owner) {
            Ad.findById(adId, (err, adData) => {
                if (adData && adData.approved) {
                    previousApprovedStatus = adData.approved;
                } else {
                    previousApprovedStatus = false;
                }
            });

            Ad.findByIdAndUpdate(adId, {
                title: req.body.title,
                category: req.body.category,
                desc: req.body.desc,
                photoMain: req.body.photoMain,
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

                if (previousApprovedStatus !== mongoResponse.approved) {
                    if (mongoResponse.approved) {
                        app.locals.adsCount++;
                        app.locals.cache.put('ADS_COUNT', app.locals.adsCount);
                    } else {
                        app.locals.adsCount--;
                        app.locals.cache.put('ADS_COUNT', app.locals.adsCount);
                    }
                }

                res.status(200).json({
                    data: mongoResponse
                });
            });
        } else {
            return res.status(400).json({
                data: 'Not authorized to edit ad data'
            });
        }
    });

    app.delete('/api/ads/:adId', (req, res, next) => {
        if (!req.params || !req.params.adId) {
            return res.status(400).json({
                data: 'Bad request - missing ad id'
            });
        }

        let adId = req.params.adId;

        let token = getToken(req.headers['authorization']);

        if (!token) {
            return res.status(400).json({
                data: 'Not authorized'
            });
        }        

        let tokenUserId = getUserIdFromToken(token, app.locals.jwtmap);
        let tokenUserRole = getUserRoleFromToken(token, app.locals.jwtmap);
        let adOwner;

        if (tokenUserRole !== 'admin' && tokenUserRole !== 'supervisor') {
            Ad.findById(adId,
            'owner',
            (err, mongoResponse) => {
                if (err) {
                    return res.status(500).json({
                        data: 'Error: DB error'
                    });
                }

                adOwner = mongoResponse.owner.toString();
                if (!adOwner || adOwner != tokenUserId) {
                    return res.status(400).json({
                        data: 'Error - not authorized to delete ad'
                    });
                }
            });
        }

        Ad.findByIdAndRemove(adId, {}, (err, mongoResponse) => {
            if (err) {
                console.error('Error deleting ad!');
                return res.status(500).json({
                    data: `Error deleting ad: ${adId}`
                });
            }

            // update server cache
            if (app.locals.adsCount)
                app.locals.adsCount--;
            if (app.locals.cache && app.locals.cache.get('ADS_COUNT'))
                app.locals.cache.put('ADS_COUNT', app.locals.cache.get('ADS_COUNT') - 1);
            // console.info(`${chalkBold('[ MongoDB ]')} ADS_COUNT: ${app.locals.adsCount} (Decremented)`);

            res.status(200).json({ data: mongoResponse });
        });
    });
}