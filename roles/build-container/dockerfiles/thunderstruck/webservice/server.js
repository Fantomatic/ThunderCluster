// ask for fs to read file
var fs = require('fs');
// ask for https to create secure connection https
var https = require('https');
// ask for express to create server instance
// ask for "./routes/apirest" to create api rest
var express = require('express'),
	apirest = require('./routes/apirest'),
	configFile = require('./routes/configFile');
// ask for body-parser to interpret json file
var bodyParser = require('body-parser');
var path = require('path');
// define certificate for https with file server.key and server.crt
var options = {
	key	: fs.readFileSync('server.key'),
	cert	: fs.readFileSync('server.crt')
};

// create a instance of express as app
var app = express();

// describe method and http protocole allowed 
var enableCORS = function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	//intercept OPTIONS method
 	if ('OPTIONS' == req.method) {
		res.send(200);
	}
	else {
	next();
	}
};
// enable CORS!
app.use(enableCORS);
// enable bodyParser for json
app.use(bodyParser.json());

// allow user to search for html file in public directory
app.use(express.static('public'));
// use the function isalive described in ./routes/apirest.js
// when the URI /is_alive is called with a GET request
// return json file is_alive.json when url is "https://svr:3000/is_alive"
// use the function find described in ./routes/apirest.js
// when the url finishing with /is_aliveDB is called with a GET request
// return an array describing the content of collection isalive in the database
app.get('/is_alive', apirest.isalive);
app.get('/is_aliveDB', apirest.find);
// use the function findAll described in ./routes/configFile.js
// when the URI /fileConf is called with a GET request
// return an array, the content of the collection configFile in the database 
app.get('/fileConf', configFile.findAll);
// use the function findVersion described in ./routes/configFile.js
// when the URI /fileConf/version is called with a GET request
// return an array which contains the different version existing
// ex : [{version: DEV}, {version:VAL}, {version:PROD}]
app.get('/fileConf/version', configFile.findVersion)
// use the function findModuleByVersion described in ./routes/configFile.js
// when the URI /fileConf/:version/module is called with a GET request
// return an array which contains the module corresponding to a version
// ex : [{module:anomaly}, {module:trend}]
// 	in response to /fileConf/DEV/module
app.get('/fileConf/:version/module', configFile.findModuleByVersion);
// use the function findFilesByModule described in ./routes/configFile.js
// when the URI /fileConf/:version/module/files is called with a GET request
// return an array, the content of the collection configFile in the database
app.get('/fileConf/:version/:module/files', configFile.findFilesByModule);
// use the function findParamByFile described in ./routes/configFile.js
// when the URI /fileConf/:version/:module/:file/params is called with a GET request
// return an array, the content of the collection configFile in the database
app.get('/fileConf/:version/:module/:file/params', configFile.findParamByFile);
app.get('/fileConf/:version/:module/:file/fileParam', configFile.findFileParam);
app.post('/fileConf/:version/module', configFile.addModule);

app.post('/fileConf/:version/:module/file', configFile.addFile);

app.post('/fileConf/:version/:module/:file/param', configFile.addParam);

app.delete('/fileConf/:version/:module', configFile.deleteModule);

app.delete('/fileConf/:version/:module/:file', configFile.deleteFile);

app.delete('/fileConf/:version/:module/:file/:param', configFile.deleteParam);

// create server with ssl self created certificate 
// in order to have https url used only
// use the port 3000
https.createServer(options, app).listen(3000, function(){
	console.log('Started!');
        console.log("expose port 3000");
});
