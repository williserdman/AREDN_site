import { db } from "$lib/database.js";
import { error, redirect } from "@sveltejs/kit";

// part of a data row
interface special {
	[attribute: string]: number;
}
// data row struct essentially
type DataRow = special & {
	createdAt: string;
	sensorID: string;
};

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const getData = async () => {
		// grabbing the attribute that was requested and sent to us in the url
		const requestedAttribute = params.attribute;

		try {
			// if its a number we definitely don't have that
			if (isNumeric(requestedAttribute)) {
				throw error(404);
			}

			// lets grab the data from our API
			const response = await fetch(`http://localhost:5000/out/sensors/${requestedAttribute}`);
			const rowsf = await response.json();

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
			const result: Record<string, { attribute: number[]; time: string[] }> = {};

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
			// if there's any error we just return 404
			error(404, { message: "Attribute not found!" });
		}
	};

	return {
		status: 200,
		oneAttributeData: await getData(), // await grabbing the data
		attributeName: params.attribute // pass back the attribute we just collected
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
