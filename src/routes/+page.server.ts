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

		if (id === "" || config1 === "" || config2 === "") {
			return fail(400, {
				error: true,
				message: "All fields must have a value."
			});
		}

		console.log(id, config1, config2);

		return {
			success: true
		};
	}
};
