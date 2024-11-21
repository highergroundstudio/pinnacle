import type { RequestHandler } from "@sveltejs/kit"
import { PRIVATE_FOLDER_CREATION_URL } from "$env/static/private"
import chalk from 'chalk'

const log = console.log

export const GET: RequestHandler = async ({ url }) => {
    console.log('GET request received')

    // return new Response(`GET request received with dealName: ${url.searchParams.get('dealName')}`)
    try {
        const dealName = url.searchParams.get('dealName') ?? ''
        const dealStageFolder = url.searchParams.get('dealStageFolder') ?? ''
        const brokerName = url.searchParams.get('brokerName') ?? ''
        const hubspoturl = url.searchParams.get('hubspoturl') ?? ''

        console.log(dealName, dealStageFolder, brokerName, hubspoturl)

        // Check if any of the parameters are undefined
        if (dealName === '' || dealStageFolder === '' || brokerName === '' || hubspoturl === '') {
            throw new Error("One or more parameters are undefined")
        }

        // Call the createFolder function
        await createFolder(dealName, dealStageFolder, brokerName, hubspoturl)

        return new Response("Folder created successfully")
    } catch (error) {
        log(chalk.red('Error handling GET request: %s', error))
        return new Response("Error handling GET request", { status: 500 })
    }
}

/**
 * Create a folder using the API on Unraid
 * @param {string} dealName - The name of the deal to be used in the folder name.
 * @param {string} dealStageFolder - The stage of the deal to be used in the folder name.
 * @param {string} brokerName - The name of the broker to be used in the folder name.
 * @param {string} hubspoturl - The HubSpot URL.
 * @returns {Promise<void>} - A Promise.
 * @throws {Error} - Throws an error if the folder creation fails.
 */
async function createFolder(
    dealName: string,
    dealStageFolder: string,
    brokerName: string,
    hubspoturl: string,
): Promise<void> {
    // Construct URL with query parameters
    const url = `${PRIVATE_FOLDER_CREATION_URL}?dealname=${dealName}&dealstage=${dealStageFolder}&brokername=${brokerName}&hubspoturl=${hubspoturl}`

    try {
        const response = await fetch(url, {
            method: "GET",
        })

        if (!response.ok) {
            throw new Error(`Failed to create folder: ${response.statusText}`)
        }
    } catch (error) {
        log(chalk.red('Error creating folder: %s', error))
        throw new Error("Error creating folder")
    }
}
