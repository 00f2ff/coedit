/*
 * I need to generate random classes for all of my page elements so that users don't 
 * accidentally change the page layout when they add CSS.
 * I will append important style to those classes here.
 */

// *** I need to update this for responsive design
// This object contains all CSS information I want to apply to each of my page elements
var attrObject = {
	'editor-box': 'float: left !important; width: 500px !important;',
	'site-box': 'float: left !important; width: 500px !important; height: 500px !important; border: 2px solid black !important; margin-left: 50px !important; overflow: scroll !important;',
	'name-form': 'position: absolute !important; margin: 50 auto !important; visibility: hidden !important;',
	'textarea': 'overflow: scroll !important; resize: none !important;'
}

var attrObject_mobile = {};

$(function() {
 	var size = 10; // size of string that will represent random class

 	// create random classes, add to each page element, and add style to that class
	var eb_class = randomClass();
	$('#editor-box').addClass(eb_class);
	$('.'+eb_class).attr('style',attrObject['editor-box']);
	var sb_class = randomClass();
	$('#site-box').addClass(sb_class);
	$('.'+sb_class).attr('style',attrObject['site-box']);
	var nf_class = randomClass();
	$('#name-form').addClass(nf_class);
	$('.'+nf_class).attr('style',attrObject['name-form']);
	var ta_class = randomClass();
	$('textarea').addClass(ta_class);
	$('.'+ta_class).attr('style',attrObject['textarea']);

 	// it's conceivable that two elements might get the same class, but unlikely
 	function randomClass() {
 		var options = 'abcdefghijklmnopqrstuvwxyz0123456789';
 		var c = '';
 		for (var i = 0; i < size; i++) {
 			// add random character of options to c
 			c += options[Math.floor(Math.random() * options.length)];
 		}
 		return c;
 	}


 	
 })