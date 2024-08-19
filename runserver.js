import { handler } from "./build/handler.js";
import compression from "@polka/compression";
import express from "express";

const app = express();

// https://stackoverflow.com/questions/24897801/enable-access-control-allow-origin-for-multiple-domains-in-node-js
// function to allow us to have multiple origins (AREDN and reg internet)
function fixCORSHeaders(req, res, next) {
	const allowedOrigins = [
		"http://aredn.williserdman.com",
		"http://raspberrypi.local.mesh",
		"https://aredn.williserdman.com"
	];

	const origin = req.headers.origin;
	console.log(origin);

	if (allowedOrigins.includes(origin)) {
		process.env["ORIGIN"] = origin;
	}

	return next();
}

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(fixCORSHeaders, handler, compression);
app.listen(3001, () => {
	console.log("listening on port 3001");
});
