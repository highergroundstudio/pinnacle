import { NextResponse } from "next/server";
import { Client } from "@hubspot/api-client";
import { getFullStateName } from "@/lib/utils";

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
		const body = await request.json();

		// Convert state abbreviation to full name
		if (body.properties.state_located_in) {
			body.properties.state_located_in = getFullStateName(
				body.properties.state_located_in,
			);
		}

		// Create the deal in HubSpot
		const deal = await hubspotClient.crm.deals.basicApi.create({
			properties: body.properties,
		});

		// If there's a broker to associate
		if (body.associations?.[0]?.to?.id) {
			try {
				const association = {
					associationCategory: "HUBSPOT_DEFINED",
					associationTypeId: 3, // dealToContact association type
				};

				await hubspotClient.crm.associations.v4.basicApi.create(
					"deals",
					deal.id,
					"contacts",
					body.associations[0].to.id,
					[association],
				);
			} catch (associationError) {
				console.error("Failed to create association:", associationError);
				// Don't fail the whole request if association fails
			}
		}

		return NextResponse.json({
			id: deal.id,
			dealUrl: `${process.env.NEXT_PUBLIC_HUBSPOT_URL}/deal/${deal.id}`,
		});
	} catch (error: any) {
		console.error("HubSpot API error:", error);
		return NextResponse.json(
			{ error: error.message || "Internal server error" },
			{ status: 500 },
		);
	}
}
