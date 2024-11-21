import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { dealFormSchema } from "./schema";
import type { z } from "zod";
import { unitedStatesList } from "./vars";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

export function getFullStateName(abbreviation: string): string {
	const state = unitedStatesList.find(
		(state) => state.abbreviation === abbreviation,
	);
	return state?.name || abbreviation;
}

export function mapFormToHubspotProperties(
	data: z.infer<typeof dealFormSchema>,
) {
	const primaryAddress = data.addresses[0];
	return {
		dealname: data.deal.name || primaryAddress.street,
		dealstage: data.deal.stage,
		transaction_type: data.deal.transactionType.join("; "),
		property_type: data.deal.propertyType.join("; "),
		property_type__future_: data.deal.propertyTypeFuture.join("; "),
		amount: data.deal.amount,
		as_is_value: data.deal.asIsValue,
		property_address: primaryAddress.street,
		city: primaryAddress.city,
		state_located_in: getFullStateName(primaryAddress.state),
		zip_code: primaryAddress.zipCode,
	};
}

export function areAddressFieldsFilled(address: {
	street?: string;
	city?: string;
	state?: string;
	zipCode?: string;
}) {
	return !!(address.street && address.city && address.state && address.zipCode);
}
