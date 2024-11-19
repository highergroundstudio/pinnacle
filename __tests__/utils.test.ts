import { describe, it, expect } from 'vitest';
import { formatCurrency, mapFormToHubspotProperties, areAddressFieldsFilled } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats numbers as USD currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(1000000)).toBe('$1,000,000');
    expect(formatCurrency(0)).toBe('$0');
    expect(formatCurrency(-1000)).toBe('-$1,000');
  });
});

describe('mapFormToHubspotProperties', () => {
  it('correctly maps form data to Hubspot properties', () => {
    const formData = {
      broker: {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        hubspotId: '123'
      },
      deal: {
        name: 'Test Deal',
        stage: 'appointmentscheduled',
        transactionType: ['Purchase', 'Refinance'],
        propertyType: ['Multifamily'],
        propertyTypeFuture: ['Office'],
        amount: 1000000,
        asIsValue: 2000000
      },
      address: {
        street: '123 Main St',
        city: 'Test City',
        state: 'California',
        zipCode: '12345'
      }
    };

    const result = mapFormToHubspotProperties(formData);

    expect(result).toEqual({
      dealname: 'Test Deal',
      dealstage: 'appointmentscheduled',
      transaction_type: 'Purchase; Refinance',
      property_type: 'Multifamily',
      property_type__future_: 'Office',
      amount: 1000000,
      as_is_value: 2000000,
      property_address: '123 Main St',
      city: 'Test City',
      state_located_in: 'California',
      zip_code: '12345'
    });
  });

  it('uses street address as deal name when name is not provided', () => {
    const formData = {
      broker: { email: 'test@example.com' },
      deal: {
        name: '',
        stage: 'appointmentscheduled',
        transactionType: ['Purchase'],
        propertyType: ['Office'],
        propertyTypeFuture: ['Office'],
        amount: 1000000,
        asIsValue: 2000000
      },
      address: {
        street: '123 Main St',
        city: 'Test City',
        state: 'California',
        zipCode: '12345'
      }
    };

    const result = mapFormToHubspotProperties(formData);
    expect(result.dealname).toBe('123 Main St');
  });
});

describe('areAddressFieldsFilled', () => {
  it('returns true when all address fields are filled', () => {
    const address = {
      street: '123 Main St',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345'
    };
    expect(areAddressFieldsFilled(address)).toBe(true);
  });

  it('returns false when any address field is missing', () => {
    expect(areAddressFieldsFilled({
      street: '123 Main St',
      city: '',
      state: 'CA',
      zipCode: '12345'
    })).toBe(false);

    expect(areAddressFieldsFilled({
      street: '123 Main St',
      city: 'Test City',
      state: '',
      zipCode: '12345'
    })).toBe(false);
  });
});