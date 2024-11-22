import { NextResponse } from "next/server";
import { Client } from "@hubspot/api-client";
import type { PublicObjectSearchRequest } from "@hubspot/api-client/lib/codegen/crm/deals";

const hubspotClient = new Client({
	accessToken: process.env.HUBSPOT_TOKEN,
});

export async function POST(request: Request) {
	if (!process.env.HUBSPOT_TOKEN) {
		return NextResponse.json(
			{ error: "HubSpot token not configured" },
			{ status: 500 },
		);
	}

	try {
		const { name } = await request.json();

		if (!name) {
			return NextResponse.json(
				{ error: "Deal name is required" },
				{ status: 400 },
			);
		}

		const objectSearchRequest: PublicObjectSearchRequest = {
			filterGroups: [
				{
					filters: [
						{
							propertyName: "dealname",
							// @ts-ignore
							operator: "CONTAINS_TOKEN",
							value: name,
						},
					],
				},
			],
			sorts: ["-createdate"], // Optional: Sort by createdate or other properties
			properties: ["dealname"], // Customize the properties you want to retrieve
			limit: 1, // Limit the number of results to 1 since we're looking for a single deal
			after: "0", // Optional: Use this to paginate through results, starting from
		};

		// Search for deals in HubSpot
		const response =
			await hubspotClient.crm.deals.searchApi.doSearch(objectSearchRequest);

		return NextResponse.json({
			exists: response.results.length > 0,
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
