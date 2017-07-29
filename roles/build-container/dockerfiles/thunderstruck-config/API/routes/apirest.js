var is_alive={};
var mongo = require('mongodb'); //indique la dépendance avec le driver natif mongodb
//variables utilitaires utilisées comme alias
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    ObjectID = mongo.ObjectID;

// create the connection to the DB server in localhost on port 27017
// auto reconnect make it so that we don't need to disconnect manually
// w=1 indicate writing mode 
var server = new Server('localhost', 27017, {auto_reconnect: true},{w:1});
// identification of the DB used, here is "test"
db = new Db('configFileDB', server);

// function called automatically after the creation of the DB instance
// try to access isalive collection, if there is an error
// we create it and fill it with the function populateDB which will insert 
// a document saying i'm alive
db.open(function(err, db) {
	if(!err){
		console.log("Connected to 'isalive' database");
		db.collection('isalive', {strict:true}, function(err, collection){
			if (err) {
				console.log("The 'isalive' collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});

// function used if the user search for URI /is_aliveDB
// Return the content of the collection as a array of JSON object 
exports.find=function(req, res){
	console.log('Retrieving status');
	db.collection('isalive', function(err, collection){
		collection.find().toArray(function(err, items){
			res.send(items);
		});
	});
};

//Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
// Ajoute des objets personnes à la collection personnes en passant un tableau de
// personnes…
var populateDB = function(){
	var isalive = {
		status:"I'm alive"
	}
	db.collection('isalive', function(err, collection){
		collection.insert(isalive, {safe:true}, function(err, result){});
	});
};

// function to load isalive.json
var myInit=function(){
	is_alive = require('./isalive.json');
	console.log("load");
};
//load isalive.json
myInit();


//function called when user search for URI /is_alive
//return content from isalive.json
exports.isalive = function(req, res){
	res.send(is_alive);
};


