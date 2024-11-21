import { NextResponse } from "next/server";
import { Client } from "@hubspot/api-client";

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
		const { street } = await request.json();

		if (!street) {
			return NextResponse.json(
				{ error: "Street address is required" },
				{ status: 400 },
			);
		}

		// Search for deals in HubSpot with matching street address
		const response = await hubspotClient.crm.deals.searchApi.doSearch({
			filterGroups: [
				{
					filters: [
						{
							propertyName: "property_address",
							operator: "CONTAINS_TOKEN",
							value: street,
						},
					],
				},
			],
			properties: [
				"dealname",
				"property_address",
				"amount",
				"dealstage",
				"createdate",
			],
			limit: 10,
			sorts: [
				{
					propertyName: "createdate",
					direction: "DESCENDING",
				},
			],
		});

		return NextResponse.json({
			exists: response.results.length > 0,
			deals: response.results.map((deal) => ({
				id: deal.id,
				name: deal.properties.dealname,
				address: deal.properties.property_address,
				amount: deal.properties.amount,
				stage: deal.properties.dealstage,
				created: deal.properties.createdate,
			})),
		});
	} catch (error: any) {
		console.error("HubSpot API error:", error);
		return NextResponse.json(
			{ error: error.message || "Internal server error" },
			{ status: 500 },
		);
	}
}
