var mongo = require('mongodb'); // indicate dependency with native driver mongodb

var yaml = require('js-yaml');

//variable used as alias
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    ObjectID = mongo.ObjectID;

//create connection to DB server in localhost and on port 27017
//do not forget to activate mongodb in another window or have the service started
//auto reconnect make the deconnection automatically 
//w=1 indicate the writing mode

var server = new Server('localhost', 27017, {auto_reconnect:true}, {w:1});

//identification of the db used here "configFileDB"
db = new Db('configFileDB', server);

//function called after creation of the instance of the DB
//it consist of: trying to access the collection 'configFile',
//if there is an error, it means that the collection doesn't exist
//we must create it (with strict: true) and fill it with the function populateDB
//which will insert the different version
//As the collection is kept each time, if it exist, it will not be recreated
db.open(function(err, db) {
	if(!err){
		console.log("Connected to 'configFile' database");
		db.collection('configFile', {strict:true}, function(err, collection) {
			if (err){
				console.log("The 'configFile' collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});

//function to format data send to user 
//by taking in account the state of the request (ok or error)
//as state :
//0 ok
//1 DB not available
//2 the requested DB/version/config/file/parameter doesnt exist
//3 syntax not correct
//4 unknown
responseFormat  = function(state, reason, data){
	response = {};
	response['state'] = state;
	response['reason'] = reason;
	response['data'] = data;
	return response;
}




//embody the implementation of URI GET /fileConf
//return the content of the collection in its enterity
//as an array of object JSON
exports.findAll = function(req, res){
	db.collection('configFile', function(err, collection) {
		collection.find().toArray(function(err, items){
			if (err) {
				if (err["name"]=="MongoError"){
					response = responseFormat(1,"Database unavailable", err);
				} else {
					response = responseFormat(6,"Unknown error",err);
				}
			} else  {
				response = responseFormat(0,"OK",items);
			}
			res.send(response);
		});
	});
};

//embody the implementation of URI GET /fileConf/version
//return the version present in the db 
//Should be DEV, VAL, PROD
//as an array of object JSON
exports.findVersion = function(req, res){
	db.collection('configFile', function(err, collection){
		collection.find({'module':{$exists:false}}, {_id:0, version:1}).toArray(function(err, items){
			if (err) {
				if (err["name"]=="MongoError"){
                                        response = responseFormat(1,"Database unavailable", err);
                                } else {
                                        response = responseFormat(6,"Unknown error",err);
                                }
			} else {
				res.send(responseFormat(0, "Ok", items));
			}
		});
	});
};


//GET /fileConf/:version/module : in the variable version the function
//get the parameter and on the collection 'configFile' do a find
exports.findModuleByVersion = function(req, res){
	var version = req.params.version;
	console.log('Retrieving version: ' + version);
	var test = {};
	db.collection('configFile', function(err, collection){
		collection.find({'version':version}, {_id:0, version:1}).toArray(function(err, items){
			test = items;
		});
		collection.find({'version':version, 'module':{$exists:true}, 'file':{$exists:false}}, {_id:0, version:1, module:1}).toArray(function(err, items) {
			if(err) {
				if (err["name"]=="MongoError"){
                                        response = responseFormat(1,"Database unavailable", err);
                                } else {
                                        response = responseFormat(6,"Unknown error",err);
                                }
			} else if (items.length == 0){
				if (test.length == 0){
					response = responseFormat(2,"version " + version + " doesn't exist",test);
				}else{
					response = responseFormat(3,"version " + version + " doesn't have any module",test);
				}
			} else {
				response = responseFormat(0,"OK",items);
			}
			res.send(response);
		});
	});
};

//embody the implementation of the search of the files
//by the URI GET fileConf/:version/:module/files which are 
//associated with the version and module input in the URI by using a find
exports.findFilesByModule = function(req, res){
	var version = req.params.version;
	var module = req.params.module;
	var test = {};
	console.log('Retrieving version: ' + version);
	console.log('Retrieving module: ' + module);
	db.collection('configFile', function(err, collection){
		collection.find({'version':version, 'module': module}, {_id:0, version:1, module:1}).toArray(function(err, items){
                        test = items;
                });
		collection.find({'version':version,'module': module, 'file':{$exists:true}, 'paramName':{$exists:false}}, {_id:0, version:1, module:1, file:1}).toArray(function(err, items){
			if(err) {
                                if (err["name"]=="MongoError"){
                                        response = responseFormat(1,"Database unavailable", err);
                                } else {
                                        response = responseFormat(6,"Unknown error",err);
                                }
                        } else if (items.length == 0){
                                if (test.length == 0){
                                        response = responseFormat(2,"module " + module + " doesn't exist",test);
                                }else{
                                        response = responseFormat(3,"module " + module + " doesn't have any files",test);
                                }
                        } else {
                                response = responseFormat(0,"OK",items);
                        }
                        res.send(response);
		});
	});
};

//embody the implementation of the search of the parameters
//by the URI GET /fileConf/:version/:module/:file/params which are
//associated with the version, the module and the file input in the URI by using a find
exports.findParamByFile = function(req, res){
	var version = req.params.version;
        var module = req.params.module;
	var file = req.params.file;
	var test = {};
	console.log('Retrieving version: ' + version);
        console.log('Retrieving module: ' + module);
	console.log('Retrieving file: ' + file);
	db.collection('configFile', function(err, collection){
		collection.find({'version':version, 'module': module}, {_id:0, version:1, module:1}).toArray(function(err, items){
                        test = items;
                });
		collection.find({'version':version,'module':module,'file':file, 'paramName':{$exists:true}}, {_id:0, version:1, module:1, file:1, paramName:1, paramValue:1}).toArray(function(err, items){
                        if(err) {
                                if (err["name"]=="MongoError"){
                                        response = responseFormat(1,"Database unavailable", err);
                                } else {
                                        response = responseFormat(6,"Unknown error",err);
                                }
                        } else if (items.length == 0){
                                if (test.length == 0){
                                        response = responseFormat(2,"The file " + file + " doesn't exist in the database",test);
                                }else{
                                        response = responseFormat(3,"The file " + file + " doesn't have any parameters",test);
                                }
                        } else {
                                response = responseFormat(0,"OK",items);
                        }
                        res.send(response);
                });
        });
};


exports.findFileParam = function(req, res){
	var version = req.params.version;
        var module = req.params.module;
        var file = req.params.file;
        var test = {};
        console.log('Retrieving version: ' + version);
        console.log('Retrieving module: ' + module);
        console.log('Retrieving file: ' + file);
	db.collection('configFile', function(err, collection){
                collection.find({'version':version, 'module': module}, {_id:0, version:1, module:1}).toArray(function(err, items){
                        test = items;
                });
                collection.find({'version':version,'module':module,'file':file, 'paramName':{$exists:true}}, {_id:0, version:1, module:1, file:1, paramName:1, paramValue:1}).toArray(function(err, items){
                        if(err) {
                                if (err["name"]=="MongoError"){
                                        response = responseFormat(1,"Database unavailable", err);
                                } else {
                                        response = responseFormat(6,"Unknown error",err);
                                }
                        }else if (items.length == 0){
                                if (test.length == 0){
                                        response = responseFormat(2,"file " + file + " doesn't exist in the database",test);
                                }else{
                                        response = responseFormat(3,"file " + file + " doesn't have any parameters",test);
                                }
                        } else {
				var itemFormated = {};
                                for(i in items){
					var item = items[i];
                                	var paramName = item['paramName'];
                                	itemFormated[paramName] = item['paramValue'];
				}
                                yamlItems = yaml.safeDump(itemFormated, {'styles': { '!!bool': 'camelcase'}});
                                response = yamlItems;
				//response = responseFormat(0,"OK",yamlItems);
                        }
                        res.send(response);
                });
        });
};

//embody the implementation which allow adding a new module
//by the URI POST /fileConf/:version/module associated with 
//the version input in the URI
exports.addModule = function(req, res){
	var module = req.body;
	var version = req.params.version;
	var input = {};
	var alreadyExist = false;
	var regExp = new RegExp("\^\[a-zA-Z\]\+\(_\?\[a-zA-Z0-9\]\+\){0,5}\$");
	input['version'] = version;
	for(var key in module) key=="module" ?  input[key] = module[key] : console.log("not module");
	console.log(input);
	if(!input["module"]){
		res.send(responseFormat(4,"Syntax error", module));
	} else if (!regExp.test(input["module"])) {
		res.send(responseFormat(4,"Syntax error", {'explanation':'The module should have a name beginning with a letter and using only letters then numbers' , 'input':input['module']}));
	} else {
		console.log('Adding module:' + JSON.stringify(module));
		db.collection('configFile', function(err, collection){
			collection.find({'version':version, 'module':input['module'], 'file':{$exists:false}}, {_id:0, version:1, module:1}).toArray(function(err, items){
				if(err){
					if (err["name"]=="MongoError"){
                                        	response = responseFormat(1,"Database unavailable", err);
                                	} else {
                                        	response = responseFormat(6,"Unknown error",err);
                                	}
				}
				if(!items.length == 0) {
					res.send(responseFormat(5,"Duplicate : The module already exist", items));
				} else {
                                        res.send(responseFormat(0,"Ok",{}));
                                }
			});
			collection.update({'version':version, 'module':input['module'], 'file':{$exists:false}},{"$setOnInsert":input}, {upsert:true});
			/*collection.insert(input, {safe:true}, function(err, result){
				if(err){
					res.send({'error':'An error has occured'});
				} else {
					console.log('Success: ' + JSON.stringify(result[0]));
					res.send(result[0]);
				}
			});*/
		});
	}
};

//embody the implementation which allow adding a new file
//by the URI POST /fileConf/:version/:module/file associated with
//the version and the module input in the URI
exports.addFile = function(req, res){
	var file = req.body;
        var module = req.params.module;
        var version = req.params.version;
        var regExp = new RegExp("\^\[a-zA-Z\]\+\(_\?\[a-zA-Z0-9\]\+\){0,5}\$");
	var input = {};
	input['version'] = version;
	input['module'] = module;
	for(var key in file) input[key] = file[key];
        console.log('Adding file:' + JSON.stringify(file));
        if(!input["file"]){
                res.send(responseFormat(4,"Syntax error", file));
        } else if (!regExp.test(input["file"])) {
                res.send(responseFormat(4,"Syntax error", {'explanation':'The filename should begin with a lowercase letter followed only by letters then numbers' , 'input':input['file']}));
        } else {
		db.collection('configFile', function(err, collection){
                	collection.find({'version':version, 'module':module, 'file':input['file'], 'paramName':{$exists:false}}, {_id:0, version:1, module:1, file:1}).toArray(function(err, items){
                                if(err){
                                        if (err["name"]=="MongoError"){
                                                response = responseFormat(1,"Database unavailable", err);
                                        } else {
                                                response = responseFormat(6,"Unknown error",err);
                                        }
                                }
                                if(!items.length == 0) {
                                        res.send(responseFormat(5,"Duplicate : The file already exist", items));
                                } else {
                                        res.send(responseFormat(0,"Ok",{}));
                                }
                        });
                        collection.update({'version':version, 'module':module, 'file': input['file'], 'paramName':{$exists:false}},{"$setOnInsert":input}, {upsert:true});
			/*collection.insert(input, {safe:true}, function(err, result){
                        	if(err){
                                	res.send({'error':'An error has occured' + err});
                        	} else {
                                	console.log('Success: ' + JSON.stringify(result[0]));
	                                res.send(result[0]);
        	                }
                	});*/
        	});
	}
};

//embody the implementation which allow adding a new parameter
//by the URI POST /fileConf/:version/:module/:file/param associated with
//the version,the module and the file input in the URI
exports.addParam = function(req, res){
	var param = req.body;
        var file = req.params.file;
        var module = req.params.module;
        var version = req.params.version;
        var regExp = new RegExp("\^\[a-zA-Z\]\+\(_\?\[a-zA-Z0-9\]\+\){0,5}\$");
	var input = {};
	input['version'] = version;
	input['module'] = module;
	input['file'] = file;
	for(var key in param) input[key] = param[key];
        console.log('Adding Parameter:' + JSON.stringify(param));
        if(!input["paramName"]||!input["paramValue"]&&typeof input["paramValue"]!='boolean'){
                console.log('nope');
		res.send(responseFormat(4,"Syntax error", param));
        } else if (!regExp.test(input["paramName"])) {
                console.log("nope3");
                res.send(responseFormat(4,"Syntax error", {'explanation':'The parameter\'s name  should begin with a letter followed by letters and numbers with possibly underscore in between' , 'input':input['paramName']}));
        } else {
		db.collection('configFile', function(err, collection){
	                collection.find({'version':version, 'module':module, 'file':file, 'paramName':input['paramName']}, {_id:0, version:1, module:1, file:1}).toArray(function(err, items){
                                if(err){
                                        if (err["name"]=="MongoError"){
                                                response = responseFormat(1,"Database unavailable", err);
                                        } else {
                                                response = responseFormat(6,"Unknown error",err);
                                        }
                                }
                                if(!items.length == 0) {
                                        res.send(responseFormat(5,"Duplicate : The parameters already exist", items));
                                } else {
					res.send(responseFormat(0,"Ok",{}));
				}
                        });
                        collection.update({'version':version, 'module':module, 'file':file, 'paramName': input['paramName']},{"$setOnInsert":input}, {upsert:true});
			/*collection.insert(input, {safe:true}, function(err, result){
        	                if(err){
                	                res.send({'error':'An error has occured'});
                        	} else {
                                	console.log('Success: ' + JSON.stringify(result[0]));
	                                res.send(result[0]);
        	                }
                	});*/
	        });
	}
};

//embody the URI DELETE /configFile/:version/:module 
//the version and the module are taken from the URI
//and the documents which correspond are removed
exports.deleteModule = function(req,res){
	var module = req.params.module;
	var version = req.params.version;
	console.log('Deleting module: ' + module);
	db.collection('configFile', function(err, collection){
		collection.remove({'version':version, 'module':module}, {safe:true}, function(err, result){
			var jRes = JSON.parse(result);
			if(err){
				if (err["name"]=="MongoError"){
                                        response = responseFormat(1,"Database unavailable", err);
                                } else {
                                        response = responseFormat(6,"Unknown error",err);
                                }
			} else if (jRes["n"] == 0) {
				res.send(responseFormat(2, module + " doesn\'t exist", {}));
			} else {
				console.log('' + result + ' document(s) deleted');
				res.send(responseFormat(0, "Ok", result));
			}
		});
	});
};

//embody the URI DELETE /configFile/:version/:module/:file
//the version, the module and the file are taken from the URI
//and the documents which correspond are removed
exports.deleteFile = function(req,res){
	var file = req.params.file;
        var module = req.params.module;
        var version = req.params.version;
        console.log('Deleting file: ' + file);
        db.collection('configFile', function(err, collection){
                collection.remove({'version':version, 'module':module, 'file':file}, {safe:true}, function(err, result){
                        var jRes = JSON.parse(result);
			if(err){
                               if (err["name"]=="MongoError"){
                                        response = responseFormat(1,"Database unavailable", err);
                                } else {
                                        response = responseFormat(6,"Unknown error",err);
                                }
                        } else if (jRes["n"] == 0) {
                                res.send(responseFormat(2, file + " doesn\'t exist", {}));
                        } else {
                                console.log('' + result + ' document(s) deleted');
                                res.send(responseFormat(0, "Ok", result));
                        }
                });
        });
};

//embody the URI DELETE /configFile/:version/:module/:file/:param
//the version, the module, the file, and the parameters(name) are taken from the URI
//and the documents which correspond are removed
exports.deleteParam = function(req, res){
	var param = req.params.param;
	var file = req.params.file;
        var module = req.params.module;
        var version = req.params.version;
        console.log('Deleting parameter: ' + param);
        db.collection('configFile', function(err, collection){
                collection.remove({'version':version, 'module':module, 'file':file, 'paramName':param}, {safe:true}, function(err, result){
                        var jRes = JSON.parse(result);
                        if(err){
                                if (err["name"]=="MongoError"){
                                        response = responseFormat(1,"Database unavailable", err);
                                } else {
                                        response = responseFormat(6,"Unknown error",err);
                                }
                        } else if (jRes["n"] == 0) {
                                res.send(responseFormat(2, param + " doesn\'t exist", {}));
                        } else {
                                console.log('' + result + ' document(s) deleted');
                                res.send(responseFormat(0, "Ok", result));
                        }
                });
        });
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------*/
//populate database with sample data -- Only used once : the first time the application is started
//Add the different version DEV VAL and PROD
var populateDB = function(){
	var version = [
	{
		version: "DEV"
	},
	{
		version: "VAR"
	},
	{
		version: "PROD"
	}
	];
	
	db.collection('configFile', function(err, collection){
		collection.insert(version, {safe:true}, function(err, result) {});
	});
};

