import type { Actions, PageServerLoad } from "./$types"
import { error, fail } from "@sveltejs/kit"
import { superValidate, message } from "sveltekit-superforms/server"
import { DealFormSchema } from "$lib/types/deals.schemas"
import { createDeal } from "./functions"
import type { Response } from "$lib/types/deals"
import { zod } from 'sveltekit-superforms/adapters';


export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(DealFormSchema)) }
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(DealFormSchema))

		if (!form.valid) return fail(400, { form })

		const dealResponse = (await createDeal(form.data)) as Response

		if (dealResponse.success) {
			return message(form, dealResponse)
		} else {
			console.error("Deal not created", dealResponse)
			return error(400, new Error(JSON.stringify({ form, dealResponse })))
		}
	},
} satisfies Actions
