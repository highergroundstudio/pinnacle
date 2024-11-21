import { Client } from "@hubspot/api-client"
import { PRIVATE_HUBSPOT_ACCESS_TOKEN } from "$env/static/private"

export const hubspotClient = new Client({
	accessToken: PRIVATE_HUBSPOT_ACCESS_TOKEN,
	limiterOptions: {
		minTime: 1000 / 9,
		maxConcurrent: 6,
		id: "hubspot-client-limiter",
	},
	numberOfApiCallRetries: 3,
})
