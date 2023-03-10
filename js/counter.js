/*
 * Sweeps the HTML document for elements of the "counter" class and treats them
 * as integers which will count up from zero to a specified final value over
 * some number of cycles.
 *
 * Globals
 * -------
 * counters : all instances of the "counter" class from the calling HTML script.
 * cycles : the number of cycles to run the updateCount function through -> the
 * 		higher the value, the longer it takes to count. At 400, this is about 2
 * 		seconds.
 */
const counters = document.querySelectorAll(".counter");
const cycles = 400;
for (var i = 0; i < counters.length; i++) {
	let counter = counters[i];
	readMetrics()
		.then(metrics => {
			updateCount(counter, metrics, 0);
		});
}


/*
 * Reads the file at (webpage home)/data/metrics.json and returns the research
 * metrics data as a dictionary.
 */
async function readMetrics() {

	var data = {};

	let response = await fetch("./data/metrics.json");
	if (response.ok) {
		var contents = await response.json();
		data["pubs"] = +contents["data"]["pubs"];
		data["lead_author"] = +contents["data"]["lead_author"];
		data["co_author"] = +contents["data"]["co_author"];
		data["citations"] = +contents["data"]["citations"];
		data["hindex"] = +contents["data"]["hindex"];
		data["talks"] = +contents["data"]["talks"];
	} else {
		throw new Error(`HTTP Error! Status: ${response.status}`);
	}

	return data;

}


/*
 * Updates a single integer counter while it is on screen until it reaches its
 * maximum value, then terminates and leaves the final values on screen for
 * the viewer.
 */
function updateCount(counter, metrics, currentValue) {

	const target = metrics[counter.getAttribute("metric")];
	/* Only count up if the counter is on screen, otherwise sleep */
	if (isInView(counter)) {
		if (currentValue < target) {
			currentValue += 1.0 / cycles * target;
			setTimeout(updateCount, 0, counter, metrics, currentValue);
			counter.innerText = Math.floor(currentValue);
		} else {
			counter.innerText = target;
		}
	} else {
		setTimeout(updateCount, 100, counter, metrics, currentValue);
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

