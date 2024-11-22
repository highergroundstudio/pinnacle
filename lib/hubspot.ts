// Client-side functions that call the server API endpoints
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function searchBrokerByEmail(email: string): Promise<any> {
	const response = await fetch("/api/hubspot/broker", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to search broker");
	}

	return response.json();
}

export async function checkDuplicateDealName(name: string): Promise<boolean> {
	const response = await fetch("/api/hubspot/deal", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to check deal name");
	}

	const data = await response.json();
	return data.exists;
}

export async function checkDuplicateAddress(
	street: string,
): Promise<{ exists: boolean; deals: any[] }> {
	const response = await fetch("/api/hubspot/address", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ street }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to check address");
	}

	return response.json();
}

export interface HubSpotDealResponse {
	id: string;
	dealUrl: string;
}

export function getHubSpotDealUrl(dealId: string): string {
	const baseUrl = process.env.NEXT_PUBLIC_HUBSPOT_URL;
	if (!baseUrl) {
		throw new Error("NEXT_PUBLIC_HUBSPOT_URL environment variable is not set");
	}
	return `${baseUrl}/deal/${dealId}`;
}

export async function createDeal(data: any): Promise<HubSpotDealResponse> {
	const response = await fetch("/api/hubspot/create-deal", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			properties: {
				dealname: data.deal.name || data.addresses[0].street,
				dealstage: data.deal.stage,
				amount: data.deal.amount.toString(),
				transaction_type: data.deal.transactionType.join("; "),
				property_type: data.deal.propertyType.join("; "),
				property_type__future_: data.deal.propertyTypeFuture.join("; "),
				as_is_value: data.deal.asIsValue.toString(),
				property_address: data.addresses[0].street,
				city: data.addresses[0].city,
				state_located_in: data.addresses[0].state,
				zip_code: data.addresses[0].zipCode,
			},
			associations: data.broker.hubspotId
				? [
						{
							to: { id: data.broker.hubspotId },
						},
					]
				: undefined,
		}),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to create deal");
	}

	return response.json();
}
