<script lang="ts">
	import type { PageData } from "./$types";
	import { onMount } from "svelte";
	import { page } from "$app/stores";

	// Import the Google Maps API Loader
	import * as GoogleMapsLoader from "@googlemaps/js-api-loader";
	const { Loader } = GoogleMapsLoader;
	import { extractAddressComponents, isValidEmail } from "$lib/utils";
	import { PUBLIC_GOOGLE_PLACES_API_KEY } from "$env/static/public";

	// Import the NewDealSuccess component
	import NewDealSuccess from "./components/NewDealSuccess.svelte";

	import { superForm } from "sveltekit-superforms/client";
	// import SuperDebug from 'sveltekit-superforms';
	import MultiSelect from "svelte-multiselect";

	import {
		getToastStore,
		ProgressBar,
		type ToastSettings
	} from "@skeletonlabs/skeleton";

	const toastStore = getToastStore();

	//get the url parameters
	import { queryParameters } from "sveltekit-search-params";

	let devMode = false;

	// Set up classes that are re-used
	const WARNING_CLASS = "variant-filled-warning";
	const SUCCESS_CLASS = "variant-filled-success";

	import {
		dealStageOptions,
		transactionTypeOptions,
		propertyTypeOptions,
		unitedStatesList,
		dealFormTestValues
	} from "./vars";

	export let data: PageData;

	let loading = { email: false };

	const { form, errors, constraints, enhance, delayed, message, allErrors } =
		superForm(data.form, {
			applyAction: true,
			scrollToError: "auto",
			autoFocusOnError: true,
			dataType: "json",
			multipleSubmits: "prevent",
			resetForm: true,
			onError: ($error) => {
				console.error("Error caught by Superforms:", $error);
			}
		});

	let autocomplete: google.maps.places.Autocomplete | undefined;
	let place;
	let mapsUrl = "";

	/**
	 * Initializes the address autocomplete functionality using the Google Places API.
	 * @returns {boolean} Returns false if the address field is not found.
	 */
	async function initAddressAutocomplete(): Promise<void | boolean> {
		const loader = new Loader({
			apiKey: PUBLIC_GOOGLE_PLACES_API_KEY,
			version: "weekly",
			libraries: ["places"]
		});

		try {
			await loader.importLibrary("maps").then(() => {
				const addrField = document.getElementById("address");
				if (!addrField) {
					console.error("Address field not found.");
					return false;
				}

				autocomplete = new google.maps.places.Autocomplete(
					addrField as HTMLInputElement,
					{
						componentRestrictions: { country: "us" },
						strictBounds: false
					}
				);

				autocomplete.addListener("place_changed", () => {
					if (autocomplete) {
						place = autocomplete.getPlace();
						const extractedAddress = extractAddressComponents(
							place.address_components
						);

						$form.address = extractedAddress.address;
						$form.city = extractedAddress.city;
						$form.state = extractedAddress.state;
						$form.zip_code = extractedAddress.zip_code;

						checkAddress(); // Check if there is a deal with that address

						mapsUrl = place.url ?? "";
					}
				});
			});
		} catch (error) {
			console.error("Error loading Google Maps API:", error);
			toastStore.trigger({
				message: "Failed to load Google Maps API. Please try again later.",
				background: "variant-filled-error"
			});
		}
	}

	const urlParams = queryParameters({
		devMode: false
	});

	onMount(() => {
		/**
		 * Initializes the address autocomplete feature.
		 */
		initAddressAutocomplete();

		// Log the URL parameters
		// console.log(JSON.stringify($urlParams, null, 2));

		setFormValuesFromUrl();
		//Check if the page is in development mode
		// @ts-ignore
		if (import.meta.env.MODE === "development") {
			console.log("Development mode");
			devMode = true;
		} else if ($urlParams["devMode"] === "true") {
			devMode = true;
			console.log("Development mode via URL parameter");
		} else {
			console.log("Production mode");
		}
	});

	// Function to set form values from URL parameters
	function setFormValuesFromUrl() {
		Object.keys($urlParams).forEach((key) => {
			// Check if the key is not "email" and the corresponding form field exists
			// console.log(`Checking form field ${key}`);
			if (key === "amount_input") {
				// Set the value of the form field
				//@ts-ignore
				$form.amount_input = $urlParams[key];
				$form.amount = parseInt($urlParams[key].replace(/\D/g, ""));
			} else if (key === "as_is_value_input") {
				// Set the value of the form field
				//@ts-ignore
				$form.as_is_value_input = $urlParams[key];
				$form.as_is_value = parseInt($urlParams[key].replace(/\D/g, ""));
			} else if (key === "dealname") {
				// Set the value of the form field
				//@ts-ignore
				$form.dealname = $urlParams[key];
			} else if (key === "address") {
				// Set the value of the form field
				//@ts-ignore
				$form.address = $urlParams[key];
			} else {
				console.log(`Form field ${key} does not exist`);
			}
		});
	}

	function submitform() {
		//If the dealname field is not set, set it to the address
		if ($form.dealname == "") {
			$form.dealname = $form.address as string;
		}
	}

	// Define a function called maskCurrencyValue that takes two parameters: event and property
	function maskCurrencyValue(event: Event, property: keyof typeof $form): void {
		// Get the input value from the event object
		const unmaskedValue = parseInt(
			(event.target as HTMLInputElement).value.replace(/\D/g, "")
		);

		// Set the property value on the $form object
		// @ts-ignore
		$form[property] = isNaN(unmaskedValue) ? 0 : unmaskedValue;
		// Set the input property value on the $form object
		// @ts-ignore
		$form[property + "_input"] = isNaN(unmaskedValue)
			? ""
			: unmaskedValue.toLocaleString(); //Don't show if NaN
	}

	// This function converts the raw multiselect input into a string with a specified delimiter.
	function multiselectRawToString(
		property: keyof typeof $form,
		delimiter = "; "
	): void {
		// Extract the selected option values as an array of strings
		const property_raw = `${property}_raw`;
		// @ts-ignore
		const input = $form[property_raw];

		// Join the input values into a string using the specified delimiter
		// @ts-ignore
		$form[property] = input ? (input as string[]).join(delimiter) : "";
	}

	function formreset() {
		//Reset alerts
		const alerts = document.getElementById("address-alerts");
		if (alerts) {
			alerts.innerHTML = "";
		}
		//reset the checkaddress button
		const checkAddressBtn = document.getElementById("checkaddress");
		if (checkAddressBtn) {
			checkAddressBtn.innerHTML = "Check Address";
			//change the class to variant-filled-warning
			checkAddressBtn.classList.remove(SUCCESS_CLASS);
			checkAddressBtn.classList.add(WARNING_CLASS);
		}
	}

	/**
	 * Render error labels consistently.
	 * @param fieldName The name of the field associated with the error.
	 * @param error The error message(s) to display, can be a string or an array of strings.
	 * @returns A string containing the HTML for the error label.
	 */
	function renderErrorLabel(
		fieldName: string,
		error: string | string[] | undefined
	): string {
		if (!error) return "";

		// If error is an array, join it into a single string
		const errorMessage = Array.isArray(error) ? error.join(". ") : error;

		return `
		<label class="label variant-soft-error p-2" for="${fieldName}">
			<span class="label-text-alt text-error">${errorMessage}</span>
		</label>
	`;
	}

	/**
	 * Function to generate the class string based on the input's state.
	 * @param hasError Whether the input has an error.
	 * @param isPopulated Whether the input is populated (i.e., has a value).
	 * @returns The class string to apply to the input.
	 */
	function getInputClass(hasError: boolean, isPopulated: boolean): string {
		let baseClass = "input outline outline-1";
		if (hasError) {
			return `${baseClass} input-error`; // Add the input-error class if there's an error
		} else if (isPopulated) {
			return `${baseClass} input-success`; // Add the input-success class if the input is populated
		} else {
			return `${baseClass}`; // Add the input-warning class if the input is not populated
		}
	}

	function getHubspotBroker() {
		//add a loading indicator to the email field
		loading.email = true;

		//Check if $form.email is set
		if (!$form.email) {
			console.log("Email address is not set");
			return;
		}

		//Remove mailto: if present
		$form.email = ($form.email as string).replace(/^mailto:/, "");
		//remove any spaces
		$form.email = ($form.email as string).replace(/\s/g, "");
		// console.log($form.email);

		//Check if $form.email is a valid email address
		if (isValidEmail($form.email)) {
			// console.log("Valid email address");

			//Get call to api /newdeal/api/brokerinfo to get the broker's name and ID using the email address as a the email variable
			fetch(
				"/api/brokerinfo?email=" + encodeURIComponent(String($form.email)),
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				}
			)
				.then((response) => response.json())
				.then((data) => {
					// console.log(data);

					if (data.id == false) {
						const toastHTML: string = `
							<div class="text-center mb-4">
							<p class="text-base">
								Broker not found!
							</p>
							</div>
							<div class="text-center mb-4">
							<a class="btn variant-filled-warning block mx-auto" target="_blank" href="https://app.hubspot.com/contacts/5587905/objects/0-1/views/all/list">
								Create
							</a>
							</div>
						`;

						const t: ToastSettings = {
							message: toastHTML,
							background: "variant-filled-error"
						};
						toastStore.trigger(t);
					} else {
						//Set the broker's name and ID
						$form.firstname = data.firstname;
						$form.lastname = data.lastname;
						$form.broker_id = data.brokerid;
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				})
				.finally(() => {
					//Remove the loading indicator from the email field
					loading.email = false;
				});
		} else {
			console.log("Invalid email address");
		}
	}

	function checkAddress() {
		//get the address from the form
		const address = $form.address as string;
		if (address == "") return;

		fetch("/api/propertyinfo?address=" + encodeURIComponent(address), {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.match) {
					const alerts = document.getElementById("address-alerts");
					if (alerts) {
						alerts.innerHTML = `
							<aside class="alert variant-filled-warning">
								<div class="alert-message">
									<h3 class="h3">Deal found with that address</h3>
									<p><a href="${data.link}" target="blank">${data.dealname}</a></p>
								</div>
							</aside>
						`;
					}
				} else {
					//change the check address button to a green checkmark
					const checkAddressBtn = document.getElementById("checkaddress");
					if (checkAddressBtn) {
						checkAddressBtn.innerHTML = `
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							`;
						//change the class to variant-filled-success
						checkAddressBtn.classList.remove(WARNING_CLASS);
						checkAddressBtn.classList.add(SUCCESS_CLASS);
					}
				}
			});
	}

	$: {
		if ($message) {
			console.log($message);
		}

		if (($errors as any[]) && ($errors as any[]).length > 0) {
			console.log($errors);
		}
	}
