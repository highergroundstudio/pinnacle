"use client";

import type { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/multi-select";
import { checkDuplicateDealName } from "@/lib/hubspot";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	dealStageOptions,
	transactionTypeOptions,
	propertyTypeOptions,
} from "@/lib/vars";
import { Button } from "@/components/ui/button";

interface DealFormProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	form: UseFormReturn<any>;
}

export function DealForm({ form }: DealFormProps) {
	const [isCheckingName, setIsCheckingName] = useState(false);
	const [isNameUnique, setIsNameUnique] = useState(false);
	const [isCheckingSponsor, setIsCheckingSponsor] = useState(false);
	const [sponsorId, setSponsorId] = useState<string>("");

	const street = form.watch("addresses.0.street");
	const dealName = form.watch("deal.name");
	const sponsorName = form.watch("deal.sponsorName");

	useEffect(() => {
		if (street && !dealName) {
			form.setValue("deal.name", street);
		}
	}, [street, dealName, form]);

	const handleSponsorSearch = async () => {
		if (!sponsorName) {
			toast.error("Please enter a sponsor name");
			return;
		}

		try {
			setIsCheckingSponsor(true);
			// TODO: Implement HubSpot sponsor search
			toast.success("Sponsor found!");
			setSponsorId("12345");
		} catch (error) {
			toast.error("Failed to find sponsor");
		} finally {
			setIsCheckingSponsor(false);
		}
	};

	const handleDealSearch = async () => {
		if (!dealName) {
			toast.error("Please enter a deal name");
			return;
		}

		try {
			setIsCheckingName(true);
			const isDuplicate = await checkDuplicateDealName(dealName);
			setIsNameUnique(!isDuplicate);
			if (isDuplicate) {
				toast.error("A similar deal name already exists");
			} else {
				toast.success("Deal name is unique");
			}
		} catch (error) {
			toast.error("Failed to check deal name");
		} finally {
			setIsCheckingName(false);
		}
	};

	return (
		<Form {...form}>
			<div className="space-y-4">
				<div className="flex space-x-2">
					<FormField
						control={form.control}
						name="deal.name"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel className="flex items-center space-x-2">
									<span>Deal Name</span>
									{isCheckingName ? (
										<LoadingSpinner size="sm" className="opacity-50" />
									) : dealName && isNameUnique ? (
										<Check className="h-4 w-4 text-green-500" />
									) : null}
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="Will use address if empty"
										className={cn(
											dealName && isNameUnique && "border-green-500",
										)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="button"
						onClick={handleDealSearch}
						className="mt-8"
						variant={isNameUnique ? "outline" : "default"}
						disabled={!dealName || isCheckingName}
					>
						<Search className="h-4 w-4" />
					</Button>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="deal.transactionType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Transaction Type</FormLabel>
								<FormControl>
									<MultiSelect
										selected={field.value}
										options={transactionTypeOptions}
										onChange={field.onChange}
										placeholder="Select transaction types"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="deal.stage"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Deal Stage</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a stage" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{dealStageOptions.map((stage) => (
											<SelectItem
												key={stage.value.hubspot}
												value={stage.value.hubspot}
											>
												{stage.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="deal.propertyType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Property Type</FormLabel>
								<FormControl>
									<MultiSelect
										selected={field.value}
										options={propertyTypeOptions}
										onChange={field.onChange}
										placeholder="Select property types"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="deal.propertyTypeFuture"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Property Type (Future)</FormLabel>
								<FormControl>
									<MultiSelect
										selected={field.value}
										options={propertyTypeOptions}
										onChange={field.onChange}
										placeholder="Select future property types"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<FormField
						control={form.control}
						name="deal.amount"
						render={({ field: { onChange, ...field } }) => (
							<FormItem>
								<FormLabel>Amount</FormLabel>
								<FormControl>
									<CurrencyInput
										onValueChange={(values) => {
											onChange(values.floatValue);
										}}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="deal.asIsValue"
						render={({ field: { onChange, ...field } }) => (
							<FormItem>
								<FormLabel>As Is Value</FormLabel>
								<FormControl>
									<CurrencyInput
										onValueChange={(values) => {
											onChange(values.floatValue);
										}}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex space-x-2">
						<FormField
							control={form.control}
							name="deal.sponsorName"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel>Sponsor Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter sponsor name"
											className={cn(sponsorId && "border-green-500")}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="button"
							onClick={handleSponsorSearch}
							className="mt-8"
							variant={sponsorId ? "outline" : "default"}
							disabled={!sponsorName || isCheckingSponsor}
						>
							{isCheckingSponsor ? (
								<LoadingSpinner size="sm" />
							) : (
								<Search className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</Form>
	);
}
