<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    export let dataset;

    let svg;

    onMount(() => {
        const width = 640;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 20, left: 40 };

        const x = d3.scaleLinear()
            .domain([0, dataset.length - 1])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain(d3.extent(dataset))
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .x((d, i) => x(i))
            .y(d => y(d));

        const svgElement = d3.select(svg)
            .attr("width", width)
            .attr("height", height);

        svgElement.append("path")
            .datum(dataset)
            .attr("fill", "none")
            .attr("stroke", "currentColor")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        svgElement.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svgElement.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));
    });
</script>

<svg bind:this={svg}></svg>
