var express = require('express');
var http = require('http');
// var dbRoutes = require('./routes/dbRoutes'); 
// var dropboxRoutes = require('./routes/dropboxRoutes');
var morgan = require('morgan');
var app = express();

// Set the views directory (there is a folder called prototype. I'm not using it for this homework)
app.set('views', __dirname + '/views');

// Define the view (templating) engine
app.set('view engine', 'ejs');

app.use(morgan('dev'));	// Log requests

// Routes 
// app.get('/', dbRoutes.index);
// app.put('/websites/:operation', dbRoutes.mongo);
// app.get('/websites/:operation', dbRoutes.mongo);
// app.post('/websites/:operation', dbRoutes.mongo);
// I'm not putting delete functionality in my app because I don't have
// a good way to keep track of which websites different users have made.
// Therefore I can't keep users from deleting each other's websites

// dropbox authentication
// app.get('/', dropboxRoutes.auth);
// app.get('/success', dropboxRoutes.oauth);

// Handle static files
app.use(express.static(__dirname + '/public'));

// Catch unhandled routes
// app.use(dbRoutes.errorMessage);

// Set IP address and port (defaults to 127.0.0.1:33333 if these not available)
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 50000;

// Link socket.io to app with an http server
var httpServer = http.Server(app);
var sio = require('socket.io');
var io = sio(httpServer);

// Start listening on the specific IP and port
httpServer.listen(port, ipaddress, function() {
	console.log('%s: Node server started on %s:%d ... ',
		Date(Date.now()), ipaddress, port);
});

// Controller for socket.io
var coeditSockets = require('./routes/serverSocket.js');
coeditSockets.init(io);