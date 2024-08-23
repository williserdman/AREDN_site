import { d as db } from './database-DX5yD0gH.js';
import 'better-sqlite3';

const POST = async ({ request }) => {
  const body = await request.json();
  const authHeader = request.headers.get("Authorization");
  if (authHeader != "willis_is_cool") {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
  }
  const stmt = db.prepare(
    "INSERT INTO sensor_data (sensorID, CO2, temperature, humidity, temp2, hum2, pressure, altitude, gas, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  stmt.run(
    body["sensorID"],
    body["CO2"],
    body["temperature"],
    body["humidity"],
    body["temp2"],
    body["hum2"],
    body["pressure"],
    body["altitude"],
    body["gas"],
    Date.now()
  );
  const config = getConfig(body["sensorID"]);
  return new Response(JSON.stringify(config), { status: 200 });
};
function getConfig(id) {
  try {
    const stmt2 = db.prepare(
      `INSERT INTO sensor_configs (sensorID, config1, config2) VALUES (?, ?, ?)`
    );
    const config2 = stmt2.run(id, DEFAULT_CONFIG.config1, DEFAULT_CONFIG.config2);
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

export { POST };
//# sourceMappingURL=_server.ts-BE6BUFD5.js.map
