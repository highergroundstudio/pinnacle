/**
 * This file contains functions related to creating a Hubspot deal from form data.
 * It includes functions for creating API properties, getting broker information,
 * searching for address matches, processing deal responses, and more.
 */
import type {
	HubspotDealProps,
	DealFormData,
	BrokerInfo,
	HubspotDealResponse,
	Response,
} from "$lib/types/deals"

import {
	DealFormSchema,
	HubspotDealPropsSchema,
} from "$lib/types/deals.schemas"

import { convertStateToAbbr } from "$lib/utils"

import type { SimplePublicObjectInputForCreate, AssociationSpec, PublicObjectSearchRequest } from "@hubspot/api-client/lib/codegen/crm/deals"

import { hubspotClient } from "$lib/hubspotClient"
import { PRIVATE_FOLDER_CREATION_URL } from "$env/static/private"

import chalk from 'chalk'
const log = console.log

import { Listr, PRESET_TIMER } from 'listr2'

/**
 * Create a hubspot deal from the form data
 * @param data Form data
 * @returns Deal response
 * @throws Error if something goes wrong
 */
export async function createDeal(data: DealFormData): Promise<Response> {
	const context = {
		apiProperties: {} as HubspotDealProps,
		brokerInfo: {} as BrokerInfo,
		dealResponse: {} as HubspotDealResponse,
	} // Initialize context to store data between tasks

	const tasks = new Listr<{ apiProperties?: HubspotDealProps, brokerInfo?: BrokerInfo, dealResponse?: HubspotDealResponse }, 'default'>(
		[
			{
				title: 'Create API Properties',
				task: async (ctx, task) => {
					task.output = 'Starting...'
					try {
						const apiProperties = await createApiProperties(data)
						task.title = 'API Properties Created'
						task.output = `API Properties: ${JSON.stringify(apiProperties)}`
						ctx.apiProperties = apiProperties
					} catch (error) {
						task.title = 'API Properties Creation Failed'
						task.output = `Error: ${(error as Error).message}`
						throw error
					}
				},
				rendererOptions: {
					timer: PRESET_TIMER
				}
			},
			{
				title: 'Get Broker Information',
				task: async (ctx, task) => {
					try {
						const brokerInfo = await getBrokerInfo(data)
						task.title = brokerInfo.brokerid ? 'Broker Info Found' : 'Broker Info Searched'
						task.output = `Broker Information: ${JSON.stringify(brokerInfo)}`
						ctx.brokerInfo = brokerInfo
					} catch (error) {
						task.title = 'Broker Info Retrieval Failed'
						task.output = `Error: ${(error as Error).message}`
						throw error
					}
				},
				rendererOptions: {
					timer: PRESET_TIMER
				}
			},
			{
				title: 'Create Hubspot Deal',
				task: async (ctx, task) => {
					try {
						const dealResponse = await createHubspotDeal(ctx.apiProperties as HubspotDealProps)
						task.title = 'Hubspot Deal Created'
						task.output = `Hubspot Deal Response: ${JSON.stringify(dealResponse)}`
						ctx.dealResponse = dealResponse
					} catch (error) {
						task.title = 'Hubspot Deal Creation Failed'
						task.output = `Error: ${(error as Error).message}`
						throw error
					}
				},
				rendererOptions: {
					timer: PRESET_TIMER
				}
			},
			{
				title: 'Create Folder',
				task: async (ctx, task) => {
					try {
						if (ctx.dealResponse && ctx.brokerInfo) {
							await processDealResponse(ctx.dealResponse, data, ctx.brokerInfo)
							task.title = 'Folder Created'
						} else {
							throw new Error('Deal response is undefined')
						}
					} catch (error) {
						task.title = 'Folder Creation Failed'
						task.output = `Error: ${(error as Error).message}`
						throw error
					}
				},
				rollback: async (ctx, task): Promise<void> => {
					task.title = 'Deleting deal, previous action failed.'
					// delete the deal
					if (ctx.dealResponse && ctx.dealResponse.id) {
						await deleteHubspotDeal(ctx.dealResponse.id)
					} else {
						throw new Error('Deal id is missing')
					}
				},
				rendererOptions: {
					timer: PRESET_TIMER
				}
			},
		],
		{
			concurrent: false
		}
	)

	try {
		await tasks.run(context)
		// Return the final result on success
		return {
			success: true,
			fullname: context.brokerInfo.fullname,
			brokerid: context.brokerInfo.brokerid?.toString(),
			message: context.dealResponse.message,
			id: context.dealResponse.id.toString(),
			dealname: context.dealResponse.dealname,
			address: context.dealResponse.address,
		} as Response
	} catch (error) {
		// Handle error and return an appropriate error message
		return {
			success: false,
			message: error instanceof Error ? error.message : "An unknown error occurred.",
		} as Response
	}
}

