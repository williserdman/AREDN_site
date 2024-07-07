<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { LineController, LineElement, PointElement, LinearScale, Chart, CategoryScale} from 'chart.js';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher()
   
  
    let chart: Chart | undefined;
    export let labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
    export let data = [655656, 19, 3, 5, 2, 3];
  
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);
  
    function createChart(ctx: HTMLCanvasElement) {
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: "Sensor Reading",
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    let ctx: HTMLCanvasElement;
  
    onMount(() => {
      ctx = <HTMLCanvasElement>document.getElementById('myChart');
      createChart(ctx)
    });
  
    $: data, chart?.destroy(), createChart(ctx);
  
    onDestroy(() => {
      if (chart) {
        chart.destroy();
      }
    });
  
    let xwidth = 25
    $: {
      dispatch('widthchange', {
              text: xwidth
          });
    }
  </script>
  
  <canvas id="myChart"></canvas>
  <div>
    <div class="columns">
      <div class="column">
        <input type="range" class="slider" min="25" max="500" id="x-axis" bind:value={xwidth} >
      </div>
      <div class="column">
        <input type="text" bind:value={xwidth}>
      </div>
    </div>
    
  
  </div>
  