'use strict';

var express = require('express');
var router = express.Router();


/* GET/ALL home page. */
router.all('/', function(req, res, next) {
  // res.render('index', { title: 'Web-Tech' });
  res.render('index');
});

module.exports = router;