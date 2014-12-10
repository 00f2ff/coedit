var mongo = require("./../models/mymongo.js");

exports.init = function(io) {
	var users = 0; // keep track of current number of users
	// Make sure no more than 2 users are using application

	var indent = '  '; // permits indentation size change
	var markup = '<html>\n' +
						'<head>\n' + indent + 
							'<title></title>\n' + 
						'</head>\n' + 
						'<body>\n' + indent + '\n' + 
						'</body>\n' + 
						'</html>'; // default markup string
	var style = '<style></style>'; // default style string
	
	if (users < 2) {
		// When a new connection is initiated
		io.sockets.on('connection', function(socket) {
			++users;
			if (users === 1) {
				socket.emit('user', { role: 'html'}); // initiate the name input for HTML
			}
			else {
				socket.emit('user', { role: 'css'}); // initiate the name input for CSS
			}

			// receive emit from user client to show that user's name on other user's client
			socket.on('newname1-server', function(data) {
				socket.broadcast.emit('update-for-user1', {name: data.name, role: data.role});
			});

			/*
			 * When one user disconnects, this listener and its respective client emit
			 * will update the remaining user's client with the name of the next
			 * joining user.
			 */
			socket.on('newname2-server', function(data) {
				var userRole;
				// the other user's role is passed in, so the reverse needs to hold
				if (data.role === 'html') {
					role = 'css';
				}
				else {
					userRole = 'html';
				}
				socket.broadcast.emit('update-for-user2', {name: data.name, role: userRole})
			});

			/* Code and listeners for users writing code */

			// listen for HTML user to press enter and update code
			socket.on('html-update', function(data) {
				// update markup
				markup = data.code;
				// send broadcast updated html to css user
				socket.broadcast.emit('html-update-for-css', {code: data.code});
				updateSite();
			});

			// listen for CSS user to press enter and update code
			socket.on('css-update', function(data) {
				// update style
				style = '<style>'+data.code+'</style>';
				// send broadcast updated html to css user
				socket.broadcast.emit('css-update-for-html', {code: data.code});
				updateSite();
			});

			// sends a broadcast.emit and an emit to update the site
			function updateSite() {
				socket.broadcast.emit('site-update', {code: markup+style});
				socket.emit('site-update', {code: markup+style});
			}

			/* Database listeners */
			socket.on('website-save', function(data) {
				mongo.create(data.query, function(docs) {
					// console.log(docs[0].name + " was saved to the database");
					// console.log('content: ' + docs[0].content);

					// emit that a new website has been saved
					mongo.read({}, function(docs) {
						socket.emit('refresh-websites', {'docs': docs});
						socket.broadcast.emit('refresh-websites', {'docs': docs});
					});
					// mongo.deleteAll(); // this is here for test purposes
			// *** problem: it's saving twice (sometimes)
				});
			});

			socket.on('website-load', function(data) {
				console.log(data.id);
				mongo.read({"_id" : data.id}, function(doc) {
					socket.emit('loaded-code', {'doc': doc});
					// it's going to be broadcast because otherwise there will be a discrepancy between one 
					// user's code and another (style/html mismatch)
					socket.broadcast.emit('loaded-code', {'doc': doc});
				});
			});

			socket.on('list-all-sites', function(data) {
				// query database for all sites and send back to client
				mongo.read({}, function(docs) {
					socket.emit('refresh-websites', {'docs': docs});
					socket.broadcast.emit('refresh-websites', {'docs': docs});
				});
			});


			// Upon disconnect, send disconnection event to other player
			socket.on('disconnect', function() {
				--users;
				socket.broadcast.emit('quit');
			});
		});
	}
	

}
