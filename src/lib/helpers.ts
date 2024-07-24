export function formatDate(today: Date): string {
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
	const day = String(today.getDate()).padStart(2, "0");

	const formattedDate = `${year}-${month}-${day}`;
	return formattedDate;
}
