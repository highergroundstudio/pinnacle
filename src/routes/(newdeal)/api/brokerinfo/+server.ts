import { json } from "@sveltejs/kit"
import type { RequestHandler } from "@sveltejs/kit"

import { getHubspotBrokerInfo } from "../../functions.js"

export const GET: RequestHandler = async ({ url }) => {
	//get the email from the get request
	const email = url.searchParams.get("email") as string
	if (!email) {
		throw new Error("Email parameter is missing")
	}
	try {
		const info = await getHubspotBrokerInfo(email)
		return json(info)
	} catch (error: unknown) {
		if (error instanceof Error) {
			return json({ id: false, error: error.message }, { status: 500 })
		}
		// Handle other types of errors
		return json({ id: false, error: "Unknown error occurred" }, { status: 500 })
	}
}
