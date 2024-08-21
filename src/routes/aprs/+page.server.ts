import type { Actions, RequestEvent } from "./$types";
import { fail } from "@sveltejs/kit";

export async function load() {
	return { searchResults: null };
}

export const actions: Actions = {
	search: async ({ request, fetch }: RequestEvent) => {
		const formData = await request.formData();
		const callsign = formData.get("callsign");

		if (!callsign) {
			return fail(400, { error: "Search query is required" });
		}

		// Perform your search logic here (e.g., fetch from an API)
		const searchResults = await fetch(`http://127.0.0.1:5001/out/callsign/${callsign}`);
		const data = await searchResults.json();
		//console.log(data);

		return {
			searchResults: data
		};
	}
};
