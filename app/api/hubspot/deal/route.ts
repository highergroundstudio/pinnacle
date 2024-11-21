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
		const { name } = await request.json();

		if (!name) {
			return NextResponse.json(
				{ error: "Deal name is required" },
				{ status: 400 },
			);
		}

		// Search for deals in HubSpot
		const response = await hubspotClient.crm.deals.searchApi.doSearch({
			filterGroups: [
				{
					filters: [
						{
							propertyName: "dealname",
							operator: "CONTAINS_TOKEN",
							value: name,
						},
					],
				},
			],
			properties: ["dealname"],
			limit: 1,
		});

		return NextResponse.json({
			exists: response.results.length > 0,
		});
	} catch (error: any) {
		console.error("HubSpot API error:", error);
		return NextResponse.json(
			{ error: error.message || "Internal server error" },
			{ status: 500 },
		);
	}
}
