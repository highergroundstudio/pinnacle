import { describe, expect, test } from "vitest"
import {
	convertStateToAbbr,
	convertStringToList,
	currencyToNumber,
	formDataToObject,
} from "./utils"

describe("Utilities | currencyToNumber", () => {
	test("should return a number", () => {
		expect(currencyToNumber("1.00")).toBe(1)
		expect(currencyToNumber("$1.00")).toBe(1)
		expect(currencyToNumber("1.00,")).toBe(1)
		expect(currencyToNumber("1,000.00")).toBe(1000)
		expect(currencyToNumber("1,000,000.00")).toBe(1000000)
		expect(currencyToNumber("")).toBe(0)
		expect(currencyToNumber(564655)).toBe(564655)
	})
})

describe("Utilities | convertStateToAbbr", () => {
	test("should return the abbreviation for a valid state name", () => {
		const stateName = "Arizona"
		const expectedResult = "AZ"

		const result = convertStateToAbbr(stateName)

		expect(result).toEqual(expectedResult)
	})

	test("should throw an error for an invalid state name", () => {
		const invalidStateName = "InvalidState"
		const expectedResult = ""
		const result = convertStateToAbbr(invalidStateName)
		console.log(result)

		expect(result).toEqual(expectedResult)
	})
})

describe("Utilities | convertStringToList", () => {
	test("should correctly process JSON array and return joined string", () => {
		const jsonArray = '["Rehab/Construction","Purchase"]'
		const expectedResult = "Rehab/Construction;Purchase"

		const result = convertStringToList(jsonArray)

		expect(result).toEqual(expectedResult)
	})

	test("should correctly handle an empty JSON array", () => {
		const emptyArray = "[]"
		const expectedResult = ""

		const result = convertStringToList(emptyArray)

		expect(result).toEqual(expectedResult)
	})
})

describe("Utilities | formDataToObject", () => {
	test("should convert an empty FormData object to an empty object", () => {
		const formData = new FormData()
		const expected = {}
		const result = formDataToObject(formData)

		expect(result).toEqual(expected)
	})

	test("should convert a FormData object with one key-value pair to an object with the same key-value pair", () => {
		const formData = new FormData()
		formData.append("key1", "value1")

		const expected = {
			key1: "value1",
		}

		const result = formDataToObject(formData)

		expect(result).toEqual(expected)
	})

	test("should convert a FormData object with multiple key-value pairs to an object with the same key-value pairs", () => {
		const formData = new FormData()
		formData.append("key1", "value1")
		formData.append("key2", "value2")
		formData.append("key3", "value3")

		const expected = {
			key1: "value1",
			key2: "value2",
			key3: "value3",
		}

		const result = formDataToObject(formData)

		expect(result).toEqual(expected)
	})

	test("should handle values of different types", () => {
		const formData = new FormData()
		formData.append("key1", "value1")
		formData.append("key2", "123")
		formData.append("key3", "true")

		const expected = {
			key1: "value1",
			key2: "123", // FormData only stores values as strings
			key3: "true", // FormData only stores values as strings
		}

		const result = formDataToObject(formData)

		expect(result).toEqual(expected)
	})
})
