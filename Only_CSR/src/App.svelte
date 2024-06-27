<script lang="ts">
  import Chart from './lib/Chart.svelte';
  import "bulma";

  let active = 0;
  let data: { co2?: number[], temperature?: number[], humidity?: number[], time?: string[] } | null = null;
  let recent_data: { co2?: number[], temperature?: number[], humidity?: number[], time?: string[] } | null = null;
  let live_data: number[] | null = null;
  let HOURS_TO_DISPLAY = 25;

  async function getData() {
    try {
      const data_request = await fetch("/all-historic");
      data = await data_request.json();
      if (data !== null && hasProperty(data, "time")) {
        let length = data["time"]?.length!
        recent_data = data;
        if (length > HOURS_TO_DISPLAY) {
          recent_data["co2"] = data["co2"]?.slice(HOURS_TO_DISPLAY);
          recent_data["temperature"] = data["temperature"]?.slice(HOURS_TO_DISPLAY);
          recent_data["humidity"] = data["humidity"]?.slice(HOURS_TO_DISPLAY);
          recent_data["time"] = data["time"]?.slice(HOURS_TO_DISPLAY);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      data = null;
    }
  }

  async function getLiveData() {
    try {
      const data_request = await fetch("/raw-live");
      live_data = await data_request.json();
      //console.log(live_data)
    } catch (error) {
      console.error("Error fetching live data:", error);
      live_data = null;
    } 
  }

  getData();
  getLiveData();

  // Helper function to check if an object has a property
  function hasProperty(obj: any, key: string): boolean {
    return obj.hasOwnProperty(key);
  }
</script>

<div>
  <div class="tabs is-centered is-boxed mb-6">
    <ul>
      <li class:is-active={active === 0} on:click={() => active = 0}><a>CO2</a></li>
      <li class:is-active={active === 1} on:click={() => active = 1}><a>Temperature</a></li>
      <li class:is-active={active === 2} on:click={() => active = 2}><a>Humidity</a></li>
    </ul>
  </div>

  <div>
    {#if recent_data !== null && hasProperty(data, "time")}
      {#if active === 0 && hasProperty(recent_data, "co2")}
        <Chart data={recent_data["co2"]} labels={recent_data["time"]}/>
      {:else if active === 1 && hasProperty(recent_data, "temperature")}
        <Chart data={recent_data["temperature"]} labels={recent_data["time"]}/>
      {:else if active === 2 && hasProperty(recent_data, "humidity")}
        <Chart data={recent_data["humidity"]} labels={recent_data["time"]}/>
      {:else}
        <div>No data available for selected category.</div>
      {/if}
    {:else}
      <div>Issue getting the data</div>
    {/if}
  </div>
  
  <div class="container mt-6">
    <div class="title">Current Readings</div>
    {#if live_data !== null}
    <div class="grid">
      <div class="cell">
        <div class="box">
          <div class="title is-4">CO2 Level</div>
          <p>{live_data[0]}</p>
        </div>
      </div>
      <div class="cell">
        <div class="box">
          <div class="title is-4">Temperature</div>
          <p>{live_data[1]}</p>
        </div>
      </div>
      <div class="cell">
        <div class="box">
          <div class="title is-4">Humidity</div>
          <p>{live_data[2]}</p>
        </div>
      </div>
      <div class="cell">
        <div class="box">
          <a href="/mega-csv" class="button">Download CSV</a>
          <a href="/all-historic" class="button">Download JSON</a>
        </div>
      </div>
    </div>
    {/if}
  </div>
</div>
