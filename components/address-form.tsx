"use client";

import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { AddressInput } from "@/components/ui/address-input";
import { unitedStatesList } from "@/lib/vars";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface AddressFormProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	form: UseFormReturn<any>;
	onAddressCheck: (street: string) => Promise<void>;
	isChecking: boolean;
	index: number;
}

export function AddressForm({
	form,
	onAddressCheck,
	isChecking,
	index,
}: AddressFormProps) {
	const [canCheck, setCanCheck] = React.useState(false);

	const handleAddressCheck = async () => {
		const street = form.getValues(`addresses.${index}.street`);
		if (street) {
			await onAddressCheck(street);
		}
	};

	const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
		if (!place.address_components) return;

		let streetNumber = "";
		let streetName = "";
		let city = "";
		let state = "";
		let zipCode = "";

		for (const component of place.address_components) {
			const types = component.types;
			if (types.includes("street_number")) {
				streetNumber = component.long_name;
			} else if (types.includes("route")) {
				streetName = component.long_name;
			} else if (types.includes("locality")) {
				city = component.long_name;
			} else if (types.includes("administrative_area_level_1")) {
				state = component.short_name;
			} else if (types.includes("postal_code")) {
				zipCode = component.long_name;
			}
		}

		const street = `${streetNumber} ${streetName}`.trim();

		form.setValue(`addresses.${index}.street`, street);
		form.setValue(`addresses.${index}.city`, city);
		form.setValue(`addresses.${index}.state`, state);
		form.setValue(`addresses.${index}.zipCode`, zipCode);

		setCanCheck(!!street);
	};

	return (
		<Form {...form}>
			<div className="space-y-4">
				<div className="flex space-x-2">
					<FormField
						control={form.control}
						name={`addresses.${index}.street`}
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Street Address</FormLabel>
								<FormControl>
									<AddressInput
										onPlaceSelect={handlePlaceSelect}
										{...field}
										disabled={isChecking}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="button"
						onClick={handleAddressCheck}
						disabled={isChecking || !canCheck}
						className="mt-8"
					>
						{isChecking ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Search className="mr-2 h-4 w-4" />
						)}
						Check
					</Button>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<FormField
						control={form.control}
						name={`addresses.${index}.city`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>City</FormLabel>
								<FormControl>
									<Input {...field} disabled={isChecking} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name={`addresses.${index}.state`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>State</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isChecking}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select state" />
										</SelectTrigger>
										<SelectContent>
											{unitedStatesList.map((state) => (
												<SelectItem
													key={state.abbreviation}
													value={state.abbreviation}
												>
													{state.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name={`addresses.${index}.zipCode`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>ZIP Code</FormLabel>
								<FormControl>
									<Input {...field} disabled={isChecking} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>
		</Form>
	);
}
