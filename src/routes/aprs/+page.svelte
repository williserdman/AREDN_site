<script lang="ts">
	import { enhance } from "$app/forms";
	import Graphs from "$lib/components/APRSGraphs.svelte";
	import { formatDate } from "$lib/helpers.js";
	import { onMount } from "svelte";

	let callsignForm: HTMLInputElement;
	let info: string | null = null;
	let telemetry: string | null = null;
	let mounted = false;
	let callsignFormDate: HTMLDataElement;

	export let data;
	export let form;

	info = data.info;

	//@ts-ignore
	let newTelem: ProcessedData[] | bool;
	function formSubmit() {
		info = data.info;
		if (form) {
			callsignFormDate.value = form.date as string;
			newTelem = false;
			if (form!.status == 200) {
				console.log(form);
				info = form.info;
				telemetry = form.telemetry;
				callsignForm.value = form.id as string;

				//@ts-ignore
				newTelem = telemetry.map((t, index) => {
					const dataObj = parseString(t);
					if (dataObj != null) {
						//@ts-ignore
						dataObj["time"] = form!.times[index];
						return dataObj;
					}
				});
				//@ts-ignore
				newTelem = newTelem.filter((data) => data !== undefined) as ProcessedData[];
				console.log(newTelem);
			} else {
				info = form.info;
				newTelem = false;
			}
		}
	}

	$: form, formSubmit();

	interface Channel {
		name: string;
		value: number;
		unit: string;
	}

	interface ParsedData {
		projectName: string;
		sequence: number;
		channels: Channel[];
	}

	function parseString(input: string): ParsedData | null {
		// Regex to match the project name and sequence number
		const projectSeqRegex = /^(.+?): Seq=(\d+),/;
		const projectSeqMatch = input.match(projectSeqRegex);

		if (!projectSeqMatch) {
			return null; // Invalid format
		}

		const projectName = projectSeqMatch[1];
		const sequence = parseInt(projectSeqMatch[2], 10);

		// Regex to match channels
		const channelRegex = /(\w+)=([\d.]+) ([\w^%]+)/g;
		let match;
		const channels: Channel[] = [];

		while ((match = channelRegex.exec(input)) !== null) {
			channels.push({
				name: match[1],
				value: parseFloat(match[2]),
				unit: match[3]
			});
		}

		return {
			projectName,
			sequence,
			channels
		};
	}

	interface ProcessedData {
		projectName: string;
		sequence: number;
		time: string;
		channels: { name: string; value: number; unit: string }[];
	}

	onMount(() => {
		mounted = true;
		callsignFormDate.value = formatDate(new Date());
	});
</script>

<form action="?/callsign" method="POST" use:enhance>
	<div class="mx-4">
		<div class="field is-grouped">
			<input
				type="text"
				name="id"
				class="input is-rounded"
				bind:this={callsignForm}
				placeholder="N0CALL-1"
			/>
			<input type="date" name="date" bind:this={callsignFormDate} />
			<button class="button is-primary">go</button>
		</div>
	</div>
</form>

{#if info}
	{#if newTelem}
		<div style="width: 60%; margin-left: auto; margin-right: auto;">
			<Graphs data={newTelem}></Graphs>
		</div>
		<div>graph above</div>
	{:else}
		<h4 style="margin-bottom: 0;">enter a callsign and extension to filter</h4>
		<p style="margin-top: 0;">N0CALL-X</p>

		<h4>raw data</h4>
		<div>{info}</div>
	{/if}
{/if}
