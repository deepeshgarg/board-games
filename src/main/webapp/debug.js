debugon = true;
function dbg (msg, opts) {
	if(opts) {
		if (opts.on) {
			alert (msg);
		}
	} else if (debugon) {
		alert (msg);
	}
}
