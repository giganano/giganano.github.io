/*
 * Handles the opening and closing of the collapsible navigation bar on
 * mobile screens.
 */ 



/* --------------------------------------------------------------------
 * Open or close the navbar when the collapse button is clicked.
 */
$(document).ready(function() {
	$(".toggle-collapse").click(function() {
		$(".navbar-collapse").toggleClass("collapse")
	})
});
/* -------------------------------------------------------------------- */




/* --------------------------------------------------------------------
 * Close it when one of the buttons inside the navbar is clicked
 */
$(document).ready(function() {
	$(".nav-item").click(function() {
		$(".navbar-collapse").toggleClass("collapse")
	})
});
/* -------------------------------------------------------------------- */




/* --------------------------------------------------------------------
 * Swap the mobile navigation button from the align-center icon to an X
 * when it's opened, and vice-versa when it's closed. Don't forget to
 * swap it back if a nav-item is clicked!
 */
$(document).ready(function() {
	$(".toggle-collapse").click(function() {
		$(".fa-solid").toggleClass("fa-align-center")
	})
});

$(document).ready(function() {
	$(".toggle-collapse").click(function() {
		$(".fa-solid").toggleClass("fa-x")
	})
});

$(document).ready(function() {
	$(".nav-item").click(function() {
		$(".fa-solid").toggleClass("fa-align-center")
	})
});

$(document).ready(function() {
	$(".nav-item").click(function() {
		$(".fa-solid").toggleClass("fa-x");
	})
});
/* -------------------------------------------------------------------- */

