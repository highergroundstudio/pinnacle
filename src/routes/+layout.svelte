<script lang="ts">
	// Most of your app wide CSS should be put in this file
	import "../app.postcss";
	import {
		AppShell,
		AppBar,
		Toast,
		setInitialClassState,
		LightSwitch,
		initializeStores
	} from "@skeletonlabs/skeleton";

	// Initialize the stores
	initializeStores();

	import Navigation from "@components/Navigation.svelte";

	import { version } from "$app/environment";
	console.log("Version: ", version);
</script>

<svelte:head
	>{@html `<script>(${setInitialClassState.toString()})();</script>`}</svelte:head
>

<Toast />

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a
					href="/"
					class="text-xl uppercase bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone"
					>Lenderify</a
				>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<Navigation />
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<div class="container mx-auto mt-5 mb-20">
		<slot />
	</div>

	<svelte:fragment slot="pageFooter">
		<div class="flex justify-end">
			<div class="p-4">Version: {version}</div>
		</div>
	</svelte:fragment>
</AppShell>
