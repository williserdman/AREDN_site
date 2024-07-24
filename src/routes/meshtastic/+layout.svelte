<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	let active = 0;
	const paths = [
		"/meshtastic",
		"/meshtastic/CO2",
		"/meshtastic/temperature",
		"/meshtastic/humidity"
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
			<li class:is-active={active === 0} on:click={() => (active = 0)}>
				<a href="/meshtastic" data-sveltekit-preload-data data-sveltekit-preload-code>Admin Panel</a
				>
			</li>
		</ul>
	</div>
</nav>

<slot></slot>
