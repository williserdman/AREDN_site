<script lang="ts">
    export let data;
    import { onMount, onDestroy } from 'svelte';
    //import { LineController, LineElement, PointElement, LinearScale, Chart, CategoryScale} from 'chart.js';
    import Chart from "chart.js/auto"
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher()
    import 'chartjs-adapter-date-fns';


    let { oneAttributeData, slug } = data;
    let chart: Chart | undefined;

    interface dataset {
        label: string;
        data: {x: Date, y: number}[];
        tension: number;
    }
    function createDatasets(): dataset[] {
        // grabbing the ids in the collected data
        console.log(oneAttributeData)
        let ids: string[] = []
        let datasets: dataset[] = []

        for (let key in oneAttributeData) {
            ids.push(key)
            const xValues: Date[] = []
            //@ts-ignore
            oneAttributeData[key]["time"].forEach((t) => xValues.push(new Date(1 * t)));
            const yValues = oneAttributeData[key]["attribute"]

            const dataset = {
                label: key,
                data: xValues.map((x, index) => ({x, y: yValues[index]})),
                tension: 0.2
            }

            // in theory will work, currently untested
            console.log(dataset);
            dataset.data = dataset.data.filter((pair) => pair.x >= startDate && pair.x <= endDate);

            (dataset.data.length > 0) ? datasets.push(dataset) : {}
        }

    return datasets;
    }

    //console.log(datasets)

    //Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);
    function createChart(ctx: HTMLCanvasElement, datasets: dataset[]) {
        //@ts-ignore
      chart = new Chart(ctx, {
        type: 'line',
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
          type: 'time', // Use 'time' scale for time-based x-axis
          time: {
            parser: 'iso', // Date format parser (ISO 8601)
            tooltipFormat: 'MMM d, HH:mm, yyyy', // Tooltip format
            displayFormats: {
                hour: 'MMM d, HH:mm', // Format for hourly labels
                day: 'MMM d',         // Format for daily labels
                month: 'MMM yyyy',    // Format for monthly labels
                year: 'yyyy'          // Format for yearly labels
            }
          },
          title: {
            display: true,
            text: 'Time' // X-axis label
          }
        },
          }
        }
      });
    }
  
    function setupChart(): void {
        const ctx = document.getElementById('myChart') as HTMLCanvasElement;
        createChart(ctx, createDatasets());
        console.log("chart created")
    }
    function destroyChart(): void {
        if (chart) {
        chart.destroy();
        console.log("destroying chart");
      }
    }

    let mounted = false;
    $: data, (() => {
        if (mounted) {
            destroyChart();

            ({ oneAttributeData, slug } = data);

            setupChart()
        }
        
    })();
  
    onMount(() => {
        mounted = true;
        setupChart();
    });
    
    onDestroy(() => {
        destroyChart();
    });
  
    type dateUTC = number;
    let startDate: Date = new Date(0);
    let endDate: Date = new Date(Date.now());
    let utcStart: dateUTC;
    let utcEnd: dateUTC;
    function changeDateRange(): void {
        if (typeof startDate === "string") {
            startDate = new Date(startDate);
        }
        if (typeof endDate === "string") {
            endDate = new Date(endDate);
        }
        
        if (startDate > endDate) { return }

        data = data; // chart will rerender
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
                <input type="date" bind:value={startDate}>
            </div>
            <div class="column">
                <p>End Date</p>
                <input type="date" bind:value={endDate}> 
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
  