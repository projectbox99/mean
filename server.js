'use strict';

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var chalk = require('chalk');
const chalkError = chalk.bold.underline.bgRed;
const chalkSuccess = chalk.bold.underline.bgGreen;
const chalkWarn = chalk.bold.bgBlue;
const chalkBold = chalk.bold;

var Promise = require('bluebird');

// Init Mongoose
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Pull environment settings from .env
require('dotenv').config();
const env = process.env;

// Init express + supply routes
var app = express();
var routes = require(path.join(__dirname, 'routes/routes'));
app.use('/', routes);
require('./routes/routes.user')(app);
require('./routes/routes.ad')(app);
require('./routes/routes.lists')(app);

// Connecting to MongoDB instance...
var MONGODB_URI;
// if (app.get('env') === 'development') {
if (env.NODE_ENV === 'development') {
    MONGODB_URI = env.MONGO_HOST_DEV;
}
else {
    MONGODB_URI = env.MONGO_HOST_LIVE;
}

console.info(chalkBold('[ MongoDB ] ') + 'Using ' + chalkWarn(env.NODE_ENV) + ' server instance.');
console.info(chalkBold('[ MongoDB ] ') + `Connecting to ${MONGODB_URI}...`);

mongoose.connect(MONGODB_URI, {
    'settings': {
        'db': {
            w: 1,
            native_parser: false,
            fsync: true,
            journal: true,
            forceServerObjectId: true
        },
        'server': {
            auto_reconnect: true
        },
        promiseLibrary: require('bluebird')
    }
});

mongoose.connection.on('error', (error) => {
    console.info(chalkBold('[ MongoDB ] ') + 'Connection ' + chalkError('Failed!') + error);
});

mongoose.connection.on('connected', () => {
    console.info(chalkBold('[ MongoDB ] ') + 'Connection ' + chalkSuccess('Established!'));
});

mongoose.connection.on('disconnected', () => {
    console.info(chalkBold('[ MongoDB ] ') + 'Connection to MongoDB ' + chalkWarn('disconnected!'));
});

// Init server-side cache
let List = mongoose.model('List', require(path.resolve(__dirname, 'models/lists')));
var USER_ROLES = [], CATEGORIES = [], CITIES = [];

(function() {
    List.findOne({}, function(err, lists) {
        if (err) {
            console.error(`Error retrieving Lists from DB: ${err}`);
            throw err;
        }

        USER_ROLES = lists.roles, CATEGORIES = lists.categories, CITIES = lists.cities;
        console.info(`${chalkBold('[ MongoDB ]')} LISTS: USER_ROLES: ${USER_ROLES}`);
        console.info(`${chalkBold('[ MongoDB ]')} LISTS: CATEGORIES: ${CATEGORIES}`);
        console.info(`${chalkBold('[ MongoDB ]')} LISTS: CITIES: ${CITIES}`);
    });
}());

// app.set('views', __dirname + '/public');

// Init logger
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
    console.log('ggggggg');
    next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log('!!!!!!!!!!!!!!!!!!!');
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


var debug = require('debug')('web-tech:server');
var http = require('http');

var port = env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
// console.info(`HTTP Server listening on: ${JSON.stringify(server)}`);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.info(chalkBold('[ NodeJS  ] ') + 'Listening on localhost, ' + chalkSuccess(bind));
}

process.on('SIGINT', function() {  
  mongoose.connection.close(() => { 
    console.log(chalkBold('[ MongoDB ] ') + 'Mongoose connection closed ' + chalkSuccess('gracefully') + '.'); 
    process.exit(0); 
  }); 
});


module.exports = app;