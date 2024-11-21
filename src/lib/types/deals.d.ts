import { z } from "zod"
import Schemas from "$lib/types/deals.schemas"

// Export the TypeScript types from the Zod schemas using the `infer` utility
export type DealFormData = z.infer<typeof Schemas.DealFormSchema>
export type DealFormDataValidated = z.infer<
	typeof Schemas.DealFormDataValidatedSchema
>
export type HubspotDealProperties = z.infer<
	typeof Schemas.HubspotDealPropertiesSchema
>
export type HubspotDealProps = z.infer<typeof Schemas.HubspotDealPropsSchema>
export type Broker = z.infer<typeof Schemas.BrokerSchema>
export type HubspotDealResponse = z.infer<
	typeof Schemas.HubspotDealResponseSchema
>
export type BrokerInfo = z.infer<typeof Schemas.BrokerInfo>

export type Response = z.infer<typeof Schemas.ResponseSchema>
