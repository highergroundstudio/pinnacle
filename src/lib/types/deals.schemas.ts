import { z } from "zod"

export const DealFormSchema = z.object({
	dealname: z.string().min(2),
	dealstage: z.string(),

	transaction_type_raw: z.array(z.string().optional()),
	transaction_type: z.string().optional(),

	property_type_raw: z.array(z.string().optional()),
	property_type: z.string().optional(),

	property_type_future_raw: z.array(z.string().optional()),
	property_type_future: z.string().optional(),

	amount: z.number().optional(),
	amount_input: z.string().optional(),
	as_is_value: z.number().optional(),
	as_is_value_input: z.string().optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zip_code: z.string().length(5).regex(/^\d{5}$/).optional(),
	email: z.string().email().optional(),
	firstname: z.string().optional(),
	lastname: z.string().optional(),
	broker_id: z.string().optional(),
})

export const DealFormDataValidatedSchema = z.object({
	dealname: z.string(),
	dealstage: z.string(),
	transaction_type: z.string().optional(),
	property_type: z.string().optional(),
	property_type_future: z.string().optional(),
	amount: z.number().optional(),
	as_is_value: z.number().optional(),
	property_address: z.string().optional(),
	city: z.string().optional(),
	state_located_in: z.string().optional(),
	zip_code: z.number().optional(),
	email: z.string().email().optional(),
	firstname: z.string().optional(),
	lastname: z.string().optional(),
	hs_object_id: z.number().optional(),
})

// Define your Zod schemas
export const HubspotDealPropertiesSchema = z.object({
	dealname: z.string(),
	dealstage: z.string(),
	transaction_type: z.string(),
	property_type: z.string(),
	property_type__future_: z.string(),
	amount: z.union([z.string(), z.number()]),
	as_is_value: z.union([z.string(), z.number()]),
	property_address: z.string(),
	city: z.string(),
	state_located_in: z.string(),
	zip_code: z.union([z.string(), z.number()]),
})

export const HubspotDealPropsSchema = z.object({
	properties: HubspotDealPropertiesSchema,
})

export const HubspotDealResponseSchema = z.object({
	message: z.string(),
	id: z.number(),
	dealname: z.string(),
	address: z.string(),
})

export const BrokerInfo = z.object({
	email: z.string().optional(),
	firstname: z.string().optional(),
	fullname: z.string().optional(),
	brokerid: z.string().optional(),
	lastname: z.string().optional(),
})

const ResponseSchema = z.object({
	success: z.boolean(),
	fullname: z.string(),
	brokerid: z.string(),
	message: z.string(),
	id: z.string(),
	dealname: z.string(),
	address: z.string(),
})

export default {
	DealFormSchema,
	DealFormDataValidatedSchema,
	HubspotDealPropertiesSchema,
	HubspotDealPropsSchema,
	HubspotDealResponseSchema,
	ResponseSchema,
	BrokerInfo,
}
