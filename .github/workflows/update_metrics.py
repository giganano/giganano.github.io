#!/usr/bin/env python
r"""
This script queries the NASA ADS libraries with my lead- and co-author
publications and determines my up-to-date research metrics. This will
automatically update the values at (webpage home)/data/metrics.json with the
exception of "talks", which must be updated manually.

ARGV
----
1) The ADS API token associated with my account, stored in a github secret.
"""

from subprocess import Popen, PIPE
import json
import sys
import os

ALL_PAPERS_LIBID = "rIqfpNKmSdaOMIAhkk2VzQ"
LEAD_AUTHOR_PAPERS_LIBID = "go1WSseGTMeft2SxdESAgw"
COAUTHOR_PAPERS_LIBID = "sZkjSf_XRSKSRykqBe6B_w"

SUBPROC_KWARGS = {
	"stdout": PIPE,
	"stderr": PIPE,
	"shell": True,
	"text": True
}


def bibcodes(spec = "all"):
	r"""
	Get the list of bibcodes in a given ADS library.

	Parameters
	----------
	spec : ``str`` [default : "all"]
		Either "all", "first-author", or "co-author", denoting whether to query
		the library containing all papers, first-author papers, or co-author
		papers.

	Returns
	-------
	bibcodes : ``list``
		A ``list`` containing strings of the bibcodes of each paper in the
		corresponding library.
	"""
	cmd = """\
curl -H "Authorization: Bearer %s" \
https://api.adsabs.harvard.edu/v1/biblib/libraries/%s""" % (sys.argv[1],
	{
		"all": ALL_PAPERS_LIBID,
		"first-author": LEAD_AUTHOR_PAPERS_LIBID,
		"co-author": COAUTHOR_PAPERS_LIBID
	}[spec])

	while True:
		with Popen(cmd, **SUBPROC_KWARGS) as proc:
			out, err = proc.communicate()
			if not timedout(out):
				data = json.loads(out)
				break
			else:
				continue
	return data["documents"]


def updated_metrics():
	r"""
	Obtain all research metrics for all papers from the ADS API as a ``dict``

	Returns
	-------
	metrics : ``dict``
		A dictionary produced from the ADS API's returned JSON string.
	"""
	docs = bibcodes()
	cmd = """\
curl -H "Authorization: Bearer %s" -H "Content-type: application/json" \
https://api.adsabs.harvard.edu/v1/metrics \
-X POST -d '{"bibcodes": %s}'""" % (sys.argv[1], str(docs).replace('\'', '\"'))
	
	while True:
		with Popen(cmd, **SUBPROC_KWARGS) as proc:
			out, err = proc.communicate()
			if not timedout(out):
				metrics = json.loads(out)
				break
			else:
				continue
	return {
		"pubs": len(docs),
		"lead_author": len(bibcodes(spec = "first-author")),
		"co_author": len(bibcodes(spec = "co-author")),
		"citations": metrics["citation stats"]["total number of citations"],
		"hindex": metrics["indicators"]["h"]
	}


def current_metrics():
	r"""
	Read in the contents of (webpage home)/data/metrics.json as a dictionary.

	Returns
	-------
	metrics : ``dict``
		Current research metrics as stored. Contains an additional data item
		"talks" denoting the number of talks given which isn't determined from
		the ADS API. This value must be updated manually.
	"""
	with open("./data/metrics.json", 'r') as f:
		metrics = json.loads(f.read())
		f.close()
	metrics = metrics["data"]
	for item in metrics.keys(): metrics[item] = int(metrics[item])
	return metrics


def save_metrics():
	r"""
	Update the (webpage home)/data/metrics.json file if there are changes in
	the research metrics. Prints a message to stdout of "true" if there are
	changes detected and "false" otherwise so that the GitHub action which
	calls this script can know whether or not to add, commit, and push the
	changes.
	"""
	updated = updated_metrics()
	current = current_metrics()
	changed = False
	for metric in updated.keys(): changed |= updated[metric] != current[metric]
	if changed:
		sys.stdout.write("true\n")
		new = {"data": {}}
		for item in updated.keys(): new["data"][item] = str(updated[item])
		new["data"]["talks"] = str(current["talks"])
		with open("./data/metrics.json", 'w') as f:
			json.dump(new, f, indent = 4)
			f.close()
	else:
		sys.stdout.write("false\n")


def timedout(response):
	r"""
	Determine if the HTTP response by ADS was a 504 Gateway Time-out HTML page
	instead of the JSON formatted query response.
	This script will sipmly keep sending the query until it gets the JSON text
	it wants from ADS.
	"""
	result = "<html>" in response
	result &= "</html>" in response
	result &= "504 Gateway Time-out" in response
	return result


if __name__ == "__main__": save_metrics()