/**
 * Get broker information based on the provided form data
 * @param data Form data
 * @returns BrokerInfo object
 * @throws Error if firstname, lastname, and email are all missing
 */
export async function getBrokerInfo(data: DealFormData): Promise<BrokerInfo> {
	if (isNameProvided(data)) {
		return createBrokerInfo(data)
	}
	if (isEmailProvided(data)) {
		return await getHubspotBrokerInfo(data.email ?? '')
	}
	throw new Error("Firstname, lastname, and email are all missing.")
}

/**
 * Checks if the necessary name and broker ID fields are provided in the DealFormData object.
 * @param data - The DealFormData object to be checked.
 * @returns A boolean indicating whether the name and broker ID fields are provided.
 */
function isNameProvided(data: DealFormData): boolean {
	return data.firstname && data.lastname && data.broker_id ? true : false
}

/**
 * Creates a BrokerInfo object based on the provided DealFormData.
 * @param data The DealFormData used to create the BrokerInfo.
 * @returns The created BrokerInfo object.
 */
function createBrokerInfo(data: DealFormData): BrokerInfo {
	return {
		firstname: data.firstname,
		lastname: data.lastname,
		fullname: `${data.firstname} ${data.lastname}`,
		brokerid: data.broker_id,
	}
}

/**
 * Checks if the email is provided in the given DealFormData.
 * @param data - The DealFormData object.
 * @returns True if the email is provided, false otherwise.
 */
function isEmailProvided(data: DealFormData): boolean {
	return !!data.email
}

/**
 * Search hubspot for a address match on the deal
 * @param address Address to search for
 * @returns Response object
 */
export async function searchHubspotForAddressMatch(address: string) {
	try {
		// Define the search request
		const objectSearchRequest: PublicObjectSearchRequest = {
			filterGroups: [
				{
					filters: [
						{
							propertyName: 'property_address',
							// @ts-ignore
							operator: 'EQ',
							value: address,
						},
					],
				},
			],
			sorts: ['-createdate'], // Optional: Sort by createdate or other properties
			properties: ['dealname'], // Customize the properties you want to retrieve
			limit: 1, // Limit the number of results to 1 since we're looking for a single deal
			after: '0', // Optional: Use this to paginate through results, starting from
		}

		// Use the HubSpot API to search for deals based on the address
		const response = await hubspotClient.crm.deals.searchApi.doSearch(objectSearchRequest)

		// Check if any deals were found
		if (response.total > 0) {
			const deal = response.results[0]
			return {
				match: true,
				link: `https://app.hubspot.com/contacts/5587905/record/0-3/${deal.id}/`,
				dealname: deal.properties.dealname,
			}
		}

		// No deals found
		return { match: false, link: false, dealname: false }
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(`Error fetching deal information: ${error.message}`)
		}
	}
}


/**
 * Process the deal response and perform necessary actions
 * @param dealResponse Deal response from Hubspot
 * @param data Form data
 * @param brokerInfo Broker information
 * @throws Error if the deal response is not successful
 */
