'use strict';

var User = require('../models/user');


/**
 *		User
 */
module.exports = function (router) {
    router.get('/api/users', (req, res, next) => {
        User.find((err, users) => {
            if (err) {
                console.error('Error retrieving user list!');
                return res.status(500).json({
                    msg: 'Error fetching user data!'
                });
            }

            res.status(200).json({
                data: users
            });
        });
    });

    router.get('/api/users/:userId', (req, res, next) => {
        var userId = req.params.userId;
        next();
    }, (req, res) => {
        User.findById(userId, (err, mongoResponse) => {
            if (err) {
                console.error(`Error finding user: ${userId}`);
                return res.status(500).json({
                    msg: 'Error finding user!'
                });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });

    router.post('/api/users', (req, res, next) => {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.namesFirst = req.body.namesFirst || "";
        user.namesLast = req.body.namesLast || "";
        user.email = req.body.email || "";
        user.phone1 = req.body.phone1 || "";
        user.phone2 = req.body.phone2 || "";
        user.skypeId = req.body.skypeId || "";
        user.photo = req.body.photo || "";
        user.role = req.body.role || "regular";
        user.dateCreated = new Date;

        user.save((err, mongoResponse) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ data: "Error!!!" });
            }

            console.info("Document saved!");
            res.status(200).json({ data: mongoResponse });
        });
    });

    router.put('/api/users/:userId', (req, res, next) => {
        var userId = req.params.userId;
        next();
    }, (req, res) => {
        User.findByIdAndUpdate(userId, {
            password: req.body.password,
            namesFirst: req.body.namesFirst,
            namesLast: req.body.namesLast,
            email: req.body.email,
            phone1: req.body.phone1,
            phone2: req.body.phone2,
            skypeId: req.body.skypeId,
            photo: req.body.photo
        }, {
            new: true,
            upsert: false,
            runValidators: true
        }, (err, mongoResponse) => {
            if (err) {
                console.error('Error updating user!');
                return res.status(500).json({
                    msg: `Error updating user data for ${userId}!`
                });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });

    router.delete('/api/users/:userId', (req, res, next) => {
        var userId = req.params.userId;
        next();
    }, (req, res) => {
        User.findByIdAndRemove(userId, {}, (err, mongoResponse) => {
            if (err) {
                console.error('Error deleting user!');
                return res.status(500).json({
                    msg: `Error deleting user: ${userId}`
                });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });
}