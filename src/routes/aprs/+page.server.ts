//@ts-ignore
import path from "path";
//@ts-ignore
import fs from "fs";
import { fail } from "@sveltejs/kit";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

const getAllData = async () => {
	const filePath = path.resolve("2024-07-23.log"); // Adjust the path to your CSV file
	const fileContent = fs.readFileSync(filePath, "utf-8");

	return fileContent;
};

export async function load() {
	return {
		status: 200,
		info: await getAllData()
	};
}

export const actions = {
	callsign: async ({ request }) => {
		const formData = await request.formData();
		let id = formData.get("id");

		console.log(id);

		const filePath = path.resolve("2024-07-23.log"); // Adjust the path to your CSV file
		const fileContent = fs.readFileSync(filePath, "utf-8");

		if ((id as string) == "") {
			return {
				status: 404,
				info: await getAllData()
			};
		}

		const records = await new Promise<any[]>((resolve, reject) => {
			parse(
				fileContent,
				{
					columns: true, // Assuming the first row contains headers
					trim: true
				},
				(err, output) => {
					if (err) {
						reject(err);
					} else {
						resolve(output);
					}
				}
			);
		});

		id = id?.toString().toUpperCase() as string;
		const procRecs: any = [];
		records.map((r) => {
			r["name"] == id ? procRecs.push(r) : {};
		});

		if (procRecs.length <= 0) {
			return {
				status: 404,
				info: `no data for ${id}`
			};
		}

		// @ts-ignore
		const telems = procRecs.map((r) => r["telemetry"]);
		// @ts-ignore
		const times = procRecs.map((r) => r["utime"]);

		const csvString = await new Promise<string>((resolve, reject) => {
			stringify(
				procRecs,
				{
					header: true // Include headers in the output CSV
				},
				(err, output) => {
					if (err) {
						reject(err);
					} else {
						resolve(output);
					}
				}
			);
		});

		return {
			status: 200,
			info: csvString,
			id: id,
			telemetry: telems,
			times
		};
	}
};
