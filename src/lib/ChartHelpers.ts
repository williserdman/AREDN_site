export interface dataset {
	label: string;
	data: { x: Date; y: number }[];
	tension: number;
}

//Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);
export function createChart(ctx: HTMLCanvasElement, datasets: dataset[]) {
	//@ts-ignore
	chart = new Chart(ctx, {
		type: "line",
		data: {
			datasets: datasets
		},
		options: {
			scales: {
				y: {
					type: "linear",
					beginAtZero: true
				},
				x: {
					type: "time", // Use 'time' scale for time-based x-axis
					time: {
						parser: "iso", // Date format parser (ISO 8601)
						tooltipFormat: "MMM d, HH:mm, yyyy", // Tooltip format
						displayFormats: {
							hour: "MMM d, HH:mm", // Format for hourly labels
							day: "MMM d", // Format for daily labels
							month: "MMM yyyy", // Format for monthly labels
							year: "yyyy" // Format for yearly labels
						}
					},
					title: {
						display: true,
						text: "Time" // X-axis label
					}
				}
			}
		}
	});
}
