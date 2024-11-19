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

// Simulated delay for testing
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for testing
const mockBrokers: Record<string, BrokerInfo> = {
  "john@example.com": {
    firstname: "John",
    lastname: "Smith",
    fullname: "John Smith",
    email: "john@example.com",
    brokerid: "123456"
  }
};

const mockDeals = [
  "123 Main Street",
  "456 Oak Avenue",
  "789 Pine Road"
];

export async function searchBrokerByEmail(email: string): Promise<BrokerInfo | null> {
  if (!email) {
    throw new Error("Email is required");
  }

  // Simulate API delay
  await delay(1500);

  // For testing: return mock data
  return mockBrokers[email] || null;
}

export async function createBroker(data: { 
  email: string; 
  firstName: string; 
  lastName: string; 
}): Promise<BrokerInfo> {
  // Simulate API delay
  await delay(1500);

  // For testing: return simulated response
  return {
    firstname: data.firstName,
    lastname: data.lastName,
    fullname: `${data.firstName} ${data.lastName}`,
    email: data.email,
    brokerid: Math.random().toString(36).substring(7),
  };
}

export async function checkDuplicateAddress(address: string): Promise<boolean> {
  // Simulate API delay
  await delay(1500);

  // For testing: randomly return true/false
  return Math.random() > 0.7;
}

export async function checkDuplicateDealName(name: string): Promise<boolean> {
  // Simulate API delay
  await delay(1000);

  // For testing: check against mock deals
  return mockDeals.some(deal => 
    deal.toLowerCase().includes(name.toLowerCase()) || 
    name.toLowerCase().includes(deal.toLowerCase())
  );
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
  // Simulate API delay
  await delay(1500);

  // For testing: return simulated response
  return { id: Math.random().toString(36).substring(7) };
}