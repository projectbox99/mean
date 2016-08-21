'use strict';

var encryptPswdClean = require('./helpers/password').encryptPswdClean;
var generateRandomTokenClean = require('./helpers/token').generateRandomTokenClean;

var User = require('../models/user');

var tokens = [];

/**
 *		User
 */

module.exports = (router) => {
    router.post('/api/login', (req, res, next) => {
        if (!req.body || !req.body.username || !req.body.password) {
            console.log('No body!');
            return res.status(500).json({
                data: 'Error: req.body not found... again!'
            });
        }

        let usr = req.body.username;
        let pswd = encryptPswdClean(req.body.password);

        User.findOne({ username: usr, password: pswd }, 
        	'username namesFirst namesLast email phone1 phone2 skypeId photo role dateCreated',
        	(err, userData) => {
            	if (err) {
                    console.log(`Error talking to Mongo: ${err}`);
                	return res.status(500).json({
                    	data: 'Error fetching user data!'
                	});
            	}

                if (!userData || !userData.username) {
                    console.log(`Mongo answered: ${JSON.stringify(userData)}... returning 401`);
                    return res.status(401).json({ data: 'Error: wrong username or password' });
                }

                let usrToken;
                do {
    				usrToken = generateRandomTokenClean();
                } while (tokens.indexOf(usrToken) > -1);
                console.log(`Generated a token of ${usrToken}`);
                tokens.push(usrToken);

                return res.status(200).json({
                    data: { user: userData, token: usrToken }
                });
            });
        }
    );

    router.get('/api/users', (req, res, next) => {
        User.find((err, users) => {
            if (err) {
                console.error('Error retrieving user list!');
                return res.status(500).json({
                    data: 'Error fetching user data!'
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