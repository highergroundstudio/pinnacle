import { NextResponse } from "next/server";
import { Client } from "@hubspot/api-client";
import type { PublicObjectSearchRequest } from "@hubspot/api-client/lib/codegen/crm/deals";

const hubspotClient = new Client({
	accessToken: process.env.HUBSPOT_TOKEN,
});

export async function GET() {
	if (!process.env.HUBSPOT_TOKEN) {
		return NextResponse.json(
			{ error: "HubSpot token not configured" },
			{ status: 500 },
		);
	}

	try {
		// Get total deals
		const dealsResponse = await hubspotClient.crm.deals.basicApi.getPage(
			undefined, // after
			undefined, // before
			[], // properties
			undefined, // properties
			undefined, // propertiesWithHistory
			true, // archived
		);
		const totalDeals = dealsResponse.results.length;

		// Get active brokers (contacts with deals)
		const brokersResponse = await hubspotClient.crm.contacts.basicApi.getPage(
			undefined,
			undefined,
			[],
			undefined,
			undefined,
			true,
		);
		const totalBrokers = brokersResponse.results.length;

		// Calculate performance based on deal closure rate
		const objectSearchRequest: PublicObjectSearchRequest = {
			filterGroups: [
				{
					filters: [
						{
							propertyName: "dealstage",
							// @ts-ignore
							operator: "EQ",
							value: "closedwon",
						},
					],
				},
			],
			properties: [], // Add the required properties field
			sorts: ["-createdate"], // Optional: Sort by createdate or other properties
			limit: 1, // Limit the number of results to 1 since we're looking for a single deal
			after: "0", // Optional: Use this to paginate through results, starting from
		};
		const closedDealsResponse =
			await hubspotClient.crm.deals.searchApi.doSearch(objectSearchRequest);
		const closedDeals = closedDealsResponse.total;
		const performance =
			totalDeals > 0 ? Math.round((closedDeals / totalDeals) * 100) : 100;

		return NextResponse.json({
			totalDeals,
			totalBrokers,
			performance,
		});
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.error("HubSpot API error:", error);
		return NextResponse.json(
			{ error: error.message || "Internal server error" },
			{ status: 500 },
		);
	}
}