export async function processDealResponse(
	dealResponse: HubspotDealResponse,
	data: DealFormData,
	brokerInfo: BrokerInfo,
) {
	// Extract folder information and construct the Hubspot URL
	const folder = JSON.parse(data.dealstage).folder
	const hubspoturl = `https://app.hubspot.com/contacts/5587905/deal/${dealResponse.id}/`

	// Create a folder for the deal
	if (data.dealname && brokerInfo.fullname) {
		await createFolder(data.dealname, folder, brokerInfo.fullname, hubspoturl)
	} else {
		throw new Error("Deal name or broker full name is missing.")
	}

	// If both deal ID and broker ID are present, create a Hubspot association
	if (dealResponse.id && brokerInfo.brokerid) {
		await createHubspotAssociation(dealResponse.id, Number(brokerInfo.brokerid))
	}
}

/**
 * Given a hubspot email, get the contact information
 * @param email Email of the contact to get
 * @returns Promise to a contact object
 * @throws Error if the contact is not found
 */
export async function getHubspotBrokerInfo(email: string): Promise<BrokerInfo> {

	if (!email) {
		throw new Error("Email parameter is missing")
	}

	try {
		const apiResponse = await hubspotClient.crm.contacts.basicApi.getById(
			email,
			["firstname", "lastname"],
			undefined,
			undefined,
			false,
			"email",
		)

		const {
			firstname,
			lastname,
			email: brokerEmail,
			hs_object_id,
		} = apiResponse.properties

		const fullname = `${firstname} ${lastname}`

		log(chalk.green('Found broker info for %s'), fullname)


		return {
			firstname: firstname?.toString(),
			lastname: lastname?.toString(),
			fullname: fullname,
			email: brokerEmail as string,
			brokerid: hs_object_id as string,
		}
	} catch (error) {
		console.error(`Failed to get broker for email ${email}`, error)
		throw new Error("Failed to get broker")
	}
}

/**
 * Get the broker Id from hubspot
 * @param email Email of the contact to get
 * @returns Promise to a contact object
 * @throws Error if the contact is not found
 **/
export async function getHubspotBrokerId(email: string): Promise<string> {

	if (!email) {
		throw new Error("Email parameter is missing")
	}

	try {
		log(chalk.blue('Getting broker id for email: %s', email))
		const apiResponse = await hubspotClient.crm.contacts.basicApi.getById(
			email,
			[],
			undefined,
			undefined,
			false,
			"email",
		)

		//Return the broker id
		return apiResponse.properties.hs_object_id as string
	} catch (error) {

		console.error(`Failed to get broker for email ${email}`, error)
		throw new Error("Failed to get broker ID")
	}
}

/**
Transforms and validates the DealFormData object into a HubspotDealProps object.
@param {DealFormData} data - The DealFormData object to be transformed and validated.
@returns {Promise<HubspotDealProps>} - A Promise that resolves to a HubspotDealProps object.
*/
export async function createApiProperties(
	data: DealFormData,
): Promise<HubspotDealProps> {


	// Add the city and state to the deal name
	data.dealname = `${data.dealname} ${data.city} ${data.state ? convertStateToAbbr(data.state) : ""
		}`

	try {
		DealFormSchema.parse(data)
	} catch (error) {
		log(chalk.red('Validation failed: %s', error))
		throw new Error("Validation failed")
	}

	try {
		const apiProperties: HubspotDealProps = HubspotDealPropsSchema.parse({
			properties: {
				dealname: data.dealname,
				dealstage: JSON.parse(data.dealstage).hubspot,
				amount: data.amount,
				transaction_type: data.transaction_type,
				property_type: data.property_type,
				property_type__future_: data.property_type_future,
				as_is_value: data.as_is_value,
				property_address: data.address,
				city: data.city,
				state_located_in: data.state,
				zip_code: data.zip_code,
			},
		})

		return apiProperties
	} catch (error) {

		log(chalk.red('Validation failed: %s', error))
	}
	throw new Error("Validation failed")
}

