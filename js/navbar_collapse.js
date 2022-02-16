/*
 * Handles the opening and closing of the collapsible navigation bar on
 * mobile screens.
 */ 

/* Open or close the navbar when the collapse button is clicked */
$(document).ready(function() {
	$(".toggle-collapse").click(function() {
		$(".navbar-collapse").toggleClass("collapse")
	})
});


/* Close it when one of the buttons inside the navbar is clicked */
$(document).ready(function() {
	$(".nav-item").click(function() {
		$(".navbar-collapse").toggleClass("collapse")
	})
});

