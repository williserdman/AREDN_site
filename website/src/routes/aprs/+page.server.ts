import type { Actions, RequestEvent } from "./$types";
import { fail } from "@sveltejs/kit";

// setting up a responder to the form
export const actions: Actions = {
	// we named the action ?/search, this is to match
	search: async ({ request, fetch }: RequestEvent) => {
		// getting the data that was passed in through the form
		const formData = await request.formData();

		// the html input element had the name "callsign"
		const callsign = formData.get("callsign");

		// if they don't pass one lets send an error
		if (!callsign) {
			return fail(400, { error: "Search query is required" });
		}

		// Perform your search logic here (e.g., fetch from an API)
		const searchResults = await fetch(`http://localhost:5001/out/callsign/${callsign}`);
		const data = searchResults.json();

		return {
			searchResults: await data
		};
	}
};
