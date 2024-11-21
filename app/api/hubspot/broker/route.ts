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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Search for contact in HubSpot
    const response = await hubspotClient.crm.contacts.searchApi.doSearch({
      filterGroups: [{
        filters: [{
          propertyName: 'email',
          operator: 'EQ',
          value: email
        }]
      }]
    });

    if (response.results.length > 0) {
      const contact = response.results[0];
      return NextResponse.json({
        firstname: contact.properties.firstname,
        lastname: contact.properties.lastname,
        email: contact.properties.email,
        brokerid: contact.id
      });
    }

    return NextResponse.json(null);
  } catch (error: any) {
    console.error('HubSpot API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}