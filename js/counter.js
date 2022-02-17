/*
 * Sweeps the HTML document for elements of the "counter" class and treats them
 * as integers which will count up from zero to a specified final value over
 * some specified time interval (1.5 seconds).
 *
 * Globals
 * -------
 * counters : all instances of the "counter" class from the calling HTML script.
 * time : the time interval over which the animated integers will reach their
 * 		final values.
 */
const counters = document.querySelectorAll(".counter");
const time = 1500;
for (var i = 0; i < counters.length; i++) updateCount(counters[i]);


/*
 * Updates a single integer counter while it is on screen until it reaches its
 * maximum value, then terminates and leaves the final values on screen for
 * the viewer.
 */
function updateCount(counter) {

	const target = +counter.getAttribute("data-target");
	const count = +counter.innerText;
	const interval = time / target;

	/* Only counts up if the counter is on screen, otherwise sleep */
	if (isInView(counter)) {
		if (count < target) {
			setTimeout(updateCount, interval, counter);
			counter.innerText = count + 1;
		} else {
			counter.innerText = target;
		}
	} else {
		setTimeout(updateCount, 100, counter);
	}

}


/*
 * Determines if a div is currently on screen. Returns true if its position is
 * within the vertical width of the window, and false otherwise.
 * 
 * Change Notes
 * ------------
 * $(window).height() failed for mobile screens, and instead window.innerHeight
 * is required to determine the correct height of the window in pixels. 
 */
function isInView(div) {

	var divPos = div.getBoundingClientRect();
	var divTop = divPos.top;
	var divBottom = divPos.bottom;

	return ((divTop >= 0) && (divBottom <= window.innerHeight));

}

