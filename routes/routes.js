'use strict';

var path = require('path');
var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer();

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, path.join(__dirname, '../uploads'));
	},
	filename: function (req, file, callback) {
		callback(null, file.originalname + '-' + Date.now());
	}
});

var upload = multer({ storage: storage }).single('file');

var fs = require('fs');


/* GET/ALL home page. */
router.all('/', function(req, res, next) {
	console.log(`Serving index.html from: ${path.resolve(__dirname, '../public/index.html')}`);
	res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

router.post('/upload', (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.status(500).json({
				data: 'Error saving uploaded file'
			})
		}

		// console.info(`fieldname: ${req.file.fieldname}`);
		// console.info(`originalname: ${req.file.originalname}`);
		// console.info(`encoding: ${req.file.encoding}`);
		// console.info(`mimetype: ${req.file.mimetype}`);
		// console.info(`size: ${req.file.size}`);
		// console.info(`destination: ${req.file.destination}`);
		// console.info(`filename: ${req.file.filename}`);
		// console.info(`path: ${req.file.path}`);

		res.status(200).json({
			data: { fileName: req.file.filename }
		});

		if (!fs.existsSync('public/uploads')) { 
			fs.mkdirSync('public/uploads');
		}

		fs.createReadStream('uploads/' + req.file.filename).pipe(fs.createWriteStream('public/uploads/' + req.file.filename));
	});


	// target_filename = req.file.originalname;

	// let src = fs.createReadStream(req.file.path);
	// let dest = fs.createWriteStream(req.file.filename);
	// src.pipe(dest);
	// src.on('end', () => {
	// 	res.status(200).json({
	// 		data: 'OK'
	// 	});
	// });
	// src.on('error', (err) => {
	// 	res.status(500).json({
	// 		data: `Error writing out file: ${err}`
	// 	});
	// });
});

module.exports = router;