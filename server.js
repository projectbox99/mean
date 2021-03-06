'use strict';

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var compression = require('compression');

var cache = require('memory-cache');

// niki
var fs = require('fs');
var http = require('http');
var spdy = require('spdy')
// var https = require('https');
var stats;
var helmet = require('helmet');

var chalk = require('chalk');
const chalkError = chalk.bold.underline.bgRed;
const chalkSuccess = chalk.bold.underline.bgGreen;
const chalkWarn = chalk.bold.bgBlue;
const chalkBold = chalk.bold;

var multer = require('multer');
var upload = multer();

var Promise = require('bluebird');

// Init Mongoose
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Pull environment settings from .env
require('dotenv').config();
const env = process.env;

// Init express + supply routes
var app = express();

// niki
app.use(helmet({ hsts: false }));
//app.use(helmet.hidePoweredBy());
app.use(helmet.hidePoweredBy({ setTo: 'Grumpy-and-Mean' }));
//app.disable('x-powered-by');
app.use(helmet.noSniff());

app.use(helmet.noCache());

//app.use(helmet.ieNoOpen()); // ???

//var ninetyDaysInMilliseconds = 7776000000; // ???
//app.use(helmet.hsts({ maxAge: ninetyDaysInMilliseconds })); // ???

//  contentSecurityPolicy, hpkp, and noCache.


app.use(compression());

app.use(favicon(path.resolve(__dirname, 'dev/favicon.ico')));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));

// Init server-side cache
let List = mongoose.model('List', require(path.resolve(__dirname, 'models/lists')));
let Ad = mongoose.model('Ad', require(path.resolve(__dirname, 'models/ad')));
let User = mongoose.model('User', require(path.resolve(__dirname, 'models/user')));
// console.log(`Ad: ${Ad}`);

(function() {
    List.findOne({}, function(err, lists) {
        if (err) {
            console.error(`Error retrieving Lists from DB: ${err}`);
            throw err;
        }

        app.locals.cache = cache;
        cache.put('USER_ROLES', lists.roles); app.locals.user_roles = cache.get('USER_ROLES');
        cache.put('CATEGORIES', lists.categories); app.locals.categories = cache.get('CATEGORIES');
        cache.put('CITIES', lists.cities); app.locals.cities = cache.get('CITIES');

        cache.put('JWTMAP', []); app.locals.jwtmap = cache.get('JWTMAP');
        cache.put('USERS', []); app.locals.users = cache.get('USERS');

        console.info(`${chalkBold('[ MongoDB ]')} LISTS: USER_ROLES: ${app.locals.user_roles}`);
        console.info(`${chalkBold('[ MongoDB ]')} LISTS: CATEGORIES: ${app.locals.categories}`);
        console.info(`${chalkBold('[ MongoDB ]')} LISTS: CITIES: ${app.locals.cities}`);
    });

    Ad.find({ approved: true }).count((err, count) => {
    	if (err) {
    		console.log(`Error retrieving ads cound from DB: ${err}`);
    		throw err;
    	}

    	cache.put('ADS_COUNT', Number(count)); app.locals.adsCount = cache.get('ADS_COUNT');
    	console.info(`${chalkBold('[ MongoDB ]')} ADS_COUNT: ${app.locals.adsCount}`);
    });

	User.find().count((err, count) => {
    	if (err) {
    		console.log(`Error retrieving users cound from DB: ${err}`);
    		throw err;
    	}

    	cache.put('USERS_COUNT', Number(count)); app.locals.usersCount = cache.get('USERS_COUNT');
    	console.info(`${chalkBold('[ MongoDB ]')} USERS_COUNT: ${app.locals.usersCount}`);
    });
}());

var routes = express.Router();
app.use('/', routes);
require('./routes/routes')(app);
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

// app.set('views', __dirname + '/public');

// Init logger
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public', { maxAge: 2592000000 })); // 30 days

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

// development error handler02
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
    console.error(`EXPRESS ERROR:`);
    console.error(`Error: ${JSON.stringify(err)}:`);

    res.status(err.status || 500);
    res.end(`${err.message}`);
    // res.render('error', {
    //     message: err.message,
    //     error: {}
    // });
});


var debug = require('debug')('web-tech:server');
//var http = require('http');

// niki
var server;
try {
    stats = fs.statSync('serverCert.pem');
    stats = fs.statSync('serverKey.pem');
    console.log(`${chalkBold('[ NodeJS  ]')} Certificate exists. Creating secure connection over SPDY protocol.`);
    server = spdy.createServer({
            key: fs.readFileSync('serverKey.pem'),
            cert: fs.readFileSync('serverCert.pem')
        },
        app);
}
catch (e) {
    console.log(`${chalkWarn('[ NodeJS ]')} Certificate missing. Falling back to HTTP connection.`);
    server = http.createServer(app);
}

var port = env.PORT || '3000';
app.set('port', port);

//var server = http.createServer(app);

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