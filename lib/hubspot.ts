// Client-side functions that call the server API endpoints
export async function searchBrokerByEmail(email: string): Promise<any> {
  const response = await fetch('/api/hubspot/broker', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to search broker');
  }

  return response.json();
}

export async function checkDuplicateDealName(name: string): Promise<boolean> {
  const response = await fetch('/api/hubspot/deal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to check deal name');
  }

  const data = await response.json();
  return data.exists;
}

export async function checkDuplicateAddress(address: string): Promise<boolean> {
  const response = await fetch('/api/hubspot/address', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to check address');
  }

  const data = await response.json();
  return data.exists;
}

// Mock functions for development
export async function createBroker(data: {
  email: string;
  firstName: string;
  lastName: string;
}): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    firstname: data.firstName,
    lastname: data.lastName,
    email: data.email,
    brokerid: Math.random().toString(36).substring(7),
  };
}

export async function createDeal(data: any): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: Math.random().toString(36).substring(7) };
}