//create a function to convert state name to abbreviation
// 1 = 2 letter abbreviation (default)
// 2 = 3 letter abbreviation
export function convertStateToAbbr(name: string, to = "1"): string {
	const states = [
		["Arizona", "AZ"],
		["Alabama", "AL"],
		["Alaska", "AK"],
		["Arkansas", "AR"],
		["California", "CA"],
		["Colorado", "CO"],
		["Connecticut", "CT"],
		["Delaware", "DE"],
		["Florida", "FL"],
		["Georgia", "GA"],
		["Hawaii", "HI"],
		["Idaho", "ID"],
		["Illinois", "IL"],
		["Indiana", "IN"],
		["Iowa", "IA"],
		["Kansas", "KS"],
		["Kentucky", "KY"],
		["Louisiana", "LA"],
		["Maine", "ME"],
		["Maryland", "MD"],
		["Massachusetts", "MA"],
		["Michigan", "MI"],
		["Minnesota", "MN"],
		["Mississippi", "MS"],
		["Missouri", "MO"],
		["Montana", "MT"],
		["Nebraska", "NE"],
		["Nevada", "NV"],
		["New Hampshire", "NH"],
		["New Jersey", "NJ"],
		["New Mexico", "NM"],
		["New York", "NY"],
		["North Carolina", "NC"],
		["North Dakota", "ND"],
		["Ohio", "OH"],
		["Oklahoma", "OK"],
		["Oregon", "OR"],
		["Pennsylvania", "PA"],
		["Rhode Island", "RI"],
		["South Carolina", "SC"],
		["South Dakota", "SD"],
		["Tennessee", "TN"],
		["Texas", "TX"],
		["Utah", "UT"],
		["Vermont", "VT"],
		["Virginia", "VA"],
		["Washington", "WA"],
		["West Virginia", "WV"],
		["Wisconsin", "WI"],
		["Wyoming", "WY"],
	]

	for (let i = 0; i < states.length; i++) {
		if (states[i][0] === name) {
			return states[i][to]
		}
	}

	return ""
}

export function convertStringToList(input: string): string | undefined {
	// Remove square brackets from the input string
	const withoutBrackets = input.replace(/[\[\]]/g, "")

	// Remove double quotes from the input string
	const withoutQuotes = withoutBrackets.replace(/"/g, "")

	// Replace commas with semicolons
	const withSemicolons = withoutQuotes.replace(/,/g, ";")

	return withSemicolons
}

export function currencyToNumber(input: string | number): number {
	// Convert the input to a string if it's a number
	let str = typeof input === "number" ? input.toString() : input

	// Remove commas and dollar sign and convert to number
	str = str.replace(/,/g, "")
	str = str.replace("$", "")

	return Number(str)
}

//convert formData to object
export function formDataToObject(formData: FormData): Record<string, unknown> {
	let object: Record<string, unknown> = {}

	// formData.forEach((value, key) => {object[key] = value })
	object = Object.fromEntries(formData.entries())

	return object
}

// Description: Utility functions for the new deal route
export function extractAddressComponents(addressComponents) {
	const address = {
		street_number: "",
		route: "",
		locality: "",
		administrative_area_level_1: "",
		postal_code: "",
	}

	addressComponents.forEach((component) => {
		const type = component.types[0]
		if (type in address) {
			address[type] = component.long_name
		}
	})

	return {
		address: `${address.street_number} ${address.route}`,
		city: address.locality,
		state: address.administrative_area_level_1,
		zip_code: address.postal_code,
	}
}

// Function to validate an email address
// Parameter: email - string containing email address to validate
// Returns: boolean indicating if email is valid
export function isValidEmail(email) {
	// Regular expression pattern to validate email address
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	return emailPattern.test(email)
}
