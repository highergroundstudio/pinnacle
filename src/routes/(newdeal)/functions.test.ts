import { describe, test, expect, vi, beforeEach, afterEach } from "vitest"

import {
	getBrokerInfo,
	processDealResponse,
	getHubspotBrokerInfo,
	getHubspotBrokerId,
	createApiProperties,
} from "./functions"

import type {
	DealFormData,
	BrokerInfo,
	HubspotDealResponse,
	HubspotDealProps,
} from "$lib/types/deals"

describe("Deal Functions | getHubspotBrokerInfo", () => {
	test("should return broker info when the API call is successful", async () => {
		const expectedResult = {
			email: "kyle.king@elevatedequities.com",
			firstname: "Kyle",
			id: "7451",
			fullname: "Kyle King",
			lastname: "King",
		}
		const result = await getHubspotBrokerInfo("kyle.king@elevatedequities.com")
		expect(result).toEqual(expectedResult)
	})

	test("should throw an error when the API call fails", async () => {
		await expect(getHubspotBrokerInfo("invalidemail")).rejects.toThrow(
			"Failed to get broker",
		)
	})
})

describe("Deal Functions | getHubspotBrokerId", () => {
	test("should return broker id when the API call is successful", async () => {
		const result = await getHubspotBrokerId("kyle.king@elevatedequities.com")
		expect(result).toEqual("7451")
	})

	test("should throw an error when the API call fails due to invalide email", async () => {
		await expect(getHubspotBrokerId("invalidemail")).rejects.toThrow(
			"Failed to get broker ID",
		)
	})
})

describe("Deal Functions | createApiProperties", () => {
	test("should expose a function", () => {
		expect(createApiProperties).toBeDefined()
	})

	test("createApiProperties should return expected output", async () => {
		const data: DealFormData = {
			dealname: "Buy More Test Deal",
			dealstage: '{"name":"test","hubspot":"62553446","folder":"test"}',
			transaction_type_raw: [
				"Cashout",
				"Construction",
				"Bridge",
				"Rehab/Construction",
			],
			transaction_type: "Cashout; Construction; Bridge; Rehab/Construction",
			property_type_raw: [
				"Industrial",
				"Mixed-use",
				"Mobile Home Park",
				"Hospitality",
				"1-4 Unit Residential Rental",
			],
			property_type:
				"Industrial; Mixed-use; Mobile Home Park; Hospitality; 1-4 Unit Residential Rental",
			property_type_future_raw: [
				"Retail",
				"Self Storage",
				"1-4 Unit Residential Rental",
				"Assisted Living",
				"Office",
				"Agricultural",
				"Other",
			],
			property_type_future:
				"Retail; Self Storage; 1-4 Unit Residential Rental; Assisted Living; Office; Agricultural; Other",
			amount: 10000000,
			amount_input: "10,000,000",
			as_is_value: 20000000,
			as_is_value_input: "20,000,000",
			address: "9000 Burbank Boulevard",
			city: "Burbank",
			state: "California",
			zip_code: "91506",
			email: "kyle.king@elevatedequities.com",
			firstname: "Kyle",
			lastname: "King",
			broker_id: "7451",
		}

		const expectedResult: HubspotDealProps = {
			properties: {
				dealname: "Buy More Test Deal Burbank CA",
				dealstage: "62553446",
				transaction_type: "Cashout; Construction; Bridge; Rehab/Construction",
				property_type:
					"Industrial; Mixed-use; Mobile Home Park; Hospitality; 1-4 Unit Residential Rental",
				property_type__future_:
					"Retail; Self Storage; 1-4 Unit Residential Rental; Assisted Living; Office; Agricultural; Other",
				amount: 10000000,
				as_is_value: 20000000,
				property_address: "9000 Burbank Boulevard",
				city: "Burbank",
				state_located_in: "California",
				zip_code: "91506",
			},
		}
		const result = await createApiProperties(data)
		console.log(result)
		expect(result).toEqual(expectedResult)
	})
})

