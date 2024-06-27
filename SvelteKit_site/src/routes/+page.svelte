
<script lang="ts">
    import LinePlot from "$lib/components/LinePlot.svelte"
	import "bulma"
    import * as d3 from 'd3';
	import { onMount } from "svelte";

	//console.log(mockdata);

    //let data: any = undefined;// = d3.ticks(-2, 2, 200).map(Math.sin);

	let co2plot: LinePlot;
	let tempplot: LinePlot;
	let humplot: LinePlot;
	
	onMount(async () => {
        const mockdata = await d3.csv('/mock_data.csv');
        console.log(mockdata);

        // Assuming your CSV has a column named 'value' you want to plot
        let co2data = mockdata.map(d => +d["co2 (PPM)"]);
		co2plot.loadGraph(co2data);

		let tempdata = mockdata.map(d => +d["temperature (C)"]);
		tempplot.loadGraph(tempdata);

		let humdata = mockdata.map(d => +d["humidity (%%rH)"]);
		humplot.loadGraph(humdata);


    });

	let active = 0;
</script>

<div class="tabs is-centered is-boxed mt-4">
	<ul>
	  <li class:is-active={active === 0} on:click={() => active = 0}><a>CO2</a></li>
	  <li class:is-active={active === 1} on:click={() => active = 1}><a>Temperature</a></li>
	  <li class:is-active={active === 2} on:click={() => active = 2}><a>Hummidiy</a></li>
	</ul>
  </div>

<div class="m-2">
	{#if active === 0}
	<LinePlot bind:this={co2plot}></LinePlot>
	{:else if active === 1}
	<LinePlot bind:this={tempplot}></LinePlot>
	{:else}
	<LinePlot bind:this={humplot}></LinePlot>
	{/if}
</div>
