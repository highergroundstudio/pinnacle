import { NextResponse } from "next/server";
import { Client } from "@hubspot/api-client";
import { FilterOperatorEnum } from "@hubspot/api-client/lib/codegen/crm/deals";

import type {
	SimplePublicObjectInputForCreate,
	AssociationSpec,
	PublicObjectSearchRequest,
} from "@hubspot/api-client/lib/codegen/crm/deals";

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

		const objectSearchRequest: PublicObjectSearchRequest = {
			filterGroups: [
				{
					filters: [
						{
							propertyName: "property_address",
							// @ts-ignore
							operator: FilterOperatorEnum.ContainsToken,
							value: street,
						},
					],
				},
			],
			sorts: ["-createdate"], // Optional: Sort by createdate or other properties
			properties: [
				"dealname",
				"amount",
				"property_address",
				"dealstage",
				"createdate",
			], // Customize the properties you want to retrieve
			limit: 1, // Limit the number of results to 1 since we're looking for a single deal
			after: "0", // Optional: Use this to paginate through results, starting from
		};

		// Search for deals in HubSpot with matching street address
		const response =
			await hubspotClient.crm.deals.searchApi.doSearch(objectSearchRequest);

		return NextResponse.json({
			exists: response.results.length > 0,
			deals: response.results.map((deal) => ({
				id: deal.id,
				name: deal.properties.dealname ?? "",
				address: deal.properties.property_address ?? "",
				amount: deal.properties.amount ?? "",
				stage: deal.properties.dealstage ?? "",
				created: deal.properties.createdate ?? "",
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
