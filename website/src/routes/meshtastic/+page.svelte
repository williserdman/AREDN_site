<script lang="ts">
	export let data;
	//export let form;
	import { enhance } from "$app/forms";

	interface configObject {
		sensorID: string;
		config1: number;
		config2: string;
	}

	//@ts-ignore
	const { configs }: { configs: configObject[] } = data;

	async function downloadCSV() {
		const response = await fetch("/api/export");
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.style.display = "none";
		a.href = url;
		a.download = "database.csv";
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		return;
	}
</script>

<svelte:head>
	<title>Meshtastic Sensor Collection</title>
</svelte:head>

{#each configs as config}
	<div class="container">
		<div class="title is-size-4 mt-5 mb-2">{config.sensorID}</div>
		<form method="POST" action="?/update">
			<div>
				<input type="hidden" hidden value={config.sensorID} name="id" />
			</div>
			<div>
				<label for="" class="label">config1</label>
				<input type="text" class="input" name="config1" value={config.config1} />
			</div>
			<div>
				<label for="" class="label">config2</label>
				<input type="text" class="input" name="config2" value={config.config2} />
			</div>
			<div class="m-2">
				<button class="button is-primary">Update</button>
			</div>
		</form>
	</div>
{/each}
<div class="container">
	<div class="title is-2 mt-5 mb-2">MANUAL SETUP</div>
	<form action="?/update" method="POST">
		<div>
			<lable class="label">Sensor ID</lable>
			<input type="text" class="input" name="id" />
		</div>
		<div>
			<label for="" class="label">config1</label>
			<input type="text" class="input" name="config1" />
		</div>
		<div>
			<label for="" class="label">config2</label>
			<input type="text" class="input" name="config2" />
		</div>
		<div class="m-2">
			<button class="button is-primary">Update</button>
		</div>
	</form>
</div>

<div class="container">
	<h1 class="title is-2 mt-5">utils</h1>
	<button class="button is-primary" on:click={() => downloadCSV()}>download csv</button>
</div>
