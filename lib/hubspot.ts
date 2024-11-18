import { Client } from '@hubspot/api-client';

const hubspotClient = new Client({ 
  accessToken: process.env.NEXT_PUBLIC_HUBSPOT_TOKEN 
});

export interface BrokerInfo {
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  brokerid: string;
}

export async function searchBrokerByEmail(email: string): Promise<BrokerInfo | null> {
  if (!email) {
    throw new Error("Email is required");
  }

  try {
    const apiResponse = await hubspotClient.crm.contacts.basicApi.getById(
      email,
      ["firstname", "lastname", "email"],
      undefined,
      undefined,
      false,
      "email"
    );

    const {
      firstname,
      lastname,
      email: brokerEmail,
      hs_object_id,
    } = apiResponse.properties;

    const fullname = `${firstname} ${lastname}`;

    console.log("Found broker info for", fullname);

    return {
      firstname: firstname?.toString() || "",
      lastname: lastname?.toString() || "",
      fullname,
      email: brokerEmail as string,
      brokerid: hs_object_id as string,
    };
  } catch (error: any) {
    console.error('Error searching HubSpot contact:', error?.message || error);
    if (error?.message?.includes('unauthorized')) {
      throw new Error('Invalid HubSpot API token. Please check your settings.');
    }
    return null;
  }
}

export async function createBroker(data: { 
  email: string; 
  firstName: string; 
  lastName: string; 
}): Promise<BrokerInfo> {
  try {
    const simplePublicObjectInput = {
      properties: {
        email: data.email,
        firstname: data.firstName,
        lastname: data.lastName
      }
    };

    const apiResponse = await hubspotClient.crm.contacts.basicApi.create(simplePublicObjectInput);

    return {
      firstname: apiResponse.properties.firstname,
      lastname: apiResponse.properties.lastname,
      fullname: `${apiResponse.properties.firstname} ${apiResponse.properties.lastname}`,
      email: apiResponse.properties.email,
      brokerid: apiResponse.id,
    };
  } catch (error: any) {
    console.error('Error creating HubSpot contact:', error?.message || error);
    if (error?.message?.includes('unauthorized')) {
      throw new Error('Invalid HubSpot API token. Please check your settings.');
    }
    throw new Error('Failed to create broker. Please try again.');
  }
}

export async function checkDuplicateAddress(address: string): Promise<boolean> {
  try {
    const publicObjectSearchRequest = {
      filterGroups: [{
        filters: [{
          propertyName: 'address',
          operator: 'EQ',
          value: address
        }]
      }]
    };

    const apiResponse = await hubspotClient.crm.deals.searchApi.doSearch({
      ...publicObjectSearchRequest,
      limit: 1
    });

    return apiResponse.total > 0;
  } catch (error: any) {
    console.error('Error checking duplicate address:', error?.message || error);
    if (error?.message?.includes('unauthorized')) {
      throw new Error('Invalid HubSpot API token. Please check your settings.');
    }
    throw new Error('Failed to check address. Please try again.');
  }
}

export async function createDeal(data: {
  name: string;
  stage: string;
  amount: number;
  asIsValue: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  transactionType: string[];
  propertyType: string[];
  propertyTypeFuture: string[];
  brokerId: string;
}): Promise<{ id: string; }> {
  try {
    const simplePublicObjectInput = {
      properties: {
        dealname: data.name,
        dealstage: data.stage,
        amount: data.amount.toString(),
        as_is_value: data.asIsValue.toString(),
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zipCode,
        transaction_type: data.transactionType.join(';'),
        property_type: data.propertyType.join(';'),
        property_type_future: data.propertyTypeFuture.join(';')
      },
      associations: [{
        to: { id: data.brokerId },
        types: [{ category: "HUBSPOT_DEFINED", typeId: 3 }]
      }]
    };

    const apiResponse = await hubspotClient.crm.deals.basicApi.create(simplePublicObjectInput);
    return { id: apiResponse.id };
  } catch (error: any) {
    console.error('Error creating HubSpot deal:', error?.message || error);
    if (error?.message?.includes('unauthorized')) {
      throw new Error('Invalid HubSpot API token. Please check your settings.');
    }
    throw new Error('Failed to create deal. Please try again.');
  }
}