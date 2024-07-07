<script>
    import "bulma";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let active = 0;
    const paths = ["/", "/CO2", "/temperature", "/humidity"]

    onMount(() => {
        const path = window.location.pathname;
        active = paths.indexOf(path);
    })
    
</script>

<nav>
    <div class="tabs is-centered is-boxed m-6">
        <ul>
          <li class:is-active={active === 1} on:click={() => active = 1}><a href="/CO2" data-sveltekit-preload-data>CO2</a></li>
          <li class:is-active={active === 2} on:click={() => {active = 2}}><a href="/temperature" data-sveltekit-preload-data>Temperature</a></li>
          <li class:is-active={active === 3} on:click={() => {active = 3}}><a href="/humidity" data-sveltekit-preload-data>Humidity</a></li>
          <li class:is-active={active === 0} on:click={() => active = 0}><a href="/" data-sveltekit-preload-data>Admin Panel</a></li>
        </ul>
      </div>
</nav>

<slot></slot>