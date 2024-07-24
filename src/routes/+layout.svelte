<script lang="ts">
	import "bulma";
</script>

<nav class="navbar">
	<!-- always visible -->
	<div class="navbar-brand">
		<!-- to give a little space on the lhs -->
		<div class="navbar-item"></div>
		<a class="title is-1" href="/" data-sveltekit-preload-data data-sveltekit-preload-code
			>MENDEZ LAB</a
		>
	</div>

	<!-- hidden on touch devices -->
	<div class="navbar-menu">
		<div class="navbar-end">
			<a class="navbar-item" href="/about" data-sveltekit-preload-data data-sveltekit-preload-code
				>About</a
			>
			<div class="navbar-item is-hoverable has-dropdown">
				<div class="navbar-link">Data</div>
				<div class="navbar-dropdown is-right">
					<a
						href="/meshtastic"
						class="navbar-item"
						data-sveltekit-preload-data
						data-sveltekit-preload-code>Meshtastic Data</a
					>
					<a
						href="/aprs"
						class="navbar-item"
						data-sveltekit-preload-data
						data-sveltekit-preload-code>APRS Data</a
					>
				</div>
			</div>
			<!-- to give a little extra space on the rhs -->
			<div class="navbar-item"></div>
		</div>
	</div>
</nav>

<slot></slot>
