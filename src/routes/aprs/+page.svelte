<script lang="ts">
	import { enhance } from "$app/forms";
	import { formatDate } from "$lib/helpers";

	// setting up the date ranges
	const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)); // appearently not that efficient
	const tommorow = new Date(new Date().setDate(new Date().getDate() + 1));
	let startDateString = formatDate(yesterday);
	let endDateString = formatDate(tommorow);

	// grabbing the results
	export let form;
	let searchResults: any;
	$: form, (searchResults = form?.searchResults);
	$: console.log(searchResults);
</script>

<main>
	<div class="container mx-auto my-auto">
		<form
			action="?/search"
			method="POST"
			use:enhance={() => {
				return async ({ update }) => {
					update({ reset: false });
				};
			}}
			class="columns has-text-centered"
		>
			<div class="column">
				<p>Start Date</p>
				<input name="startDate" type="date" value={startDateString} />
			</div>
			<div class="column">
				<p>End Date</p>
				<input type="date" name="endDate" value={endDateString} />
			</div>
			<div class="column">
				<input type="text" class="input mt-3" name="callsign" placeholder="callsign" />
			</div>
			<div class="column is-centered mt-3">
				<button class="button is-primary" type="submit">Go</button>
			</div>
		</form>
	</div>

	{#if searchResults}
		{searchResults}
	{/if}
</main>
