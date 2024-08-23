import { handler } from "./build/handler.js";
import compression from "@polka/compression";
import express from "express";

const app = express();

// https://stackoverflow.com/questions/24897801/enable-access-control-allow-origin-for-multiple-domains-in-node-js
// function to allow us to have multiple origins (AREDN and reg internet)
function fixCORSHeaders(req, res, next) {
	const allowedOrigins = [
		// not configured!! see below if statement and checkOrigin attribute in svelte.config.js
		"http://aredn.williserdman.com",
		"http://raspberrypi.local.mesh",
		"https://aredn.williserdman.com",
		"http://10.57.247.122:3001"
	];

	const origin = req.headers.origin;
	console.log(origin);

	/* if (allowedOrigins.includes(origin)) {
		process.env["ORIGIN"] = origin;
	} */

	// WARNING: currently all origins are allowed
	process.env["ORIGIN"] = origin;

	return next();
}

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(fixCORSHeaders, handler, compression);
app.listen(3001, () => {
	console.log("listening on port 3001");
});