// Test cases for getBrokerInfo function
describe("getBrokerInfo", () => {
	test("should return a BrokerInfo object when firstname and lastname are provided", async () => {
		const data: DealFormData = {
			dealname: "Buy More Test Deal",
			dealstage: '{"name":"test","hubspot":"62553446","folder":"test"}',
			transaction_type_raw: [
				"Cashout",
				"Construction",
				"Bridge",
				"Rehab/Construction",
			],
			transaction_type: "Cashout; Construction; Bridge; Rehab/Construction",
			property_type_raw: [
				"Industrial",
				"Mixed-use",
				"Mobile Home Park",
				"Hospitality",
				"1-4 Unit Residential Rental",
			],
			property_type:
				"Industrial; Mixed-use; Mobile Home Park; Hospitality; 1-4 Unit Residential Rental",
			property_type_future_raw: [
				"Retail",
				"Self Storage",
				"1-4 Unit Residential Rental",
				"Assisted Living",
				"Office",
				"Agricultural",
				"Other",
			],
			property_type_future:
				"Retail; Self Storage; 1-4 Unit Residential Rental; Assisted Living; Office; Agricultural; Other",
			amount: 10000000,
			amount_input: "10,000,000",
			as_is_value: 20000000,
			as_is_value_input: "20,000,000",
			address: "9000 Burbank Boulevard",
			city: "Burbank",
			state: "California",
			zip_code: "91506",
			email: "kyle.king@elevatedequities.com",
			firstname: "Kyle",
			lastname: "King",
			broker_id: "7451",
		}

		const brokerInfo = await getBrokerInfo(data)
		expect(brokerInfo).toEqual({
			firstname: "Kyle",
			lastname: "King",
			fullname: "Kyle King",
			brokerid: "7451",
		})
	})

	test("should throw an error when firstname, lastname, and email are all missing", async () => {
		const data: DealFormData = {
			dealname: "Buy More Test Deal",
			dealstage: '{"name":"test","hubspot":"62553446","folder":"test"}',
			transaction_type_raw: [
				"Cashout",
				"Construction",
				"Bridge",
				"Rehab/Construction",
			],
			transaction_type: "Cashout; Construction; Bridge; Rehab/Construction",
			property_type_raw: [
				"Industrial",
				"Mixed-use",
				"Mobile Home Park",
				"Hospitality",
				"1-4 Unit Residential Rental",
			],
			property_type:
				"Industrial; Mixed-use; Mobile Home Park; Hospitality; 1-4 Unit Residential Rental",
			property_type_future_raw: [
				"Retail",
				"Self Storage",
				"1-4 Unit Residential Rental",
				"Assisted Living",
				"Office",
				"Agricultural",
				"Other",
			],
			property_type_future:
				"Retail; Self Storage; 1-4 Unit Residential Rental; Assisted Living; Office; Agricultural; Other",
			amount: 10000000,
			amount_input: "10,000,000",
			as_is_value: 20000000,
			as_is_value_input: "20,000,000",
			address: "9000 Burbank Boulevard",
			city: "Burbank",
			state: "California",
			zip_code: "91506",
			email: "",
			firstname: "",
			lastname: "",
			broker_id: "",
		}

		await expect(getBrokerInfo(data)).rejects.toThrow(
			"Firstname, lastname, and email are all missing.",
		)
	})

	// Add more test cases if necessary
})

// Test cases for processDealResponse function
// describe("processDealResponse", () => {
// 	// Mock the createFolder and createHubspotAssociation functions
// 	const createFolderMock = vi.fn()
// 	const createHubspotAssociationMock = vi.fn()

// 	// Mock implementations for the createFolder and createHubspotAssociation functions
// 	beforeEach(() => {
// 		createFolderMock.mockImplementation(() => Promise.resolve())
// 		createHubspotAssociationMock.mockImplementation(() => Promise.resolve())
// 	})

// 	// Reset the mocks after each test
// 	afterEach(() => {
// 		createFolderMock.mockReset()
// 		createHubspotAssociationMock.mockReset()
// 	})

// 	test("should throw an error if the deal response is not successful", async () => {
// 		const dealResponse: HubspotDealResponse = {
// 			dealname: "Buy More Test Deal",
// 			message: "Deal creation failed.",
// 			id: 0,
// 		}
// 		const data: DealFormData = {
// 			dealname: "Buy More Test Deal",
// 			dealstage: '{"name":"test","hubspot":"62553446","folder":"test"}',
// 			transaction_type_raw: [
// 				"Cashout",
// 				"Construction",
// 				"Bridge",
// 				"Rehab/Construction",
// 			],
// 			transaction_type: "Cashout; Construction; Bridge; Rehab/Construction",
// 			property_type_raw: [
// 				"Industrial",
// 				"Mixed-use",
// 				"Mobile Home Park",
// 				"Hospitality",
// 				"1-4 Unit Residential Rental",
// 			],
// 			property_type:
// 				"Industrial; Mixed-use; Mobile Home Park; Hospitality; 1-4 Unit Residential Rental",
// 			property_type_future_raw: [
// 				"Retail",
// 				"Self Storage",
// 				"1-4 Unit Residential Rental",
// 				"Assisted Living",
// 				"Office",
// 				"Agricultural",
// 				"Other",
// 			],
// 			property_type_future:
// 				"Retail; Self Storage; 1-4 Unit Residential Rental; Assisted Living; Office; Agricultural; Other",
// 			amount: 10000000,
// 			amount_input: "10,000,000",
// 			as_is_value: 20000000,
// 			as_is_value_input: "20,000,000",
// 			address: "9000 Burbank Boulevard",
// 			city: "Burbank",
// 			state: "California",
// 			zip_code: "91506",
// 			email: "kyle.king@elevatedequities.com",
// 			firstname: "Kyle",
// 			lastname: "King",
// 			broker_id: "7451",
// 		}
// 		const brokerInfo: BrokerInfo = {
// 			firstname: "Kyle",
// 			lastname: "King",
// 			fullname: "Kyle King",
// 			brokerid: "7451",
// 		}

// 		await expect(
// 			processDealResponse(dealResponse, data, brokerInfo),
// 		).rejects.toThrow("Deal creation failed.")
// 	})

// 	// Add more test cases if necessary
// })
