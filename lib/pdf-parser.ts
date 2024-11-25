import { PDFDocument, type PDFTextField } from "pdf-lib";

export interface ParsedField {
	name: string;
	value: string;
}

// Define the desired order of field names
const desiredOrder = [
	"Deal Name",
	"Funding Request Amount",
	"List of Uses",
	"List of Sources",
	"Current Value",
	"Original Purchase Price",
	"Original Purchase Date",
	"Cost of Improvements Since Purchase",
	"Loan Purpose",
	"LTV Requested",
	"Deadline Dates",
	"Terms Requested (in Months)",
	"Cash Out Requested",
	"Cash Out Reason",
	"Existing Loan Balances and Lender Names",
	"Exit Strategy to pay off loan",
	"Property Type",
	"Property Address",
	"Property Size (Acres)",
	"Property Existing Sqft",
	"Number of Buildings",
	"Number of Units",
	"Year Built",
	"Year Renovated",
	"Property Description",
	"Current Occupancy",
	"Current Annual NOI/EBITDA",
	"Purchase Price",
	"Close Date",
	"Description of Improvements",
	"Borrowing Entity Name",
	"Owner Names",
	"Owners' Combined Net Worth",
	"Owners' Combined Liquidity",
	"Owners' Cash Invested to Date",
	"Owners' Credit Scores / Rating",
	"Owner Experience",
	"Are any Owners foreign nationals? Description of any owner credit or criminal issues",
	"Borrower Situation & File Notes",
];

export async function extractPDFContent(file: File): Promise<ParsedField[]> {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const pdfDoc = await PDFDocument.load(arrayBuffer);
		const form = pdfDoc.getForm();
		const fields = form.getFields();

		if (fields.length === 0) {
			throw new Error("No form fields found in the PDF");
		}

		const parsedFields = fields
			.map((field): ParsedField | undefined => {
				let name = field.getName();
				console.log("Field name:", name);
				let value = "";

				// Get text value based on field type
				if ("getText" in field) {
					if (field.constructor.name === "PDFTextField") {
						value = (field as PDFTextField).getText() || "";
					}
				}

				// Format currency values
				if (name.toLowerCase().includes("$") && value) {
					try {
						value = Number(value.replace(/[^0-9.-]+/g, "")).toLocaleString(
							"en-US",
							{
								style: "currency",
								currency: "USD",
								minimumFractionDigits: 0,
								maximumFractionDigits: 0,
							},
						);
						name = name.replace(/\(\$\)/g, "").trim();
					} catch (e) {
						// If number parsing fails, keep original value
						console.warn(`Failed to parse currency value for field: ${name}`);
					}
				}

				return value ? { name, value } : undefined;
			})
			.filter((field): field is ParsedField => field !== undefined);

		// Sort the parsed fields based on the desired order
		parsedFields.sort((a, b) => {
			const indexA = desiredOrder.indexOf(a.name);
			const indexB = desiredOrder.indexOf(b.name);
			if (indexA === -1 && indexB === -1) return 0;
			if (indexA === -1) return 1;
			if (indexB === -1) return -1;
			return indexA - indexB;
		});

		return parsedFields;
	} catch (error) {
		console.error("PDF parsing error:", error);
		throw new Error(
			"Failed to process PDF. Please ensure it contains form fields.",
		);
	}
}
