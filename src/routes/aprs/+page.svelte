<script lang="ts">
	import { enhance } from "$app/forms";
	import { destroyChart, formatDate, transpose } from "$lib/helpers";

	// setting up the date ranges
	const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
	const tommorow = new Date(new Date().setDate(new Date().getDate() + 1));

	// converting those to a string
	let startDateString = formatDate(yesterday);
	let endDateString = formatDate(tommorow);

	// the data we need to get our chart working
	interface chartDataset {
		label: string;
		data: { x: number; y: number }[];
	}

	// takes in the data from the server and moves it into our datatype
	function createDatasets(allData: string[][]): chartDataset[] {
		let datasets: chartDataset[] = [];

		// stores only the transmission number
		const xValues = allData.map((el) => el[0]).map((val) => separateNumericFromUnits(val)?.value); // grabs the 0th index (transmission number)

		// dumping x values
		const data = allData.map((el) => el.splice(1));

		// all the values are in the same column, now they're all in the correct matrices
		/*
		the data from a transmission is [x, y1, y2, y3, y4], and we have a matrix of those
		[x, y1, y2, y3, y4]	
		[x, y1, y2, y3, y4]
		[x, y1, y2, y3, y4]
		[x, y1, y2, y3, y4]
		
		it would be easier to graph it it was like
		* we already have the x values array
		[y1, y1, y1, y1, y1]
		[y2, y2, y2, y2, y2]
		....
		*/
		const yValues = transpose<string>(data);
		console.log(yValues);

		// for each element in the list lets extract it and format it to chartDataset
		for (let i = 0; i < yValues.length - 1; i++) {
			// the values as an object with { value: number, unit: string}
			const y = yValues[i].map((el) => separateNumericFromUnits(el));

			// initializing the object we're working on
			datasets[i] = { label: "", data: [] };

			// set the label
			datasets[i].label = y[0]?.unit!;

			// extracting the numeric value
			const vals = y.map((el) => el?.value);

			// adding them to our data structure
			const combinedArray = vals.map((val, index) => {
				return { x: xValues[index]!, y: val! }; // just forcing that these wont be undefined
			});
			datasets[i].data = combinedArray;
		}

		return datasets;
	}

	// helper function to take in a string and return a number and units or null
	function separateNumericFromUnits(input: string): { value: number; unit: string } | null {
		// here's our regex pattern
		const pattern = /^([-+]?\d*\.?\d+)([a-zA-Z%]+)$/;
		const match = input.match(pattern);
		console.log(match);

		if (match) {
			return {
				// Converts the numeric part to a number
				value: parseFloat(match[1]),
				// The unit part as a string
				unit: match[2]
			};
		} else {
			// Return null if the input doesn't match the expected format
			return null;
		}
	}

	// grabbing the results: this is how we grab what +page.server.ts has sent us as a form response
	export let form;
	// bound to HTML element on page load: these are the canvases that we want to graph on
	let myCanvases: HTMLCanvasElement[] = [];
	let searchResults: any;
	$: form, // the $ is svelte syntax for "on change"
		(() => {
			// we are going to grab the searchResults from the form object
			searchResults = form?.searchResults;

			// if they exist
			if (searchResults) {
				// getting rid of the callsign as we don't need to graph
				searchResults = dropCallsign(searchResults);

				// this will get our graphs going
				const dfs = createDatasets(searchResults);
				console.log(dfs);
				setupCharts(myCanvases, dfs);
			}
		})();

	import Chart from "chart.js/auto";
	import { onDestroy } from "svelte";
	// the code to set up a single chart
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
								text: dataset.label, // this is the y-label axis could be changed to longform (eg. "Voltage")
								display: true
							}
						},
						x: {
							title: {
								text: "Transmission number",
								display: true
							}
						}
					}
				}
			});
			return chart;
		}
	}

	let myCharts: Chart<"line", { x: number; y: number }[], number>[] | undefined[] = [];
	// function thtat will create a chart for each of our canvases
	function setupCharts(ctxs: HTMLCanvasElement[], allData: chartDataset[]) {
		for (let i = 0; i < ctxs.length; i++) {
			myCharts[i] = createChart(ctxs[i], allData[i]);
		}
	}

	// helper function that takes out the callsign from the retunred array
	function dropCallsign(list: string[][]) {
		return list.map((el) => el.slice(1));
	}

	function destroyAllCharts() {
		myCanvases.forEach((el, i) => destroyChart(myCharts[i]));
	}

	onDestroy(() => {
		destroyAllCharts();
	});
</script>

<svelte:head>
	<title>APRS Data by Callsign</title>
</svelte:head>

<!-- start of html -->
<main>
	<!-- form setup -->
	<div class="container mx-auto my-auto">
		<!-- svlete setup for form actions: will send a request to +page.server.ts when submitted -->
		<form
			action="?/search"
			method="POST"
			use:enhance={() => {
				return async ({ update }) => {
					update({ reset: false }); // this just prevents the values from being cleared when submitted
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

	<!-- these are our charts, they'll not be visible before the call -->
	<div>
		<div class="fixed-grid has-2-cols">
			<div class="grid">
				<div class="cell">
					<canvas bind:this={myCanvases[0]}></canvas>
				</div>
				<div class="cell">
					<canvas bind:this={myCanvases[1]}></canvas>
				</div>
				<div class="cell">
					<canvas bind:this={myCanvases[2]}></canvas>
				</div>
				<div class="cell">
					<canvas bind:this={myCanvases[3]}></canvas>
				</div>
			</div>
		</div>
	</div>
</main>
