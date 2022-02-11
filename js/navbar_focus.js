/*
 * Continually monitors which sections of the webpage are currently within view
 * and places the "focus" state in the navbar appropriately for whichever
 * section currently occupies the largest screen covering fraction. The "focus"
 * state simply turns the label red while the others will remain the "dormant"
 * state where they stay grey.
 * 
 * Globals
 * -------
 * navbar : The navigation bar from the calling HTML script.
 * navdivs : The div items in the calling script that have sections represented
 * 		on the navigation bar.
 * focus, dormant : The strings to swap in and out of navbar.innerHTML when
 * 		different sections come in and out of view.
 */
const navbar = document.getElementById("navigation");
const navdivs = [
	document.getElementById("home"),
	document.getElementById("research"),
	document.getElementById("comptools"),
	document.getElementById("teaching"),
	document.getElementById("outreach"),
	document.getElementById("bio"),
	document.getElementById("contact")
]
const focus = "focus\">"
const dormant = "dormant\">"
cycleNavbar();


/*
 * Continually monitors the navbar and cycles elements in and out of the
 * "focus" state as the user scrolls up and down the page.
 */
function cycleNavbar() {

	updateNavbar();
	setTimeout(cycleNavbar, 100);

}


/* 
 * Updates the navbar's innerHTML. If the resultant HTML is the same as the
 * current HTML, it does nothing.
 */
function updateNavbar() {

	var navbarElements = navbar.innerHTML.split(/(\s+)/);
	var divIndex = biggestDivOnScreen();
	var occurrence = 0;
	for (var i = 0; i < navbarElements.length; i++) {
		if (navbarElements[i] === focus || navbarElements[i] === dormant) {
			if (occurrence === divIndex) {
				navbarElements[i] = focus;
			} else {
				navbarElements[i] = dormant;
			}
			occurrence++;
		}
	}

	let newHTML = navbarElements.join('');
	if (navbar.innerHTML != newHTML) navbar.innerHTML = navbarElements.join('');

}


/*
 * Determines which element of the navdiv list occupies the largest fraction of
 * the current screen. This is the section of the document that this script
 * will place the "focus" state on in the navigation bar.
 */
function biggestDivOnScreen() {

	var screenFracs = allDivScreenFracs();
	var index;
	if (screenFracs[1] > screenFracs[0]) {
		index = 1;
	} else {
		index = 0;
	}
	for (var i = 2; i < navdivs.length; i++) {
		if (screenFracs[i] > screenFracs[i - 1]) index = i;
	}
	return index;

}


/*
 * Determines the fraction of the current screen that each element of the
 * navdiv list occupies.
 */
function allDivScreenFracs() {

	var screenFracs = new Array(navdivs.length);
	for (var i = 0; i < navdivs.length; i++) {
		screenFracs[i] = screenFrac(navdivs[i]);
	}
	return screenFracs;

}


/* 
 * Determines the fraction of the current screen that a given div occupies.
 * 
 * Parameters
 * ----------
 * div : An element of the navdiv list. In practice, this should be a div
 * containing a major section of the webpage.
 * 
 * Returns
 * -------
 * frac : The fraction of the current screen's width that the given div
 * occupies.
 * 
 * Notes
 * -----
 * In the event that the screen is entirely within one div which is larger than
 * the windows vertical extent, the returned value with be larger than 1.
 * Although this isn't numerically correct, it's fine for the purpose this
 * function fulfills, because this div will be the one with largest screen
 * covering fraction anyway.
 */
function screenFrac(div) {

	var docViewTop = $(window).scrollTop();
	var docViewBottom = docViewTop + $(window).height();

	var divTop = div.offsetTop;
	var divBottom = divTop + div.offsetHeight;

	if (docViewBottom < divTop || docViewTop > divBottom) {
		/* div is off screen */
		return 0;
	} else {
		if (docViewTop <= divTop && divBottom <= docViewBottom) {
			/* the entire div is on screen */
			return (divBottom - divTop) / (docViewBottom - docViewTop);
		} else if (docViewTop <= divTop) {
			/* the top of the div is visible at the bottom of the page */
			return (docViewBottom - divTop)  / (docViewBottom - docViewTop);
		} else if (docViewTop <= divBottom) {
			/* the bottom of the div is visible at the top of the page */
			return (divBottom - docViewTop) / (docViewBottom - docViewTop);
		}
	}

}

