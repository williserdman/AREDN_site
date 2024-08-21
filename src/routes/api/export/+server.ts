import { db } from "$lib/database.js";
import { AsyncParser } from "@json2csv/node";

export const GET = async ({ request }) => {
	//const stmt = db.prepare("SELECT * FROM sensor_data");
	//const info = stmt.all();
	const info = await (await fetch("http://127.0.0.1:5000/out/sensors/all")).json();

	//console.log(info);

	const parser = new AsyncParser();
	const csv = (await parser.parse(info).promise()) as any;

	return new Response(csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": 'attachment; filename="database.csv"'
		}
	});
};
