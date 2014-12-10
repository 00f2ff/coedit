
$(function() {

	INDENT = '  '; // permits indentation size change
	MARKUP = '<html>\n' +
						'<head>\n' + INDENT + 
							'<title></title>\n' + 
						'</head>\n' + 
						'<body>\n' + INDENT + '\n' + 
						'</body>\n' + 
						'</html>'; // default markup string
	STYLE = '<style></style>'; // default style string

	// Initialize the HTML editor with the base markup string
	$('#html-editor').val(MARKUP);

	// html editor key handler
	$('#html-editor').keyup(function(e) {
		// make sure we get a number for the key that was pressed
		var keycode = (e.keyCode ? e.keyCode : e.which);
		// check that the 'Enter' key was pressed
		if (keycode === 13) {
			MARKUP = $(this).val();
			// append style to end of rendered html
			$('#site-box').html(MARKUP + STYLE);
		}
	});

	// css editor key handler
	$('#css-editor').keyup(function(e) {
		//console.log($(this).val());
		// Curly brace autofill
		if ($(this).val().charAt($(this).val().length-1) == '{') {
			$(this).val($(this).val() + '\n' + INDENT + '\n' + '}');
		}
		STYLE = '<style>' + $(this).val() + '</style>';

		console.log($(this).val());
		// make sure we get a number for the key that was pressed
		var keycode = (e.keyCode ? e.keyCode : e.which);
		// check that the 'Enter' key was pressed
		if (keycode === 13) {
			$('#site-box').html(MARKUP + STYLE);
		}
	});
})


// // html editor key handler
// 	$('#html-editor').keyup(function() {
// 		//console.log($(this).val());
// 		MARKUP = $(this).val();
// 		// append style to end of rendered html
// 		$('#site-box').html(MARKUP + STYLE);
// 	});

// 	// css editor key handler
// 	$('#css-editor').keyup(function(e) {
// 		//console.log($(this).val());
// 		// Curly brace autofill
// 		if ($(this).val().charAt($(this).val().length-1) == '{') {
// 			$(this).val($(this).val() + '\n' + INDENT + '\n' + '}');
// 		}
// 		STYLE = '<style>' + $(this).val() + '</style>';

// 		console.log($(this).val());
// 		$('#site-box').html(MARKUP + STYLE);
// 	});