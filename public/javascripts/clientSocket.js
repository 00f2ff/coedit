var socket = io.connect(':8000/');

// Set intial username
var username = {name: ''}; // store who user is
loadDataFromLocalStorage(); // update if needed

var indent = '  '; // permits indentation size change

var allWebsites;

socket.on('user', function(data) {
	
	if (username.name.length === 0) {
		// ask for user to input name
		$('#coedit_name-form').css('visibility','visible'); // show the form
		$('#coedit_name-form button').click(function() {
			username.name = $('#coedit_name-form input[name="name"]').val();
			saveDataToLocalStorage(); // save to localStorage
			$('#coedit_name-form').css('visibility','hidden'); // hide the form
			// update your name in the page
			$('#coedit_'+data.role+'-name').text(username.name);
			socket.emit('newname1-server', {name: username.name, role: data.role});
			return false; // stop normal form behavior
		});
	}
	else { // repeat code to prevent asynchronicity from affecting update
		// update your name in the page
		$('#coedit_'+data.role+'-name').text(username.name);
		socket.emit('newname1-server', {name: username.name, role: data.role});
	}

	// Restrict other user's textarea to readonly 
	// (first remove status from both in case a CSS user moved to HTML within the same session)
	$('#coedit_html-editor').attr('readonly', false);
	$('#coedit_css-editor').attr('readonly', false);
	if (data.role === 'html') {
		$('#coedit_css-editor').attr('readonly', true);
	}
	else {
		$('#coedit_html-editor').attr('readonly', true);
	}

	/* Handle keyup events to update each user's client */
	// html editor key handler
	$('#coedit_html-editor').keyup(function(e) {
		// make sure we get a number for the key that was pressed
		var keycode = (e.keyCode ? e.keyCode : e.which);
		// check that the 'Enter' key was pressed
		if (keycode === 13) {
			// send a message to server
			socket.emit('html-update', {code: $(this).val()});
		}	
	});

	// css editor handler
	$('#coedit_css-editor').keyup(function(e) {
		// Curly brace autofill
		if ($(this).val().charAt($(this).val().length-1) == '{') {
			$(this).val($(this).val() + '\n' + indent + '\n' + '}');
		}
		// make sure we get a number for the key that was pressed
		var keycode = (e.keyCode ? e.keyCode : e.which);
		// check that the 'Enter' key was pressed
		if (keycode === 13) {
			socket.emit('css-update', {code: $(this).val()});
		}
	});

	// website save handler
	$('#coedit_save-website-form button').on('click',function(ev) {
		// ev.preventDefault(); // stop normal form behavior
		var name = $('#coedit_save-website-form input[name="name"]').val();
		var htmlCode = $('#coedit_html-editor').val();
		var cssCode = $('#coedit_css-editor').val();
		var query = {
			'name': name,
			'htmlCode': htmlCode,
			'cssCode': cssCode
		}
		socket.emit('website-save', {'query': query});

		return false; // stop normal form behavior

	});
	// allowing an update handler is questionable because different people can name their
	// website the same thing, and I have no good way of knowing which is which

	// list all sites handler
	$('#coedit_list-all-sites').click(function() {
		socket.emit('list-all-sites', {'check': 'yes'});
	});

	// website load handler
	$('#coedit_website-list').on('mousedown', '.website-load-button', function() { //*** mouseup to avoid hold?
		socket.emit('website-load', {'id': $(this).data('objectid')});
	});

	

	/*
	 * If I want to properly show a website in the site-box that is scaled to that size, I
	 * would need to save a separate field in the database as 'scaledContent', which would
	 * mean every pixel value a user writes would be replaced with a calculation.
	 * For example, the line
	 *		width: 500px;
	 * would become
	 *		width: calc(500px * sf);
	 * where sf = $('#coedit_site-box').width() / $(window).width()
	 * and would also be off by a pixel sometimes due to rounding errors. I could implement
	 * it using a regex on the style string, but processing that string would slow down things,
	 * and CSS speed decreases after ~4 calc() methods are used.
	 *
	 * As a result, I have decided to just ask users to design their webpages in a responsive
	 * manner, using ems and %s, which will remove my need to use a scale factor.
	 * It also means they can use the app on mobile similarly to the way they use it on a computer
	 */

	
	
});

// Name listener 1
socket.on('update-for-user1', function(data) {
	$('#coedit_'+data.role+'-name').text(data.name); // update other user's name
	// update current user's name in newest player's client (however, data.role is not user's role)
	socket.emit('newname2-server', {name: username.name, role: data.role}); 
});

// Name listener 2
socket.on('update-for-user2', function(data) {
	$('#coedit_'+data.role+'-name').text(data.name); // update other user's name
});

// HTML update listener for CSS user
socket.on('html-update-for-css', function(data) {
	$('#coedit_html-editor').val(data.code);
});

// CSS update listener for HTML user
socket.on('css-update-for-html', function(data) {
	$('#coedit_css-editor').val(data.code);
});

// Site update listener
socket.on('site-update', function(data) {
	$('#coedit_site-box').html(data.code);
});

// Refreshed site list listener
socket.on('refresh-websites', function(data) {
	// add to the global array of websites
	allWebsites = data.docs;
	var tableData = '<table>';
	var len = data.docs.length;
	for (var i = len-1; i >= 0 ; i--) { // most recent save shows up first
		tableData += '<tr><td>' + data.docs[i].name + '</td>';
		// create a load button from data
		tableData += '<td><button class="website-load-button" data-objectId="' + data.docs[i]["_id"] 
		              	+ '">Load</button></td></tr>';
	}
	tableData += '</table>';
	$('#coedit_website-list').html(tableData);
});

// Code has loaded from the database
socket.on('loaded-code', function(data) {
	console.log(data.doc[0]);
	// write loaded code to both editors, and update in the site box
	console.log(data.doc[0].htmlCode);
	console.log(data.doc[0].cssCode);
	$('#coedit_html-editor').val(data.doc[0].htmlCode);
	$('#coedit_css-editor').val(data.doc[0].cssCode);
	$('#coedit_site-box').html(data.doc[0].htmlCode + 
		'<style>' + data.doc[0].cssCode + '</style');
	//** Note: both users need to press enter in order to properly apply the code changes
});

socket.on('quit', function() {
	window.location = '/'; 
	/* When a user quits, the other takes their place and the user that quit loses their work.
	 * It's important to save to avoid losing everything. While this prevents a user from staying
	 * a CSS editor, it also means that teams can save a file and then switch roles.
	 */
});


function loadDataFromLocalStorage() {
	// if a saved name exists, set username to that name
	if (localStorage.username && JSON.parse(localStorage.username)) {
		// set username to that information
		username = JSON.parse(localStorage.username);
	}
}

function saveDataToLocalStorage() {
	// save username in localStorage
	localStorage.username = JSON.stringify(username);
}

