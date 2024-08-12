<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	let active = 0;
	const paths = [
		"/meshtastic",
		"/meshtastic/CO2",
		"/meshtastic/temperature",
		"/meshtastic/humidity",
		"/meshtastic/temp2",
		"/meshtastic/hum2",
		"/meshtastic/pressure",
		"/meshtastic/altitude",
		"/meshtastic/gas"
	];

	onMount(() => {
		const path = window.location.pathname;
		console.log(path);
		active = paths.indexOf(path);
	});
</script>

<nav>
	<div class="tabs is-centered is-boxed m-6">
		<ul>
			<li class:is-active={active === 1} on:click={() => (active = 1)}>
				<a href="/meshtastic/CO2" data-sveltekit-preload-data data-sveltekit-preload-code>CO2</a>
			</li>
			<li
				class:is-active={active === 2}
				on:click={() => {
					active = 2;
				}}
			>
				<a href="/meshtastic/temperature" data-sveltekit-preload-data data-sveltekit-preload-code
					>Temperature</a
				>
			</li>
			<li
				class:is-active={active === 3}
				on:click={() => {
					active = 3;
				}}
			>
				<a href="/meshtastic/humidity" data-sveltekit-preload-data data-sveltekit-preload-code
					>Humidity</a
				>
			</li>
			<li
				class:is-active={active === 3}
				on:click={() => {
					active = 4;
				}}
			>
				<a href="/meshtastic/temp2" data-sveltekit-preload-data data-sveltekit-preload-code>Temp2</a
				>
			</li>
			<li
				class:is-active={active === 3}
				on:click={() => {
					active = 5;
				}}
			>
				<a href="/meshtastic/hum2" data-sveltekit-preload-data data-sveltekit-preload-code>Hum2</a>
			</li>
			<li
				class:is-active={active === 3}
				on:click={() => {
					active = 6;
				}}
			>
				<a href="/meshtastic/pressure" data-sveltekit-preload-data data-sveltekit-preload-code
					>Pressure</a
				>
			</li>
			<li
				class:is-active={active === 3}
				on:click={() => {
					active = 7;
				}}
			>
				<a href="/meshtastic/altitude" data-sveltekit-preload-data data-sveltekit-preload-code
					>Altitude</a
				>
			</li>
			<li
				class:is-active={active === 3}
				on:click={() => {
					active = 8;
				}}
			>
				<a href="/meshtastic/gas" data-sveltekit-preload-data data-sveltekit-preload-code>Gas</a>
			</li>
			<li class:is-active={active === 0} on:click={() => (active = 0)}>
				<a href="/meshtastic" data-sveltekit-preload-data data-sveltekit-preload-code>Admin Panel</a
				>
			</li>
		</ul>
	</div>
</nav>

<slot></slot>
