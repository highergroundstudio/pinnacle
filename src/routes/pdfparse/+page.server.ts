import { fail } from '@sveltejs/kit'
import { PDFDocument } from 'pdf-lib'
import { redirect } from '@sveltejs/kit'

interface ParsedField {
    name: string
    value: string | number
}

export const actions = {
    default: async ({ request }) => {
        console.log('PDF Parsing')
        const formData = await request.formData()

        const parseMode = formData.get('parseMode') as string | null
        console.log(parseMode)
        const fileToUpload = formData.get('fileToUpload') as File | null

        if (!formData.has('fileToUpload') || !fileToUpload?.name) {
            return fail(400, {
                error: true,
                message: 'You must provide a file to upload',
            })
        }

        const pdfDoc = await PDFDocument.load(await fileToUpload.arrayBuffer())
        const form = pdfDoc.getForm()
        const fields = form.getFields()

        // console.log(fields)

        if (fields.length === 0) {
            console.log("There are no form fields")
            return fail(400, {
                error: true,
                message: 'There are no form fields',
            })
        }

        const parseField = (field: any): ParsedField | undefined => {
            const name = field.getName()
            let value = field.getText() || ''

            if (name.toLowerCase().includes('$')) {
                value = Number(value).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                })
            }

            return { name, value }
        }

        let preMessage = ''

        let urlParameters = ''

        if (parseMode === 'lenderEmail') {
            preMessage = 'Please let me know your interest and terms in the following loan request: \n\n'
        } else if (parseMode === 'newDeal') {
            urlParameters = fields
                .map(parseField)
                .filter((field): field is ParsedField => field !== undefined)
                //match the names to the DealFormSchema in deals.schemas.ts
                .map(({ name, value }) => {
                    if (name === 'Property Address') {
                        return { name: 'address', value }
                    } else if (name === 'Current Value ($)' || name === 'Current Value') {
                        return { name: 'as_is_value_input', value }
                    } else if (name === 'Funding Request Amount ($)' || name === 'Funding Request Amount') {
                        return { name: 'amount_input', value }
                    } else if (name == 'Deal Name') {
                        return { name: 'dealname', value }
                    } else {
                        return undefined
                    }
                })
                .map((value: ParsedField | undefined) => {
                    if (value) {
                        const { name, value: fieldValue } = value
                        return `${encodeURIComponent(name)}=${encodeURIComponent(fieldValue)}`
                    }
                    return ''
                })
                .join('&')
        }

        let list
        let parsedText = preMessage
        let parsedHTML = `<div>${preMessage}</div><br>`

        if (parseMode === 'lenderEmail') {
            list = fields.map(parseField).filter(field => field && field.value !== undefined && field.value !== '' && field.value !== 0 && field.value !== '$0') as ParsedField[]
            parsedText = preMessage + list.map(({ name, value }) => `${name}: ${value}\n`).join('')
            parsedHTML = `<div>${preMessage}</div><br>` +
                list.map(({ name, value }) => `<div><strong>${name}:</strong> ${value}</div>`).join('')
        } else if (parseMode === 'reviewQuestions') {
            list = fields.map(parseField).filter(field => field && field.value === '') as ParsedField[]
            parsedText = parsedText + list.map(({ name }) => `${name}\n`).join('')
            parsedHTML = parsedHTML +
                list.map(({ name }) => `<div><strong>${name}:</strong></div>`).join('')
        }

        return { list, parsedText, parsedHTML, urlParameters }
    },
}

