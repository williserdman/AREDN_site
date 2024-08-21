<script lang="ts">
	import { enhance } from "$app/forms";
	import { formatDate } from "$lib/helpers";

	// setting up the date ranges
	const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)); // appearently not that efficient
	const tommorow = new Date(new Date().setDate(new Date().getDate() + 1));
	let startDateString = formatDate(yesterday);
	let endDateString = formatDate(tommorow);

	function transpose<T>(matrix: T[][]) {
		return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
	}

	interface chartDataset {
		label: string;
		data: { x: number; y: number }[];
	}

	function createDatasets(allData: string[][]): chartDataset[] {
		// grabbing the ids in the collected data
		let datasets: chartDataset[] = [];

		const xValues = allData.map((el) => el[0]).map((val) => separateNumericFromUnits(val)?.value); // grabs the 0th index (transmission number)

		// dumping x values
		const data = allData.map((el) => el.splice(1));

		// all the values are in the same column, now they're all in the correct matrices
		const yValues = transpose<string>(data);
		console.log(yValues);

		for (let i = 0; i < yValues.length - 1; i++) {
			const y = yValues[i].map((el) => separateNumericFromUnits(el));
			console.log(y);
			console.log(y[0]?.unit!);
			datasets[i] = { label: "", data: [] }; // initializing the object
			datasets[i].label = y[0]?.unit!;
			const vals = y.map((el) => el?.value);
			const combinedArray = vals.map((val, index) => {
				return { x: xValues[index]!, y: val! }; // just forcing that these wont be undefined
			});
			datasets[i].data = combinedArray;
		}

		return datasets;
	}

	function separateNumericFromUnits(input: string) {
		const pattern = /^([-+]?\d*\.?\d+)([a-zA-Z%]+)$/;
		const match = input.match(pattern);

		if (match) {
			return {
				value: parseFloat(match[1]), // Converts the numeric part to a number
				unit: match[2] // The unit part as a string
			};
		} else {
			return null; // Return null if the input doesn't match the expected format
		}
	}

	// grabbing the results
	export let form;
	let myCanvases: HTMLCanvasElement[] = []; // bound to HTML element on page load
	let searchResults: any;
	$: form,
		(() => {
			//console.log(form);
			searchResults = form?.searchResults;

			if (searchResults) {
				searchResults = dropCallsign(searchResults);

				console.log(myCanvases);
				setupCharts(myCanvases, createDatasets(searchResults));
				console.log("charts up");
			}
		})();

	import Chart from "chart.js/auto";
	function createChart(canvas: HTMLCanvasElement, dataset: chartDataset) {
		if (canvas) {
			const chart = new Chart(canvas, {
				type: "line",
				data: {
					labels: dataset.data.map((v) => v.x),
					datasets: [dataset]
				},
				options: {
					scales: {
						y: {
							beginAtZero: true,
							title: {
								text: dataset.label,
								display: true
							}
						},
						x: {
							title: {
								text: "UTC",
								display: true
							}
						}
					},
					plugins: {
						/* 						tooltip: {
							callbacks: {
								label: (context: any) => {
									const channel = data.channels[context.dataIndex];
									return `${channel.name}: ${channel.value} ${channel.unit}`;
								}
							}
						} */
					}
				}
			});
			return chart;
		}
	}

	function setupCharts(ctxs: HTMLCanvasElement[], allData: chartDataset[]) {
		for (let i = 0; i < ctxs.length; i++) {
			createChart(ctxs[i], allData[i]);
		}
	}

	function dropCallsign(list: string[][]) {
		return list.map((el) => el.slice(1));
	}
</script>

<main>
	<div class="container mx-auto my-auto">
		<form
			action="?/search"
			method="POST"
			use:enhance={() => {
				return async ({ update }) => {
					update({ reset: false });
				};
			}}
			class="columns has-text-centered"
		>
			<div class="column">
				<p>Start Date</p>
				<input name="startDate" type="date" value={startDateString} />
			</div>
			<div class="column">
				<p>End Date</p>
				<input type="date" name="endDate" value={endDateString} />
			</div>
			<div class="column">
				<input type="text" class="input mt-3" name="callsign" placeholder="callsign" />
			</div>
			<div class="column is-centered mt-3">
				<button class="button is-primary" type="submit">Go</button>
			</div>
		</form>
	</div>

	{#if true}
		{#each { length: 4 /* the 0th index is the transmission number which we are going to place on the x-axis (last index is timestamp which we are not using rn) */ } as _, i}
			<canvas bind:this={myCanvases[i]}></canvas>
		{/each}
	{/if}
</main>
