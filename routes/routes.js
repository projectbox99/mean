'use strict';

var path = require('path');

var multer = require('multer');
var upload = multer();

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, path.join(__dirname, '../uploads'));
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + '-' + file.originalname);
	}
});

var upload = multer({ storage: storage }).single('file');

var fs = require('fs');

module.exports = app => {
	/* GET/ALL home page. */
	app.all('/', function (req, res, next) {
		console.log(`Serving index.html from: ${path.resolve(__dirname, '../public/index.html')}`);
		res.sendFile(path.resolve(__dirname, '../public/index.html'));
	});

	app.post('/upload', (req, res) => {
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
				data: {fileName: req.file.filename}
			});

			if (!fs.existsSync('public/uploads')) {
				fs.mkdirSync('public/uploads');
			}

			fs.createReadStream('uploads/' + req.file.filename).pipe(fs.createWriteStream('public/uploads/' + req.file.filename));
		});

	});

	app.get('/api/about', (req, res, next) => {
		const os = require('os');

		let cpuInfo = os.cpus();
		let cpuCount = cpuInfo.length;
		let cpuModel = cpuInfo[0].model;
		let cpuSpeed = cpuInfo[0].speed;
		let cpuUserAvg = 0;
		let cpuNiceAvg = 0;
		let cpuSysAvg = 0;
		let cpuIdleAvg = 0;
		let osLoadAvg = os.loadavg();

		for (let cnt = 0; cnt < cpuCount; cnt++)
		{
			cpuUserAvg += cpuInfo[cnt].times.user;
			cpuNiceAvg += cpuInfo[cnt].times.nice;
			cpuSysAvg += cpuInfo[cnt].times.sys;
			cpuIdleAvg += cpuInfo[cnt].times.idele;
		}
		cpuUserAvg = cpuUserAvg / cpuCount;
		cpuNiceAvg = cpuNiceAvg / cpuCount;
		cpuSysAvg = cpuSysAvg / cpuCount;
		cpuIdleAvg = cpuIdleAvg / cpuCount;

        let osHostname = os.hostname();
        let osPlatform = os.platform();
        let osArch = os.arch();
        let osRelease = os.release();
        let osType = os.type();
        let osUptime = os.uptime() / 60; // minutes
        let osTotalmem = os.totalmem() / 1048576; //  MB
        let osFreemem = os.freemem() / 1048576; //  MB

        let osLoadavg1m =  osLoadAvg[0]; // min
        let osLoadavg5m =  osLoadAvg[1]; // min
        let osLoadavg15m =  osLoadAvg[2]; // min
        let osHomedir = os.homedir();

        let processUptime = process.uptime(); // seconds

        let remoteIp = req.connection.remoteAddress;

        let folderSize;
        let stat;
        try {
    			stats = fs.statSync('public/uploads');
    			folderSize = stats.size;
        	}
		catch (e) {
    		folderSize = 0;
		}

		let serverInfo = {
            cpuModel: `${cpuModel}`,
            cpuCount: `${cpuCount}`,
			cpuSpeed: `${cpuSpeed} MHz`,
            cpuUserAvg: `${cpuUserAvg}`,
            cpuNiceAvg: `${cpuNiceAvg}`,
            cpuSysAvg: `${cpuNiceAvg}`,
            cpuIdleAvg: `${cpuIdleAvg}`,
            osHostname: `${osHostname}`,
            osPlatform: `${osPlatform}`,
            osArch: `${osArch}`,
            osRelease: `${osRelease}`,
            osType: `${osType}`,
            osUptime: `${osUptime} minutes`,
            osTotalmem: `${osTotalmem} MB`,
            osFreemem: `${osFreemem} MB`,
            osLoadavg1m: `${osLoadavg1m} minutes`,
            osLoadavg5m: `${osLoadavg5m} minutes`,
            osLoadavg15m: `${osLoadavg15m} minutes`,
            osHomedir: `${osHomedir}`,
            processUptime: `${processUptime}`,
            processVersion: `${process.version}`,
            processVersionsHttp_parser: `${process.versions.http_parser}`,
            processVersionsNode: `${process.versions.node}`,
            processVersionsV8: `${process.versions.v8}`,
            processVersionsUv: `${process.versions.uv}`,
            processVersionsZlib: `${process.versions.zlib}`,
            processVersionsAres: `${process.versions.ares}`,
            processVersionsModules: `${process.versions.modules}`,
            processVersionsIcu: `${process.versions.icu}`,
            processVersionsOpenssl: `${process.versions.openssl}`,
            remoteIp: `${remoteIp}`,
            folderSize: `${folderSize}`
		};

		return res.status(200).json({
			data: serverInfo
		});
	});	
}