<script lang="ts">
	export let data; // on page load we will call +page.Server.ts load function and the return value will be data
	import { onMount, onDestroy } from "svelte";
	import Chart from "chart.js/auto";
	import { formatDate } from "$lib/helpers.js";
	import "chartjs-adapter-date-fns";

	// so lets extract the data
	let { oneAttributeData, attributeName }: { oneAttributeData: any; attributeName: string } = data;
	let chart: Chart<any> | undefined;

	interface dataset {
		label: string;
		data: { x: Date; y: number }[];
		tension: number;
	}

	// mess with our data a little bit so that we can graph them
	function createDatasets(): dataset[] {
		// grabbing the ids in the collected data
		let ids: string[] = [];
		let datasets: dataset[] = [];

		// our data can come from multiple sensors so we want to have each sensor be its own "dataset"
		for (let key in oneAttributeData) {
			ids.push(key);
			const xValues: Date[] = [];

			// we want the date along the x axis
			//@ts-ignore
			oneAttributeData[key]["time"].forEach((t) => xValues.push(new Date(parseFloat(t))));
			const yValues = oneAttributeData[key]["attribute"];

			const dataset = {
				label: key,
				data: xValues.map((x, index) => ({ x, y: yValues[index] })),
				tension: 0.2
			};

			// makes sure that the data is within the range the user specified
			dataset.data = dataset.data.filter((pair) => pair.x >= startDate && pair.x <= endDate);

			datasets.push(dataset);
		}

		return datasets;
	}

	function createChart(ctx: HTMLCanvasElement, datasets: dataset[]) {
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

	function setupChart(): void {
		// grabbing our canvas element
		const ctx = document.getElementById("myChart") as HTMLCanvasElement;

		// using said element and plotting the data
		createChart(ctx, createDatasets());
	}

	import { destroyChart } from "$lib/helpers.js";

	let mounted = false;
	$: data, // when data changes (like an update fro the server, or change in date range)
		(() => {
			if (mounted) {
				// if we are mounted in the user's browser
				destroyChart(chart);

				({ oneAttributeData, attributeName } = data); //unspead the data again

				// then setup the chart again (we just destroyed it)
				setupChart();
			}
		})();

	onMount(() => {
		mounted = true;
		setupChart();
	});

	onDestroy(() => {
		destroyChart(chart);
	});

	// setting the dates to be one day apart
	const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)); // appearently not that efficient
	const tommorow = new Date(new Date().setDate(new Date().getDate() + 1));

	type dateString = string;
	let startDate: Date;
	let endDate: Date;
	let stringDateStart: dateString = formatDate(yesterday);
	let stringDateEnd: dateString = formatDate(tommorow);
	changeDateRange();

	function changeDateRange(): void {
		startDate = new Date(stringDateStart);
		endDate = new Date(stringDateEnd);

		if (startDate > endDate) {
			return;
		}

		data = data; // chart will rerender
		console.log(data);
	}

	import { capitalizeFirstLetter } from "$lib/helpers.js";
</script>

<svelte:head>
	<title>{capitalizeFirstLetter(attributeName)} - Meshtastic Sensor Collection</title>
</svelte:head>

<div class="container mt-6">
	<canvas id="myChart"></canvas>
	{#if !chart}
		<div class="has-text-centered m-4 is-size-2">
			<p>Loading Data...</p>
		</div>
	{/if}

	<form>
		<!-- this will only make changes in the users side so we don't need to send it to server -->
		<div class="columns has-text-centered">
			<div class="column">
				<p>Start Date</p>
				<input type="date" bind:value={stringDateStart} />
			</div>
			<div class="column">
				<p>End Date</p>
				<input type="date" bind:value={stringDateEnd} />
			</div>
			<div class="column is-centered">
				<button class="button is-primary" on:click={changeDateRange}>Go</button>
			</div>
		</div>
	</form>
</div>
