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
 * mobileNavbar : The same as navbar but for mobile screens.
 * navdivs : The div items in the calling script that have sections represented
 * 		on the navigation bar.
 * focus, dormant : The strings to swap in and out of navbar.innerHTML when
 * 		different sections come in and out of view.
 */
const navbar = document.getElementById("navigation");
const mobileNavbar = document.getElementById("mobile-navigation");
const navdivs = [
	document.getElementById("header-top"),
	document.getElementById("research"),
	document.getElementById("talks"),
	document.getElementById("collabs"),
	document.getElementById("comptools"),
	document.getElementById("teaching"),
	document.getElementById("outreach"),
	document.getElementById("bio"),
	document.getElementById("contact")
]
const focus = "focus\">"
const dormant = "dormant\">"
cycleNavbars();


/*
 * Continually monitors the navbar and cycles elements in and out of the
 * "focus" state as the user scrolls up and down the page.
 */
function cycleNavbars() {

	updateNavbar();
	updateMobileNavbar();
	setTimeout(cycleNavbars, 100);

}


/* 
 * Toggles the link classes between "focus" and "dormant" based on which
 * section of the webpage is currently occupying the largest screen fraction.
 * Carries out this functionality for the full webpage (i.e. not mobile).
 */
function updateNavbar() {

	var divIndex = biggestDivOnScreen();
	var current = -1;
	for (var i = 0; i < navbar.childNodes[1].children.length; i++) {
		if (navbar.childNodes[1].children[i].children[0].classList.contains(
			"focus")) current = i;
	}

	if (current >= 0 && current != divIndex) {
		let newChild = navbar.children[0].children[divIndex].children[0];
		let oldChild = navbar.children[0].children[current].children[0];
		newChild.classList.toggle("dormant");
		newChild.classList.toggle("focus");
		oldChild.classList.toggle("dormant");
		oldChild.classList.toggle("focus");
	} else {}


}


/*
 * Performs the exact same function as updateNavbar, but for the mobile version
 * of the webpage.
 */
function updateMobileNavbar() {

	var divIndex = biggestDivOnScreen();
	var current = -1;
	for (var i = 0; i < mobileNavbar.children[2].children[0].children.length;
		i++) {
		let elem = mobileNavbar.children[2].children[0].children[i].children[0];
		if (elem.classList.contains("focus")) current = i;
	}

	if (current >= 0 && current != divIndex) {
		let newChild = mobileNavbar.children[2].children[0].children[divIndex];
		let oldChild = mobileNavbar.children[2].children[0].children[current];
		newChild.children[0].classList.toggle("dormant");
		newChild.children[0].classList.toggle("focus");
		oldChild.children[0].classList.toggle("dormant");
		oldChild.children[0].classList.toggle("focus");
	}

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

