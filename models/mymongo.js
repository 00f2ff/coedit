var util = require("util");
var mongoClient = require('mongodb').MongoClient;
// ObjectID type
var ObjectID = require('mongodb').ObjectID;

// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/coedit';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

// connection URL
// var url = 'mongodb://localhost:27017/';
var mongoDB; // The connected database
// Use connect method to connect 'to' the Server
mongoClient.connect('mongodb://'+connection_string, function(e, db) {
  if (e) doError(e);
  console.log("Connected correctly to server");
  // database is now set
  mongoDB = db;
});

// Create
exports.create = function(query, callback) {
	// insert a query into the specific collection
	mongoDB.collection('website').insert(
		query,
		{safe: true},
		function(e, result) {
			if (e) {
				doError(e);
			}
			callback(result);
		});
}

// Read
exports.read = function(query, callback) {
	// format a proper query given the ObjectID as a string
	if (query["_id"]) {
		console.log(query);
		query = {_id : new ObjectID(query["_id"])}
		console.log(query);
	}
	// search for result based on query
	var result = mongoDB.collection('website').find(query);
	result.toArray(function(e, docs) {
		if (e) {
			doError(e);
		}
		// call the callback on the returned documents
		callback(docs);
	});
}

// Delete everything [test method]
exports.deleteAll = function() {
	mongoDB.collection('website').drop();
}

// Update 
// exports.update = function(collection, query, callback) {
// 	// string query is passed in
// 	mongoDB.collection(collection).update(
// 		JSON.parse(query.read), // query we're searching for
// 		JSON.parse(query.update), // updated query
// 		{new: true}, // does this create a new entry?
// 		function(e, result) {
// 			if (e) {
// 				doError(e);
// 			}
// 			callback('Update successful')
// 		}
// 	);
// }

var doError = function(e) {
	util.debug("ERROR: " + e);
	throw new Error(e);
}