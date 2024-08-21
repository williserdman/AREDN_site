import { db } from "$lib/database.js";
import { fail } from "@sveltejs/kit";

export function load({}) {
	const stmt = db.prepare("SELECT * from sensor_configs");
	const configs = stmt.all();

	return {
		status: 200,
		configs
	};
}

export const actions = {
	update: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get("id");
		const config1: any = formData.get("config1");
		//const config1 = raw_config1 * 1;
		const config2 = formData.get("config2");

		fetch("http://127.0.0.1:5000/in/MeshtasticSensors/config", {
			method: "POST",
			body: JSON.stringify({
				payload: config2
			})
		});

		http: if (id === "" || config1 === "" || config2 === "") {
			return fail(400, {
				error: true,
				message: "All fields must have a value."
			});
		}

		const stmt = db.prepare(
			"INSERT or REPLACE into sensor_configs (sensorID, config1, config2) VALUES (?, ?, ?)"
		);
		stmt.run(id, config1, config2);

		return {
			success: true
		};
	}
};
