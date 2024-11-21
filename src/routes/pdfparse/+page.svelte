<script lang="ts">
	import { getToastStore } from "@skeletonlabs/skeleton";
	import type { ToastSettings } from "@skeletonlabs/skeleton";
	import { FileDropzone, ProgressBar} from "@skeletonlabs/skeleton";
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	const toastStore = getToastStore();

	export let data: PageData;
	$: console.log(data);

	let files: FileList;
	let parsedText = "";
	let parsedHTML = "";
	let urlParameters = "";
	let pageSecure = false;
	let error = false;
	let errorMessage = "";
	let loading = false;

	onMount(() => {
		if (location.protocol === "https:" || location.hostname === "localhost") {
			pageSecure = true;
			console.log("page is secure");
		} else {
			console.log("page is not secure");
		}
	});

	// when a file is added to files then submit the form without refreshing the page

	function onChangeHandler(e: Event): void {
		console.log("files:", files);
		const parseBTN = document.getElementById("parseBTN");
		if (parseBTN) {
			parseBTN.click();
		}
		loading = true;
	}

	function onSuccess(result: any) {
		// If the API call was successful.
		if (
			"data" in result &&
			result.data !== undefined &&
			typeof result.data.parsedText === "string"
		) {
			parsedText = result.data.parsedText;
			parsedHTML = result.data.parsedHTML;
			urlParameters = result.data.urlParameters;
			if (urlParameters !== "") {
				urlParameters = "?" + urlParameters;
				//redirect to the url with the parameters
				window.location.href = "/" + urlParameters;
			}

			// add parsedHTML to the DOM
			const parsedHTMLDiv = document.getElementById("parsedHTML");
			if (parsedHTMLDiv) {
				parsedHTMLDiv.innerHTML = parsedHTML;
				parsedHTMLDiv.classList.remove("hidden");
			}

			console.log("parsedText:", parsedText);

			// If the API call failed.
		} else {
			onError("No form fields found in the PDF file")
		}
	}

	function onError(message = "Error") {
		error = true;
		errorMessage = message
	}

	// Function to copy content to clipboard
	async function copyToClipboard(typeToCopy: string = "HTML") {
		try {
			if (pageSecure) {
				await copyToClipboardSecure(typeToCopy);
			} else {
				await copyToClipboardInsecure(typeToCopy);
			}
		} catch (err: any) {
			handleCopyError(err.message);
		}
	}

	// Function to handle errors during copy
	function handleCopyError(errorMessage: string) {
		const t: ToastSettings = {
			message: "Failed to copy: " + errorMessage
		};
		toastStore.trigger(t);
	}

	async function copyToClipboardInsecure(typeToCopy: string = "HTML") {
		try {
			// Create a temporary element to hold the content
			const tempElement = document.createElement("div");
			//using tailwind classes to make the element white background and the font black
			tempElement.classList.add("bg-white", "text-black");
			// remove any font size and font family
			tempElement.style.fontSize = "Normal";
			tempElement.style.fontFamily = "serif";

			if (typeToCopy === "HTML") {
				tempElement.innerHTML = parsedHTML;
			} else if (typeToCopy === "Text") {
				tempElement.innerHTML = parsedText;
			} else {
				throw new Error("Invalid typeToCopy parameter");
			}

			document.body.append(tempElement); // Add to the DOM
			//select the text
			const range = document.createRange();
			range.selectNode(tempElement);
			window.getSelection()?.removeAllRanges();
			window.getSelection()?.addRange(range);

			document.execCommand("copy"); // Try to copy
			tempElement.remove(); // Clean up

			const t: ToastSettings = {
				message: `${typeToCopy} copied to clipboard`
			};
			toastStore.trigger(t);
		} catch (err: any) {
			const t: ToastSettings = {
				message: "Failed to copy: " + err.message
			};
			toastStore.trigger(t);
		}
	}

	async function copyToClipboardSecure(typeToCopy: string = "HTML") {
		try {
			const blobHtml = new Blob([parsedHTML], { type: "text/html" });
			const blobText = new Blob([parsedText], { type: "text/plain" });

			const clipboardItems: ClipboardItem[] = [];

			if (typeToCopy === "HTML") {
				clipboardItems.push(
					new ClipboardItem({
						["text/plain"]: blobText,
						["text/html"]: blobHtml
					})
				);
			} else if (typeToCopy === "Text") {
				clipboardItems.push(
					new ClipboardItem({
						["text/plain"]: blobText
					})
				);
			} else {
				throw new Error("Invalid typeToCopy parameter");
			}

			await navigator.clipboard.write(clipboardItems);

			const t: ToastSettings = {
				message: `${typeToCopy} copied to clipboard`
			};
			toastStore.trigger(t);
		} catch (err: any) {
			const t: ToastSettings = {
				message: "Failed to copy: " + err.message
			};
			toastStore.trigger(t);
		}
	}

	function reset() {
		parsedText = "";
		parsedHTML = "";
		error = false;
		//remove the parsedHTML from the DOM
		const parsedHTMLDiv = document.getElementById("parsedHTML");
		if (parsedHTMLDiv) {
			parsedHTMLDiv.innerHTML = "";
			parsedHTMLDiv.classList.add("hidden");
		}
	}
