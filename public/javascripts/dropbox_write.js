$(function() {
	// initialize dropbox client
	var dropboxClient = new Dropbox.Client({ key: '6zz60061n329msy'});
	// initialize filename
	var filename = 'coedit_file';

	// Authenticate with OAuth
	dropboxClient.authenticate({ interactive: false }, function(error, dropboxClient) {
		if (error) {
			alert('Error: ' + error);
		}
	});

	$('#dropbox-form button').click(function() {
		// get user's chosen filename
		filename = $('#dropbox-form input[name="filename"]').val();
		// authenticate with OAuth
		dropboxClient.authenticate(function(error, client) {
			if (error) {
				alert('Error: '+ error);
			}
			else {
				writeFileToDropbox;
			}
		});
		// exit normal form action
		return false;
	});

	// if authenticated then we can write
	if (dropboxClient.isAuthenticated()) {
		writeFileToDropbox();
	}

	function writeFileToDropbox() {
		// get current markup and style
		var markup = $('#html-editor').val();
		var style = '<style>'+$('#css-editor').val()+'</style>';
		// write combined strings to a file within user's dropbox
		console.log('in write');
		dropboxClient.writeFile(filename+'.html', markup+style, function(error) {
			if (error) {
				alert('Error: ' + error);
			}
			else {
				alert(filename+' successfully written to Dropbox');
			}
		});
	}

	

});