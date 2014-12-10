// creates the redirect URI that Dropbox needs
function generateRedirectURI(req) {
	return url.format({
    protocol: req.protocol,
    host: req.headers.host,
    pathname: app.path() + '/success'
	});
}

// creates CSRF token
function generateCSRFToken() {
	return crypto.randomBytes(18)
				 .toString('base64')
	    	 .replace(/\//g, '-')
	    	 .replace(/\+/g, '_');
}

exports.auth = function(req, res) {
	var csrfToken = generateCSRFToken();
	res.cookie('csrf', csrfToken);
	res.redirect(url.format({
    protocol: 'https',
    hostname: 'www.dropbox.com',
    pathname: '1/oauth2/authorize',
    query: {
      client_id: '6zz60061n329msy', // my app key
      response_type: 'code',
      state: csrfToken,
      redirect_uri: generateRedirectURI(req)
    }
	}));
};

exports.oauth = function (req, res) {
if (req.query.error) {
    return res.send('ERROR ' + req.query.error + ': ' + req.query.error_description);
}

if (req.query.state !== req.cookies.csrf) {
    return res.status(401).send(
        'CSRF token mismatch, possible cross-site request forgery attempt.'
    );
}

request.post('https://api.dropbox.com/1/oauth2/token', {
    form: {
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: generateRedirectURI(req)
    },
    auth: {
        user: '6zz60061n329msy',
        pass: 'ivy0dap0y8sli0q'
    }
}, function (error, response, body) {
    var data = JSON.parse(body);
    if (data.error) {
        return res.send('ERROR: ' + data.error);
    }

    var token = data.access_token;
    req.session.token=data.access_token;
    request.post('https://api.dropbox.com/1/account/info', {
        headers: { Authorization: 'Bearer ' + token }
    }, function (error, response, body) {
        res.send('Logged in successfully as ' + JSON.parse(body).display_name + '.');
    });

});
});