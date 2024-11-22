import { PDFDocument } from "pdf-lib";

export interface ParsedField {
	name: string;
	value: string;
}

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
				const name = field.getName();
				let value = "";

				// Get text value based on field type
				if ("getText" in field) {
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					value = (field as any).getText() || "";
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
					} catch (e) {
						// If number parsing fails, keep original value
						console.warn(`Failed to parse currency value for field: ${name}`);
					}
				}

				return value ? { name, value } : undefined;
			})
			.filter((field): field is ParsedField => field !== undefined)
			.sort((a, b) => a.name.localeCompare(b.name));

		return parsedFields;
	} catch (error) {
		console.error("PDF parsing error:", error);
		throw new Error(
			"Failed to process PDF. Please ensure it contains form fields.",
		);
	}
}