/**
Create a folder using the api on unraid
@param {string} dealName - The name of the deal to be used in the folder name.
@param {string} dealStageFolder - The stage of the deal to be used in the folder name.
@param {string} brokerName - The name of the broker to be used in the folder name.
@returns {Promise<boolean>} - A Promise that resolves to a boolean.
@throws {Error} - Throws an error if the folder creation fails.
*/
export async function createFolder(
	dealName: string,
	dealStageFolder: string,
	brokerName: string,
	hubspoturl: string,
): Promise<boolean> {

	// Lets now create the folder
	const body = JSON.stringify({
		dealname: dealName,
		dealstage: dealStageFolder,
		brokername: brokerName,
		hubspoturl: hubspoturl,
	})

	try {
		await fetch(PRIVATE_FOLDER_CREATION_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		})

		return true;
	} catch (error) {
		log(chalk.red('Error creating folder: %s', error))
		console.log(error)
		throw new Error("Error creating folder");
	}
}

/**
 * Given a deal object, create a deal in Hubspot
 * @param apiProperties Deal object to create
 * @returns Promise to a deal object
 * @throws Error if the deal is not created
 */
export async function createHubspotDeal(
	apiProperties: HubspotDealProps,
): Promise<HubspotDealResponse> {

	try {
		const apiResponse = await hubspotClient.crm.objects.basicApi.create(
			"deals",
			apiProperties as unknown as SimplePublicObjectInputForCreate,
		)
		// log(chalk.green('Deal created successfully ID: %s', apiResponse.id))


		return {
			message: "Deal Created",
			id: parseInt(apiResponse.id, 10),
			dealname: apiProperties.properties.dealname,
			address: `${apiProperties.properties.property_address}, ${apiProperties.properties.city}, ${apiProperties.properties.state_located_in} ${apiProperties.properties.zip_code}`,
		}
	} catch (error) {

		let message = "Error Creating Deal"
		if (error instanceof Error) {
			message = JSON.stringify(error.message)
		}
		return {
			message: message,
			id: 0,
			dealname: "",
			address: "",
		}
	}
}/**
 * Deletes a Hubspot deal.
 * @param {number} dealId - The ID of the deal to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the deal was successfully deleted.
 * @throws An error if there was an issue deleting the deal.
 */
export async function deleteHubspotDeal(dealId: number): Promise<boolean> {
	try {
		await hubspotClient.crm.objects.basicApi.archive(
			"deals",
			dealId as unknown as string,
		)
		return true;
	} catch (error) {
		log(chalk.red("Error deleting deal: %s", error));

		throw new Error("Error deleting deal");
	}
}

/**
Create an association between a deal and a broker on Hubspot.
@param {number} dealId - The ID of the deal to be associated with the broker.
@param {number} brokerid - The ID of the broker to be associated with the deal.
@returns {Promise<boolean>} - A Promise that resolves to a boolean. Returns true if the association is created successfully, false otherwise.
@throws Error if the association is not created
*/
export async function createHubspotAssociation(
	dealId: number,
	brokerid: number,
): Promise<boolean> {

	// log(chalk.blue(`Creating association between broker: ${brokerid} and deal: ${dealId}`))
	//Now lets create an association between the deal and the broker using the hubspotClient
	try {
		const association: AssociationSpec = {
			// @ts-ignore
			associationCategory: "HUBSPOT_DEFINED",
			associationTypeId: 3 //"dealToContact" from https://legacydocs.hubspot.com/docs/methods/crm-associations/crm-associations-overview
		}

		const associations = [association]

		await hubspotClient.crm.associations.v4.basicApi.create(
			"deals",
			dealId as unknown as string,
			"contacts",
			brokerid as unknown as string,
			associations
		)
		// log(chalk.blue('Association created successfully'))

		return true
	} catch (error) {
		log(chalk.red('Failed to create Hubspot association: %s', error))

		throw new Error("Error in Association Hubspot API call")
	}
}