</script>

<svelte:head>
	<title>New Deal</title>
</svelte:head>

{#if $message}
	{#if $page.status == 200}
		<NewDealSuccess {message} />
	{:else}
		<aside class="alert variant-filled-error">
			<!-- Icon -->
			<div>(icon)</div>
			<!-- Message -->
			<div class="alert-message">
				<h3 class="h3">Error!</h3>
				<p>{$message.message}</p>
			</div>
			<!-- Actions -->
			<div class="alert-actions">(buttons)</div>
		</aside>
	{/if}
{/if}

{#if $allErrors.length}
	<aside class="alert variant-filled-error">
		<!-- Message -->
		<div class="alert-message">
			<h3 class="h3">Form Errors</h3>
			<p>See below for form errors</p>
		</div>
	</aside>
{/if}

<div class="mx-auto w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mt-8">
	<form method="POST" use:enhance autocomplete="off">
		<!-- Broker Info -->
		<section class="flex flex-wrap flex-row items-center gap-2 mb-5">
			<!-- Broker Email -->
			<div class="form-control basis-1/4">
				<label class="label" for="email"
					>Broker Email
					<input
						type="text"
						name="email"
						id="email"
						data-invalid="{$errors.email ? 'true' : undefined}}"
						autocomplete="off"
						class={getInputClass(!!$errors.email, !!$form.email)}
						bind:value={$form.email}
						on:input={getHubspotBroker}
						{...$constraints.email}
					/>

					{@html renderErrorLabel("email", $errors.email)}
				</label>
			</div>
			<!-- Firstname -->
			<div class="form-control basis-1/5">
				<label class="label" for="firstname">Broker First Name</label>
				<input
					type="text"
					class={getInputClass(!!$errors.firstname, !!$form.firstname)}
					name="firstname"
					id="firstname"
					data-invalid="{$errors.firstname ? 'true' : undefined}}"
					bind:value={$form.firstname}
					{...$constraints.firstname}
				/>
				{@html renderErrorLabel("firstname", $errors.firstname)}
			</div>

			<!-- Lastname -->
			<div class="form-control basis-1/5">
				<label class="label" for="lastname">Broker Last Name</label>
				<input
					type="text"
					class={getInputClass(!!$errors.lastname, !!$form.lastname)}
					name="lastname"
					id="lastname"
					data-invalid="{$errors.lastname ? 'true' : undefined}}"
					bind:value={$form.lastname}
					{...$constraints.lastname}
				/>
				{@html renderErrorLabel("lastname", $errors.lastname)}
			</div>

			<!-- Broker ID -->
			<div class="form-control basis-1/6">
				<label class="label" for="broker_id">Hubspot ID</label>
				<input
					type="text"
					class={getInputClass(!!$errors.broker_id, !!$form.broker_id)}
					id="broker_id"
					name="broker_id"
					data-invalid="{$errors.broker_id ? 'true' : undefined}}"
					bind:value={$form.broker_id}
					{...$constraints.broker_id}
				/>
				{@html renderErrorLabel("broker_id", $errors.broker_id)}
			</div>

			<div class="mt-5">
				<button class="btn btn-icon" type="button" on:click={getHubspotBroker}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
						/>
					</svg>
				</button>
			</div>
		</section>
		{#if loading.email}
			<ProgressBar
				meter="bg-primary-500"
				track="bg-primary-500/30"
				class="!border-t-8 mb-8 mt-8"
			/>
		{:else}
			<hr class="!border-t-8 mb-8 mt-8" />
		{/if}

		<div id="brokerinfoalert" />

		<!--First Row-->
		<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Deal Name -->
			<label class="label" for="dealname">
				<span>Deal Name</span>
				<input
					type="text"
					class={getInputClass(!!$errors.dealname, !!$form.dealname)}
					name="dealname"
					id="dealname"
					data-invalid="{$errors.dealname ? 'true' : undefined}}"
					bind:value={$form.dealname}
					{...$constraints.dealname}
				/>
				{@html renderErrorLabel("dealname", $errors.dealname)}
			</label>

			<!-- Deal Stage -->

			<label class="label" for="dealstage">
				<span>Deal Stage</span>
				<select
					class={getInputClass(!!$errors.dealstage, !!$form.dealstage)}
					name="dealstage"
					id="dealstage"
					data-invalid="{$errors.dealstage ? 'true' : undefined}}"
					bind:value={$form.dealstage}
					{...$constraints.dealstage}
				>
					{#each dealStageOptions as option}
						<option
							value={JSON.stringify(option.value)}
							selected={option.selected}>{option.label}</option
						>
					{/each}
				</select>

				{@html renderErrorLabel("dealstage", $errors.dealstage)}
			</label>
		</div>

		<!-- Second Row -->
		<div class="flex flex-wrap flex-row items-center gap-8 mt-5">
			<!-- Transaction -->
			<div class="form-control basis-1/4">
				<label class="label" for="transaction_type_raw"
					><span
						class="label-text {$form.transaction_type_raw.length > 0
							? 'input-success'
							: ''}">Transaction Type</span
					><MultiSelect
						name="transaction_type_raw"
						id="transaction_type_raw"
						bind:value={$form.transaction_type_raw}
						options={transactionTypeOptions}
						placeholder="Select transaction types"
						liOptionClass="text-surface-900"
						on:close={() => multiselectRawToString("transaction_type")}
						on:change={() => multiselectRawToString("transaction_type")}
						{...$constraints.transaction_type_raw}
					/></label
				>

				<input
					class="hidden"
					name="transaction_type"
					bind:value={$form.transaction_type}
				/>
				{@html renderErrorLabel("transaction_type", $errors.transaction_type)}
			</div>

			<!-- Property Type -->
			<div class="form-control basis-1/3">
				<label class="label" for="property_type_raw"
					><span
						class="label-text {$form.property_type_raw.length > 0
							? 'input-success'
							: ''}">Property Type</span
					></label
				>
				<MultiSelect
					name="property_type"
					id="property_type_raw"
					bind:value={$form.property_type_raw}
					options={propertyTypeOptions}
					on:close={() => multiselectRawToString("property_type")}
					on:change={() => multiselectRawToString("property_type")}
					placeholder="Select property types"
					liOptionClass="text-surface-900"
					{...$constraints.property_type_raw}
					liSelectedClass={$form.property_type_raw.length > 0
						? "input-success"
						: ""}
				/>
				<input
					class="hidden"
					name="property_type"
					bind:value={$form.property_type}
				/>
				{@html renderErrorLabel("property_type", $errors.property_type)}
			</div>

			<!-- Property Type Future -->
			<div class="form-control basis-1/3">
				<label class="label" for="property_type_future_raw"
					><span
						class="label-text {$form.property_type_future_raw.length > 0
							? 'input-success'
							: ''}">Property Type Future</span
					></label
				>
				<MultiSelect
					name="property_type_future_raw"
					id="property_type_future_raw"
					bind:value={$form.property_type_future_raw}
					options={propertyTypeOptions}
					on:close={() => multiselectRawToString("property_type_future")}
					on:change={() => multiselectRawToString("property_type_future")}
					placeholder="Select future property types"
					liOptionClass="text-surface-900"
					{...$constraints.property_type_future_raw}
					outerDivClass={getInputClass(
						!!$errors.property_type_future,
						!!$form.property_type_future_raw
					)}
				/>
				<input
					class="hidden"
					name="property_type"
					bind:value={$form.property_type_future}
				/>
				{@html renderErrorLabel(
					"property_type_future",
					$errors.property_type_future
				)}
			</div>
		</div>

		<!-- Third Row -->
		<div class="flex flex-wrap flex-row items-center gap-2 mt-5">
			<!-- Amount -->
			<div class="form-control basis-1/3">
				<label class="label" for="amount_input">
					<span class="label-text">Amount</span>
				</label>
				<input
					type="text"
					class={getInputClass(!!$errors.amount, !!$form.amount_input)}
					name="amount_input"
					id="amount_input"
					on:input={(event) => maskCurrencyValue(event, "amount")}
					aria-invalid={$errors.amount_input ? "true" : undefined}
					bind:value={$form.amount_input}
					{...$constraints.amount_input}
				/>
				<input
					type="number"
					name="amount"
					class="hidden"
					aria-invalid={$errors.amount ? "true" : undefined}
					bind:value={$form.amount}
					{...$constraints.amount}
				/>
				{@html renderErrorLabel("amount", $errors.amount)}
			</div>

			<!-- As Is Value -->
			<div class="form-control basis-1/3">
				<label class="label" for="as_is_value_input">
					<span class="label-text">As Is Value</span>
				</label>
				<input
					type="text"
					class={getInputClass(
						!!$errors.as_is_value,
						!!$form.as_is_value_input
					)}
					name="as_is_value_input"
					id="as_is_value_input"
					on:input={(event) => maskCurrencyValue(event, "as_is_value")}
					aria-invalid={$errors.as_is_value ? "true" : undefined}
					bind:value={$form.as_is_value_input}
					{...$constraints.as_is_value_input}
				/>
				<input
					type="number"
					name="as_is_value"
					class="hidden"
					aria-invalid={$errors.as_is_value ? "true" : undefined}
					bind:value={$form.as_is_value}
					{...$constraints.as_is_value}
				/>
				{@html renderErrorLabel("as_is_value", $errors.as_is_value)}
			</div>

			<hr class="!border-t-8 mt-8 mb-0" />
			<!-- Fourth Row, with explicit full-width settings for the container and adjustments for inner elements -->
			<div class="flex flex-wrap flex-row items-center gap-2 mt-10 w-full">
				<div id="address-alerts" class="w-full"></div>

				<p class="w-full text-left">Address</p>

				<div
					class="input-group input-group-divider grid grid-cols-1 md:grid-cols-[1fr_auto] outline outline-1 w-full {getInputClass(
						!!$errors.address,
						!!$form.address
					)}"
				>
					<input
						type="text"
						class="input w-full"
						name="address"
						id="address"
						placeholder="Enter address..."
						autoComplete="off"
						data-invalid={$errors.address ? "true" : undefined}
						bind:value={$form.address}
						{...$constraints.address}
					/>

					<button
						type="button"
						id="checkaddress"
						class="WARNING_CLASS"
						on:click={checkAddress}
					>
						Check Address
					</button>
				</div>

				{@html renderErrorLabel("address", $errors.address)}
			</div>

			<!-- Fifth Row -->
			<div class="flex flex-wrap flex-row items-center gap-2 mb-10 pt-5">
				<!-- City -->
				<div class="form-control basis-1/3">
					<label class="label" for="city">
						<span class="label-text">City</span>
					</label>
					<input
						type="text"
						class={getInputClass(!!$errors.city, !!$form.city)}
						name="city"
						id="city"
						data-invalid="{$errors.city ? 'true' : undefined}}"
						bind:value={$form.city}
						{...$constraints.city}
					/>
					{@html renderErrorLabel("city", $errors.city)}
				</div>

				<!-- State -->
				<div class="form-control basis-1/3">
					<label class="label" for="state">
						<span class="label-text">State</span>
					</label>
					<select
						name="state"
						class={getInputClass(!!$errors.state, !!$form.state)}
						id="state"
						data-invalid="{$errors.state ? 'true' : undefined}}"
						bind:value={$form.state}
						{...$constraints.state}
					>
						<option value="" disabled selected>Select a state</option>
						{#each unitedStatesList as option}
							<option value={option.name}>{option.name}</option>
						{/each}
					</select>
					{@html renderErrorLabel("state", $errors.state)}
				</div>

				<!-- Zip Code -->
				<div class="form-control basis-1/4">
					<label class="label" for="zip_code">
						<span class="label-text">Zip Code</span>
					</label>
					<input
						type="text"
						class={getInputClass(!!$errors.zip_code, !!$form.zip_code)}
						id="zip_code"
						name="zip_code"
						data-invalid="{$errors.zip_code ? 'true' : undefined}}"
						bind:value={$form.zip_code}
						{...$constraints.zip_code}
					/>
					{@html renderErrorLabel("zip_code", $errors.zip_code)}
				</div>

				<!-- Submit Button -->
				<div class="flex flex-wrap items-center mt-6">
					<div class="form-control">
						{#if $delayed}
							<button type="button" class="btn variant-filled-tertiary" disabled
								><svg
									class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									/>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg> Processing...</button
							>
						{:else}
							<button
								type="submit"
								class="btn variant-filled-primary"
								on:click={submitform}>Create New Deal</button
							>
						{/if}
						<button type="reset" class="btn" on:click={formreset}>Reset</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>

{#if devMode}
	<div class="fixed bottom-4 right-4">
		<button
			type="button"
			class="btn variant-filled-tertiary"
			on:click={() => {
				Object.keys(dealFormTestValues).forEach((key) => {
					// Set the value of the form element with the same name as the key
					// to the value of the key.
					// @ts-ignore
					$form[key] = dealFormTestValues[key];
				});
			}}>Fill in Test Data</button
		>
	</div>
	<!-- <SuperDebug data={$form} /> -->
{/if}
