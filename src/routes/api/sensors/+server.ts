import { db } from "$lib/database.js";

export const POST = async ({ request }) => {
	const body = await request.json();
	const authHeader = request.headers.get("Authorization");

	if (authHeader != "willis_is_cool") {
		return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
	}

	const stmt = db.prepare(
		"INSERT INTO sensor_data (sensorID, CO2, temperature, humidity, createdAt) VALUES (?, ?, ?, ?, ?)"
	);
	const info = stmt.run(
		body["sensorID"],
		body["CO2"],
		body["temperature"],
		body["humidity"],
		Date.now()
	);

	const config = getConfig(body["sensorID"]);
	console.log(config);

	return new Response(JSON.stringify(config), { status: 200 });
};

function getConfig(id: string) {
	try {
		const stmt = db.prepare(
			`INSERT INTO sensor_configs (sensorID, config1, config2) VALUES (?, ?, ?)`
		);
		const config = stmt.run(id, DEFAULT_CONFIG.config1, DEFAULT_CONFIG.config2);

		console.log("New entry created successfully");
	} catch (e) {
		console.log("Value already in table.");
	}

	const stmt = db.prepare(`SELECT * FROM sensor_configs WHERE sensorID='${id}'`);
	const config = stmt.all();

	console.log("Config fetched successfully.");
	return config;
}

const DEFAULT_CONFIG = {
	config1: "seven",
	config2: 7
};
