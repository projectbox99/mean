'use strict';

var encryptPswdClean = require('./helpers/password').encryptPswdClean;
var generateRandomTokenClean = require('./helpers/token').generateRandomTokenClean;

var User = require('../models/user');

var tokens = [];

/**
 *		User
 */
module.exports = app => {
    app.post('/api/login', (req, res, next) => {
        if (!req.body || !req.body.username || !req.body.password) {
            console.log('No body!');
            return res.status(500).json({
                data: 'Error: req.body not found...'
            });
        }

        let usr = req.body.username;
        let pswd = encryptPswdClean(req.body.password);

        User.findOne({ username: usr, password: pswd }, 
        	'_id username namesFirst namesLast email phone1 phone2 skypeId photo role dateCreated',
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
                } while (app.locals.jwtmap[usrToken]);

                // tokens.push({ token: usrToken, user: userData.username, role: userData.role });
                app.locals.jwtmap[usrToken] = { user: userData._id, role: userData.role };
                app.locals.cache.put('JWTMAP', app.locals.jwtmap);
                console.log(app.locals.cache.get('JWTMAP'));

                app.locals.users[userData._id] = { token: usrToken, username: userData.username };
                app.locals.cache.put('USERS', app.locals.users);
                console.log(app.locals.cache.get('USERS'));


                return res.status(200).json({
                    data: { user: userData, token: usrToken }
                });
            });
        }
    );

    app.get('/api/users', (req, res, next) => {
        User.find((err, users) => {
            if (err) {
                console.error('Error retrieving user list!');
                return res.status(500).json({
                    data: 'Error fetching user list!'
                });
            }

            res.status(200).json({
                data: users
            });
        });
    });

    app.get('/api/users/:userId', (req, res, next) => {
        if (!req.params || !req.params.userId) {
            console.error("No id paramater found in the request!");
            return res.status(400).json({
                data: 'Bad paramater!'
            });
        }

        let userId = req.params.userId;
        User.findById(userId,
            '_id username namesFirst namesLast email phone1 phone2 skypeId photo role dateCreated',
            (err, mongoResponse) => {
            if (err) {
                console.error('Error querying user in MongoDB!');
                return res.status(500).json({
                    data: 'Error querying user in database!'
                });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });

    app.post('/api/users', (req, res, next) => {
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
        user.role = "regular";
        user.dateCreated = new Date;

        user.save().then((mongoResponse) => {
            return res.status(200).json({ data: mongoResponse });
        }, (err) => {
            console.error(`Error saving user data: ${err}`);
            return res.status(500).json({ data: "Error saving user data" });
        });
    });

    app.put('/api/users/:userId', (req, res, next) => {
        if (!req.params || !req.params.userId) {
            console.error("Missing id paramater found in the request!");
            return res.status(400).json({
                data: 'Bad paramater!'
            });
        }

        // check requester's bearer token:
        let currentToken;
        if (req.headers.authorization) {
            // console.log(`Auth header: ${req.headers.authorization}`);
            currentToken = req.headers.authorization.slice(7);
        }

        if (!currentToken) {
            console.log(`Bad token!`);
            return res.status(401).json({
                data: 'Error: Missing authorization credentials'
            });
        }

        let currentRole, currentUser;
        for (let i = 0; i < tokens.length; i++) {
            // console.log("[i]: " + tokens[i].token + " : " + tokens[i].user + " : " + tokens[i].role);
            if (currentToken === tokens[i].token) {
                currentUser = tokens[i].user;
                currentRole = tokens[i].role;
                break;
            }
        }

        if ((currentRole !== 'admin') && (currentUser !== req.body.username)) {
            return res.status(401).json({
                data: 'Error: Unauthorized to modify this user\'s data'
            });
        }

        let userId = req.params.userId;
        User.findByIdAndUpdate(userId,
        {
            password: encryptPswdClean(req.body.password),
            namesFirst: req.body.namesFirst,
            namesLast: req.body.namesLast,
            email: req.body.email,
            phone1: req.body.phone1,
            phone2: req.body.phone2,
            skypeId: req.body.skypeId,
            photo: req.body.photo,
            role: req.body.role || 'regular'
        }, {
            new: true,
            upsert: false,
            runValidators: true
            // select: {'_id', 'username', 'namesFirst', 'namesLast', 'email', 'phone1', 'phone2', 'skypeId', 'photo', 'role', 'dateCreated'}
        }, (err, mongoResponse) => {
            if (err) {
                console.error('Error updating user!');
                return res.status(500).json({
                    data: `Error updating user data for ${userId}!`
                });
            }

            res.status(200).json({
                data: mongoResponse
            });
        });
    });

    app.delete('/api/users/:userId', (req, res) => {
        if (!req.params || !req.params.userId) {
            console.error("No id paramater found in the request!");
            return res.status(400).json({
                data: 'Bad paramater!'
            });
        }

        var userId = req.params.userId;
        User.findByIdAndRemove(userId, {}, (err, mongoResponse) => {
            if (err) {
                console.error('Error deleting user!');
                return res.status(500).json({
                    msg: `Error deleting user: ${userId}`
                });
            }

            res.status(200).json({
                data: 'OK'
            });
        });
    });
}