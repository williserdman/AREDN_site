import { db } from "$lib/database.js";
import { error, redirect } from "@sveltejs/kit";

interface special {
	[attribute: string]: number;
}

type DataRow = special & {
	createdAt: string;
	sensorID: string;
};

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const getData = async () => {
		const requestedAttribute = params.attribute;

		try {
			if (isNumeric(requestedAttribute)) {
				throw error(404);
			}

			const response = await fetch(`http://10.200.242.238:5000/out/sensors/${requestedAttribute}`);
			const rowsf = await response.json();
			// Example input array

			// Function to convert the array of arrays into DataRow objects
			const transformData = (data: string[][]): DataRow[] => {
				//@ts-ignore
				return data.map(([sensorID, attribute, timestamp]) => ({
					sensorID: sensorID.toString(),
					[requestedAttribute]: parseFloat(attribute), // Assuming the attribute should be numeric
					createdAt: parseFloat(timestamp) * 1000 // Convert UNIX timestamp to ISO string
				})) as unknown as DataRow;
			};

			const transformedData = transformData(rowsf);

			const stmt = db.prepare(`SELECT sensorID, ${requestedAttribute}, createdAt FROM sensor_data`);
			const rows = <DataRow[]>stmt.all();

			const result: Record<string, { attribute: number[]; time: string[] }> = {};

			//@ts-ignore
			for (const row of transformedData) {
				const { sensorID: id, [requestedAttribute]: attribute, createdAt: time } = row as DataRow;

				if (!result[id]) {
					result[id] = { attribute: [], time: [] };
				}

				result[id].attribute.push(attribute);
				result[id].time.push(time);
			}

			return result;
		} catch (e) {
			console.log(e);
			error(404, { message: "Attribute not found!" });
		}
	};

	return {
		status: 200,
		oneAttributeData: await getData(),
		attributeName: params.attribute
	};
}

function isNumeric(str: string) {
	if (typeof str != "string") return false; // we only process strings!

	return (
		//@ts-ignore
		!isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!isNaN(parseFloat(str))
	); // ...and ensure strings of whitespace fail
}