</script>

<svelte:head>
	<title>PDF Parser</title>
</svelte:head>

<!-- upload a pdf file and parse through the form fields and display them line by line in a multiline text box to be able to copy -->
<form
	method="POST"
	enctype="multipart/form-data"
	use:enhance={() => {
		return async ({ result }) => {
			// console.log(result);
			loading = true;
			if (result) {
				loading = false;
				onSuccess(result);
			} else {
				loading = false;
				onError("No form fields found in the PDF file");
			}
		};
	}}
>
	<div class="space-y-4 w-1/2 ml-10">
		{#if loading}
			<ProgressBar/>
		{/if}
		{#if error}
			<aside
				class="alert variant-filled-error"
				transition:fade={{ duration: 200 }}
			>
				<div class="alert-message">
					<h3 class="h3">
						{#if errorMessage}
						{errorMessage}
						{:else}
						Error
						{/if}
					</h3>
					<p>
						It appears that the PDF has been flattened or some other problem
						with the PDF.
					</p>
				</div>
			</aside>
		{/if}
		<FileDropzone
			name="fileToUpload"
			bind:files
			on:change={onChangeHandler}
			accept="application/pdf"
		>
			<svelte:fragment slot="lead"
				><i class="fa-solid fa-file-arrow-up text-4xl" /></svelte:fragment
			>
			<svelte:fragment slot="meta">PDF only</svelte:fragment>
		</FileDropzone>
		{#if files}
			{#each files as file}
				{file.name}
			{/each}
			<hr />
		{/if}

		<div class="mt-6 flex items-center justify-end gap-x-6">
			<button type="submit" class="btn variant-filled" id="parseBTN"
				>Parse the PDF</button
			>

			<select class="select w-1/3" name="parseMode" on:change={onChangeHandler}>
				<option value="newDeal">New Deal</option>
				<option value="reviewQuestions">Initial review Questions</option>
				<option value="lenderEmail" selected>Lender Email</option>
			</select>

			{#if parsedHTML !== ""}
				<button
					class="btn variant-filled-primary"
					id="copyToClipboard"
					on:click={() => copyToClipboardInsecure("HTML")}>Copy HTML</button
				>
				<button
					class="btn variant-filled-primary"
					id="copyToClipboard"
					on:click={() => copyToClipboardInsecure("Text")}>Copy Text</button
				>

				<button
					class="btn variant-filled-danger"
					on:click={() => {
						reset();
					}}>Reset</button
				>
			{/if}
		</div>

		<div
			id="parsedHTML"
			class="input p-4 bg-gray-100 rounded-md hidden"
			placeholder="Parsed text will appear here"
		/>
	</div>
</form>
