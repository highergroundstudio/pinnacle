import { json } from "@sveltejs/kit"
import type { RequestHandler } from "@sveltejs/kit"
import { searchHubspotForAddressMatch } from "../../functions.js"

export const GET: RequestHandler = async ({ url }) => {
    // Extract the 'address' parameter from the URL
    const address = url.searchParams.get("address")

    // Check if 'address' parameter is missing or empty
    if (!address) {
        return json({ match: false, error: "Address parameter is missing" }, { status: 400 })
    }

    // Call the searchHubspotForAddressMatch function
    const response = await searchHubspotForAddressMatch(address)

    if (response && response.match) {
        // If there is a match, return it as JSON
        return json({ ...response })
    } else {
        // If there is no match, return 'match' as false
        return json({ match: false })
    }
}
