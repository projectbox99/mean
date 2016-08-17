'use strict';

var path = require('path');
var express = require('express');
var router = express.Router();


/* GET/ALL home page. */
router.all('/', function(req, res, next) {
  // res.render('index', { title: 'Web-Tech' });
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;