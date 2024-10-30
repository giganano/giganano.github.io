/*
 * This file takes the publications data in data/publications/*.json and
 * auto-generates ordered lists of lead-author and co-author publications in
 * ./publications.html.
 *
 * Globals
 * -------
 * sections : The <section> tags in ./publications.html
 */

var sections = document.getElementsByTagName("section");
for (i = 0; i < sections.length; i++) generateList(sections[i]);


/*
 * Add the necessary to the section's innerHTML to produce the ordered list of
 * publications.
 *
 * Parameters
 * ----------
 * section : One of the <section> tags from the calling HTML script.
 */
function generateList(section) {

	/* 
	 * The files containing the data for each publication, keyed on by section
	 * ID from the calling HTML script.
	 */
	const files = {
		"pubs-lead-author": "./data/publications/leadauthor.json",
		"pubs-co-author": "./data/publications/coauthor.json"
	}

	readFile(files[section.id]).then(
		data => {
			/* 
			 * Incrementally create the added text as </ol> should be added
			 * at the end (JS will do it automatically now if this was done
			 * section.innerHTML += ...; at this point in the script.
			 */
			var HTML = `<ol>\n`;
			for (var i = 0; i < data.length; i++) {
				data[i]["authors"] = boldMyName(data[i]["authors"]);
				data[i]["refline"] = journalInfo(data[i]);
				HTML += `
<li class="pub-item">
	<a href="https://ui.adsabs.harvard.edu/abs/${data[i]["bibcode"]}/abstract"
		target="_blank"
		class="title">
		${data[i]["title"]}
	</a>
	<div class="authors">
		${data[i]["authors"]}
	</div>
	<div class="pub-details">
		<div class="journal">
			${data[i]["refline"]}
		</div>
		<div class="arxiv">
			arxiv:${data[i]["arxiv"]}
		</div>
	</div>
</li>`;
			}
			HTML += `</ol>`;
			section.innerHTML += HTML;
		}
	);

}


/*
 * Read the JSON data from a file of a given name.
 *
 * Parameters
 * ----------
 * filename : the name of the file
 *
 * Throws an Error if the file is not found.
 */
async function readFile(filename) {

	let response = await fetch(filename);
	if (response.ok) {
		var contents = await response.json();
		return contents;
	} else {
		throw new Error(`HTTP Error! Status: ${response.status}`);
	}

	return data;

}


/*
 * Bolds each instance of "Johnson J.W." in an author's list.
 *
 * Parameters
 * ----------
 * authors : a string of author names, as it will appear on the website, with
 * 		the exception of the bold formatting.
 */
function boldMyName(authors) {

	let myName = "Johnson J.W.";
	if (authors.includes(myName)) {
		let idx = authors.indexOf(myName);
		return authors.slice(0,
			idx) + "<strong>" + myName + "</strong>" + authors.slice(
			idx + myName.length);
	} else {
		return authors;
	}

}


/*
 * Piece together a string denoting the publication year, journal, and volume
 * and page number, if applicable. If there is no volume or page number, states
 * whether or not it is accepted for publication or under peer review.
 *
 * Parameters
 * ----------
 * publication : one of the array elements from the ./data/publications/*.json
 * 		file containing a given publication's metadata.
 */
function journalInfo(publication) {

	if (publication["volume"] != null && publication["page"] != null) {
		return `${publication["year"]}, ${publication["journal"]}, ${
			publication["volume"]}, ${publication["page"]}`
	} else if (publication["status"] === "accepted") {
		return `${publication["year"]}, accepted for publication in ${
			publication["journal"]}`;
	} else if (publication["status"] === "under peer review") {
		return `${publication["year"]}, submitted to ${
			publication["journal"]}, <em>under peer review</em>`;
	} else {
		throw new Error(`Internal Error! Unrecognized journal status: ${
			publication["status"]}`);
	}

}

