<script>
// @ts-nocheck

  import * as d3 from 'd3';
	import { onMount } from 'svelte';
  
    let data;
    export let width = 640;
    export let height = 400;
    export let marginTop = 20;
    export let marginRight = 20;
    export let marginBottom = 20;
    export let marginLeft = 30;
    let svg = undefined;

    export function loadGraph(data) {
      
    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data))
      .range([height - marginBottom, marginTop]);

    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d));

    const svgEl = d3.select(svg);

    svgEl.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    svgEl.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x));

    svgEl.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y));
    
    }

  onMount(() => {
    if (!data) return

    loadGraph(data);
});

  </script>


  <svg width={width} height={height} bind:this={svg}></svg>