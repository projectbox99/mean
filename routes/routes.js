'use strict';

var path = require('path');
var express = require('express');
var router = express.Router();


/* GET/ALL home page. */
router.all('/', function(req, res, next) {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

module.exports = router;