'use strict';

var express = require('express');
var router = express.Router();

const Category = require('../models/category');
const City = require('../models/city');

/* GET home page. */
router.all('/', function(req, res, next) {
  // res.render('index', { title: 'Web-Tech' });
  res.render('index');
});

module.exports = router;