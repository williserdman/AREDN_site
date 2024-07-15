<script lang="ts">
	export let data;
	import { onMount, onDestroy } from "svelte";
	//import { LineController, LineElement, PointElement, LinearScale, Chart, CategoryScale} from 'chart.js';
	import Chart from "chart.js/auto";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	import "chartjs-adapter-date-fns";

	let { oneAttributeData, attributeName } = data;
	let chart: Chart | undefined;

	interface dataset {
		label: string;
		data: { x: Date; y: number }[];
		tension: number;
	}
	function createDatasets(): dataset[] {
		// grabbing the ids in the collected data
		let ids: string[] = [];
		let datasets: dataset[] = [];

		for (let key in oneAttributeData) {
			ids.push(key);
			const xValues: Date[] = [];
			//@ts-ignore
			oneAttributeData[key]["time"].forEach((t) => xValues.push(new Date(1 * t)));
			const yValues = oneAttributeData[key]["attribute"];

			const dataset = {
				label: key,
				data: xValues.map((x, index) => ({ x, y: yValues[index] })),
				tension: 0.2
			};

			// in theory will work, currently untested
			dataset.data = dataset.data.filter((pair) => pair.x >= startDate && pair.x <= endDate);

			dataset.data.length > 0 ? datasets.push(dataset) : {};
		}

		return datasets;
	}

	//Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);
	function createChart(ctx: HTMLCanvasElement, datasets: dataset[]) {
		//@ts-ignore
		chart = new Chart(ctx, {
			type: "line",
			data: {
				/* labels: stringTime, */
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
		const ctx = document.getElementById("myChart") as HTMLCanvasElement;
		createChart(ctx, createDatasets());
	}
	function destroyChart(): void {
		if (chart) {
			chart.destroy();
		}
	}

	let mounted = false;
	$: data,
		(() => {
			if (mounted) {
				destroyChart();

				({ oneAttributeData, attributeName } = data);

				setupChart();
			}
		})();

	onMount(() => {
		mounted = true;
		setupChart();
	});

	onDestroy(() => {
		destroyChart();
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
	}

	function formatDate(today: Date): string {
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
		const day = String(today.getDate()).padStart(2, "0");

		const formattedDate = `${year}-${month}-${day}`;
		return formattedDate;
	}
</script>

<div class="container mt-6">
	<canvas id="myChart"></canvas>
	{#if !chart}
		<div class="has-text-centered m-4 is-size-2">
			<p>Loading Data...</p>
		</div>
	{/if}

	<form action="">
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

<!--   <div>
    <div class="columns">
      <div class="column">
        <input type="range" class="slider" min="25" max="500" id="x-axis" bind:value={xwidth} >
      </div>
      <div class="column">
        <input type="text" bind:value={xwidth}>
      </div>
    </div>
  </div> -->
