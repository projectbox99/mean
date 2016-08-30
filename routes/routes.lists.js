'use strict';

var Lists = require('../models/lists');

var getToken = require('./helpers/tokens').getToken;
var getUserIdFromToken = require('./helpers/tokens').getUserIdFromToken;
var getUserRoleFromToken = require('./helpers/tokens').getUserRoleFromToken;

var categoryInCache = require('./helpers/lists').categoryInCache;
var removeCategoryFromCache = require('./helpers/lists').removeCategoryFromCache;

var loggedIn = require('./helpers/users').loggedIn;


/**
 *		Lists
 */

module.exports = app => {
    app.get('/api/lists', (req, res, next) => {
        Lists.findOne((err, lists) => {
            if (err) {
                console.error('Error retrieving lists!');
                return res.status(500).json({ data: 'Error fetching lists data!' });
            }

            // let categoriesCount = lists.categories.count;

            res.status(200).json({
                data: { categories: lists.categories, cities: lists.cities, roles: lists.roles }
            });
        });
    });

    app.post('/api/lists', (req, res, next) => {
        if (!req.body || !req.body.category) {
            return res.status(500).json({ data: "Error: missing body"});
        }

        let token = getToken(req.headers['authorization']);

        if (!token) {
            return res.status(400).json({ data: 'Not authorized' });
        }

        let tokenUserId = getUserIdFromToken(token, app.locals.jwtmap);
        let tokenUserRole = getUserRoleFromToken(token, app.locals.jwtmap);

        if (!loggedIn(tokenUserId, app.locals.users, app.locals.jwtmap)) {
            return res.status(400).json({ data: 'Not authorized - not logged in' });
        }

        if (!req.body.category) {
            console.error('Error: no category to add in POST-> /api/lists!');
            return res.status(400).json({ data: 'Error: Bad Request - missing category!' });
        }

        let newCategory = req.body.category;

        if (categoryInCache(newCategory, app.locals.categories)) {
            console.error(`Category ${newCategory} already exists in the server cache. Exiting.`);
            return res.status(400).json({ data: 'Error: Bad Request - category already exists!' });
        }

        if (tokenUserRole === 'admin') {
            app.locals.categories.push(newCategory);
            app.locals.cache.put('CATEGORIES', app.locals.categories);

            Lists.findOneAndUpdate({}, { categories: app.locals.categories }, { new: true }, (err, lists) => {
                if (err) {
                    console.error('Error updating lists!');
                    return res.status(500).json({ data: 'Error updating lists!' });
                }

                return res.status(200).json({ data: lists });
            });
        }
    });

    app.put('/api/lists', (req, res, next) => {
        if (!req.body || !req.body.category || !req.body.modified) {
            return res.status(500).json({ data: "Error: missing body"});
        }

        let token = getToken(req.headers['authorization']);

        if (!token) {
            return res.status(400).json({ data: 'Not authorized' });
        }

        let tokenUserId = getUserIdFromToken(token, app.locals.jwtmap);
        let tokenUserRole = getUserRoleFromToken(token, app.locals.jwtmap);

        if (!loggedIn(tokenUserId, app.locals.users, app.locals.jwtmap)) {
            return res.status(400).json({ data: 'Not authorized - not logged in' });
        }

        if (!req.body.category || !req.body.modified) {
            console.error('Error: Missing parameters in PUT-> /api/lists!');
            return res.status(400).json({ data: 'Error: Bad Request - missing parameters!' });
        }

        let category = req.body.category;
        let modified = req.body.modified;

        if (!categoryInCache(category, app.locals.categories)) {
            console.error(`Category ${category} does not exist in the server cache. Exiting.`);
            return res.status(400).json({ data: 'Error: Bad Request - category does not exist!' });
        }

        if (categoryInCache(modified, app.locals.categories)) {
            console.error(`Category ${modified} already exists in the server cache. Exiting.`);
            return res.status(400).json({ data: 'Error: Bad Request - category already exists!' });
        }

        if (tokenUserRole === 'admin') {
            app.locals.categories = removeCategoryFromCache(category, app.locals.categories);
            app.locals.categories.push(modified);
            app.locals.cache.put('CATEGORIES', app.locals.categories);

            Lists.findOneAndUpdate({}, { categories: app.locals.categories }, { new: true }, (err, lists) => {
                if (err) {
                    console.error('Error updating lists!');
                    return res.status(500).json({ data: 'Error updating lists!' });
                }

                return res.status(200).json({ data: lists });
            });
        }
    });

    app.delete('/api/lists/:category', (req, res, next) => {
        if (!req.params || !req.params.category) {
            return res.status(400).json({ data: 'Bad request - missing category parameter!' });
        }

        let categoryToDelete = req.params.category;
        if (!categoryInCache(categoryToDelete, app.locals.categories)) {
            console.error(`Category ${categoryToDelete} does not exist in the server's cache!`);
            return res.status(400).json({ data: 'Error: Bad Request - category does not exist!' });
        }

        let token = getToken(req.headers['authorization']);

        if (!token) {
            console.error(`Missing token. Nothing done.`);
            return res.status(400).json({
                data: 'Not authorized'
            });
        }        

        for (let k in app.locals.jwtmap)
            console.log(`- ${k}`);

        let tokenUserId = getUserIdFromToken(token, app.locals.jwtmap);
        let tokenUserRole = getUserRoleFromToken(token, app.locals.jwtmap);

        if (tokenUserRole == 'admin') {
            console.info(`API: deleting category: ${categoryToDelete}`);
            app.locals.categories = removeCategoryFromCache(categoryToDelete, app.locals.categories);
            app.locals.cache.put('CATEGORIES', app.locals.categories);

            console.info(`API: updating Mongo with: ${app.locals.categories}`);
            Lists.findOneAndUpdate({}, { categories: app.locals.categories }, { new: true }, (err, lists) => {
                if (err) {
                    console.error('Error updating lists!');
                    return res.status(500).json({ data: 'Error updating lists!' });
                }

                console.info(`API: returning: ${JSON.stringify(lists)}`);
                return res.status(200).json({ data: lists });
            });
        }
    });
}