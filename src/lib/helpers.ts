// theres a lot of similar looking code in this project that probably could've been avoided with prior planning but copy and paste works fine too
// here are some functions that are literally identical

import type { Chart } from "chart.js/auto";

// used when dealing with date inputs
export function formatDate(today: Date): string {
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
	const day = String(today.getDate()).padStart(2, "0");

	const formattedDate = `${year}-${month}-${day}`;

	// returns the date in the format YYYY-MM-DD
	return formattedDate;
}

// generic function that just transposes a matrix
export function transpose<T>(matrix: T[][]) {
	return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

// calls the destroy function on a chart if it exists
export function destroyChart(chart: Chart | undefined): void {
	if (chart) {
		chart.destroy();
	}
}
