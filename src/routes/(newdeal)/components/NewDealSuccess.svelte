<script lang="ts">
	import { confetti } from "@neoconfetti/svelte";
	import { afterUpdate } from "svelte";

	export let message;
	let scrollTarget;

	afterUpdate(() => {
		// if (scrollTarget) {
		// 	scrollTarget.scrollIntoView({ behavior: "smooth" });
		// 	scrollTarget = null; // Reset the scroll target
		// }
		window.scrollTo({ top: 0, behavior: "smooth" });
	});
</script>

{#if $message}
	<div use:confetti={{ particleCount: 300 }} class="w-full" />
	<aside
		class="alert variant-filled-primary shadow-xl"
		bind:this={scrollTarget}
	>
		<!-- Message -->
		<div class="alert-message">
			<h3 class="h3">{$message.message}</h3>
			<p class="py-6">
				{$message.dealname}
				<br />
				{$message.address}
			</p>
			<div class="btn-group variant-filled">
				<button type="button" class="btn variant-filled">
					<a
						href={`https://app.hubspot.com/contacts/5587905/deal/${$message.id}/`}
						target="_blank"
					>
						Deal
					</a>
				</button>
				{#if $message.brokerid}
					<button type="button" class="btn variant-filled">
						<a
							href={`https://app.hubspot.com/contacts/5587905/contact/${$message.brokerid}`}
							target="_blank"
						>
							Broker
						</a>
					</button>
				{/if}
			</div>
		</div>
		<!-- Actions -->
		<div class="alert-actions">
			<button
				type="button"
				class="btn-icon variant-filled"
				on:click={() => ($message = null)}
			>
				X
			</button>
		</div>
	</aside>
{/if}
