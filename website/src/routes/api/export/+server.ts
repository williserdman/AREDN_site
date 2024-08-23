import { AsyncParser } from "@json2csv/node";

export const GET = async ({ request }) => {
	// getting all the data from our API (meshtastic)
	const info = await (await fetch("http://localhost:5000/out/sensors/all")).json();

	// turning it into a csv
	const parser = new AsyncParser();
	const csv = (await parser.parse(info).promise()) as any;

	// returning that file to the user
	return new Response(csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": 'attachment; filename="database.csv"'
		}
	});
};
