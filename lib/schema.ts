"use client";

import { z } from "zod";
import { dealStageOptions } from "./vars";

export const dealFormSchema = z.object({
  broker: z.object({
    email: z.string().optional(),
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    hubspotId: z.string().optional(),
  }),
  deal: z.object({
    name: z.string().optional(),
    stage: z.string().refine(
      (value) => dealStageOptions.some((option) => option.value.hubspot === value),
      "Invalid deal stage"
    ),
    transactionType: z.array(z.string()).min(1, "At least one transaction type is required"),
    propertyType: z.array(z.string()).min(1, "At least one property type is required"),
    propertyTypeFuture: z.array(z.string()).min(1, "At least one future property type is required"),
    amount: z.number().min(0, "Amount must be positive"),
    asIsValue: z.number().min(0, "As Is Value must be positive"),
  }),
  addresses: z.array(z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  })).min(1, "At least one address is required"),
});