import { NextResponse } from 'next/server';
import { Client } from '@hubspot/api-client';

const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_TOKEN
});

export async function POST(request: Request) {
  if (!process.env.HUBSPOT_TOKEN) {
    return NextResponse.json(
      { error: "HubSpot token not configured" },
      { status: 500 }
    );
  }

  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Search for deals in HubSpot with matching address
    const response = await hubspotClient.crm.deals.searchApi.doSearch({
      filterGroups: [{
        filters: [{
          propertyName: 'property_address',
          operator: 'EQ',
          value: address
        }]
      }]
    });

    return NextResponse.json({
      exists: response.results.length > 0
    });
  } catch (error: any) {
    console.error('HubSpot API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}