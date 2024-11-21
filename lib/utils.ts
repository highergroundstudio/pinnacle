import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { dealFormSchema } from './schema';
import type { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function mapFormToHubspotProperties(
  formData: z.infer<typeof dealFormSchema>
) {
  const primaryAddress = formData.addresses[0];
  return {
    dealname: formData.deal.name || primaryAddress.street,
    dealstage: formData.deal.stage,
    transaction_type: formData.deal.transactionType.join("; "),
    property_type: formData.deal.propertyType.join("; "),
    property_type__future_: formData.deal.propertyTypeFuture.join("; "),
    amount: formData.deal.amount,
    as_is_value: formData.deal.asIsValue,
    property_address: primaryAddress.street,
    city: primaryAddress.city,
    state_located_in: primaryAddress.state,
    zip_code: primaryAddress.zipCode,
  };
}

export function areAddressFieldsFilled(address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}) {
  return !!(
    address.street &&
    address.city &&
    address.state &&
    address.zipCode
  );
}