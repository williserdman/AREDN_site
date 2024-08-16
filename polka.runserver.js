import { handler } from "./build/handler.js";
import polka from "polka";
import compression from "@polka/compression";

const app = polka();

// https://stackoverflow.com/questions/24897801/enable-access-control-allow-origin-for-multiple-domains-in-node-js
// function to allow us to have multiple origins (AREDN and reg internet)
function fixCORSHeaders(req, res, next) {
	const allowedOrigins = ["http://aredn.williserdman.com", "http://raspberrypi.local.mesh"];
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}

	res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Credentials", true);
	return next();
}

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(fixCORSHeaders, handler, compression);
app.listen(3001, () => {
	console.log("listening on port 3001");
});
