'use strict';

var encryptPswdClean = require('./helpers/password').encryptPswdClean;

// var encrypted = encryptPswdClean('wendy123');
// console.log(encrypted);

var generateRandomTokenClean = require('./helpers/token');

var User = require('../models/user');


/**
 *		User
 */

module.exports = function (router) {
    router.get('/api/login', (req, res, next) => {
        if (req.body && req.body.username) {
            let usr = req.body.username;
            let pswd = encryptPswdClean(req.body.password);

            User.findOne({ username: usr, password: pswd }, 'username', (err, user) => {
                if (err) {
                    return res.status(500).json({
                        msg: 'Error fetching user data!'
                    });
                }

                if (!user.username) {
                    return res.status(400).json({ data: 'Error: wrong username or password' });
                }

                let usrToken = generateRandomTokenClean();

                res.status(200).json({
                    data: { username: usr, token: usrToken }
                });
            });
        }
    }

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
        if (!(req.body && req.body.username)) {
            return res.status(500).json({ data: "Error: missing body"});
        } else {
            User.findOne({ username: req.body.username }, 'username', (err, user) => {
                if (err) {
                    console.log('Error' + err);
                    return res.status(500).json({ data: "Error looking up username" });
                }

                if (user) {
                    console.log('User!:' + JSON.stringify(user));
                    if (user.username) {
                        return res.status(400).json({ data: "User already exists" });
                    }
                } else {
                    next();
                }
            });
        }
    }, (req, res) => {
        let user = new User();

        user.username = req.body.username;
        user.password = encryptPswdClean(req.body.password);
        user.namesFirst = req.body.namesFirst || "";
        user.namesLast = req.body.namesLast || "";
        user.email = req.body.email || "";
        user.phone1 = req.body.phone1 || "";
        user.phone2 = req.body.phone2 || "";
        user.skypeId = req.body.skypeId || "";
        user.photo = req.body.photo || "";
        user.role = req.body.role || "regular";
        user.dateCreated = new Date;

        user.save().then((mongoResponse) => {
            console.info("Document saved!");
            return res.status(200).json({ data: mongoResponse });
        }, (err) => {
            console.error(`Error saving user data: ${err}`);
            return res.status(500).json({ data: "Error saving user data" });
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