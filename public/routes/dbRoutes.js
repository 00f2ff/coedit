// require application model
// var mongo = require("../../models/mymongo.js");

// Index page has links to other pages
exports.index = function(req, res) {
	res.render('home', {title: 'Coedit DB test'});
}

// Renderings for create, read, update (no destroy in Coedit)
exports.mongo = function(req, res) {
	// use a switch to handle multiple cases
	switch (req.params.operation) {
		case 'create': 
			console.log('req.query is '+JSON.stringify(req.query));
			mongo.create(
				'websites',
				req.query,
				function(model) {
					res.render('mongo', {object: model});
				}
			);
			console.log('At end of insert case');
			break;
		case 'read': 
			mongo.read(
				'websites',
				req.query,
				function(model) {
					res.render('mongo', {object: model});
				}
			);
			break;
		case 'update': 
			mongo.update(
				'websites',
				req.query,
				function(model) {
					res.render('success', {object: model});
				}
			);
			break;
	}
}


// Error page
exports.errorMessage = function(req, res) {
	var message = '<p>Error, did not understand path '+req.path+"</p>";
	// Set the status to 404 not found, and render a message to the user.
  res.status(404).send(message);
}