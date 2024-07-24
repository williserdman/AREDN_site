<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import Chart from "chart.js/auto";

	export let data: {
		projectName: string;
		sequence: number;
		time: string;
		channels: { name: string; value: number; unit: string }[];
	}[];

	const charts: Chart[] = [];
	function createChart(canvas: HTMLCanvasElement, channelIndex: number) {
		console.log(data.map((dp) => dp.channels[channelIndex].value));
		if (canvas) {
			console.log("creating chart");
			const chart = new Chart(canvas, {
				type: "line",
				data: {
					labels: data.map((dp) => dp.time),
					datasets: [
						{
							label: data[0].channels[channelIndex].name,
							data: data.map((dp) => dp.channels[channelIndex].value),
							backgroundColor: "rgba(75, 192, 192, 0.2)",
							borderColor: "rgba(75, 192, 192, 1)",
							borderWidth: 1
						}
					]
				},
				options: {
					scales: {
						y: {
							beginAtZero: true,
							title: {
								text: data[0].channels[channelIndex].unit,
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
			charts.push(chart);
		}
	}

	let chartCanvas1: HTMLCanvasElement | null = null;
	let chartCanvas2: HTMLCanvasElement | null = null;
	let chartCanvas3: HTMLCanvasElement | null = null;
	let chartCanvas4: HTMLCanvasElement | null = null;
	let chartCanvas5: HTMLCanvasElement | null = null;
	onMount(() => {
		try {
			createChart(chartCanvas1!, 0);
			createChart(chartCanvas2!, 1);
			createChart(chartCanvas3!, 2);
			createChart(chartCanvas4!, 3);
			createChart(chartCanvas5!, 4);
		} catch {
			// if there is no channel this will throw an error
		}
	});

	// Clean up chart instance on component destruction
	onDestroy(() => {
		charts.forEach((chart) => chart.destroy());
	});
</script>

<div>
	<h1>{data[0].projectName}</h1>
	<div>
		<canvas bind:this={chartCanvas1}></canvas>
		<canvas bind:this={chartCanvas2}></canvas>
		<canvas bind:this={chartCanvas3}></canvas>
		<canvas bind:this={chartCanvas4}></canvas>
		<canvas bind:this={chartCanvas5}></canvas>
	</div>
</div>
