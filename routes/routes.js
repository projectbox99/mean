'use strict';

var express = require('express');
var router = express.Router();

const User = require('../models/user');
const Ad = require('../models/ad');
const Category = require('../models/category');
const City = require('../models/city');

/* GET home page. */
router.all('/', function(req, res, next) {
  // res.render('index', { title: 'Web-Tech' });
  res.render('index');
});


/**
 *		User
 */

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

router.get('/api/user/:userId', (req, res, next) => {
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

router.post('/api/user', (req, res, next) => {
	var user = new User({
		username: req.body.username,
		password: req.body.password,
		namesFirst: req.body.namesFirst,
		namesLast: req.body.namesLast,
		email: req.body.email,
		phone1: req.body.phone1,
		phone2: req.body.phone2,
		skypeId: req.body.skypeId,
		photo: req.body.photo,
		role: req.body.role,
		dateCreated: new Date
	});

	user.save((err, mongoResponse) => {
		if (err) {
			console.error('Error creating user!');
			return res.status(500).json({
				msg: 'Error saving user data!'
			});
		}

		res.status(200).json({
			data: mongoResponse
		});
	});
});

router.put('/api/user/:userId', (req, res, next) => {
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

router.delete('/api/user/:userId', (req, res, next) => {
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


/**
 *		Ads
 */

module.exports = router;