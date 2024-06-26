
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<script lang="ts">
    import LinePlot from "$lib/LinePlot.svelte"
	//import "bulma"

    import * as d3 from 'd3';

    let data = d3.ticks(-2, 2, 200).map(Math.sin);

    function onMousemove(event: Event) {
		const [x, y] = d3.pointer(event);
    data = data.slice(-200).concat(Math.atan2(x, y));
  }
</script>

<div class="x-2">
	<LinePlot data={data}></LinePlot>
</div>
