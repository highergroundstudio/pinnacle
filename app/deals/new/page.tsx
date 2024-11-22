"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BrokerSearch } from "@/components/broker-search";
import { DealForm } from "@/components/deal-form";
import { AddressList } from "@/components/address-list";
import { LoanCalculator } from "@/components/loan-calculator";
import { PDFUpload } from "@/components/pdf-upload";
import { MatchingDeals } from "@/components/matching-deals";
import {
	searchBrokerByEmail,
	checkDuplicateAddress,
	createDeal,
	type HubSpotDealResponse,
} from "@/lib/hubspot";
import { extractPDFContent } from "@/lib/pdf-parser";
import { dealFormSchema } from "@/lib/schema";
import { RefreshCw, Upload, ExternalLink, Beaker } from "lucide-react";

export default function NewDealPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isBrokerSearching, setBrokerSearching] = useState(false);
	const [isAddressChecking, setAddressChecking] = useState(false);
	const [isPDFProcessing, setPDFProcessing] = useState(false);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [matchingDeals, setMatchingDeals] = useState<any[]>([]);
	const [createdDeal, setCreatedDeal] = useState<HubSpotDealResponse | null>(
		null,
	);

	const form = useForm({
		resolver: zodResolver(dealFormSchema),
		defaultValues: {
			broker: {
				email: "",
				firstName: "",
				lastName: "",
				hubspotId: "",
			},
			deal: {
				name: "",
				stage: "appointmentscheduled", // Default to "New Submission"
				transactionType: [],
				propertyType: [],
				propertyTypeFuture: [],
				amount: 0,
				asIsValue: 0,
			},
			addresses: [
				{
					street: "",
					city: "",
					state: "",
					zipCode: "",
				},
			],
		},
	});

	const handleBrokerSearch = async (email: string) => {
		try {
			setBrokerSearching(true);
			const broker = await searchBrokerByEmail(email);
			if (broker) {
				form.setValue("broker.firstName", broker.firstname);
				form.setValue("broker.lastName", broker.lastname);
				form.setValue("broker.hubspotId", broker.brokerid);
				toast.success(`Found broker: ${broker.firstname} ${broker.lastname}`);
			} else {
				form.setValue("broker.firstName", "");
				form.setValue("broker.lastName", "");
				form.setValue("broker.hubspotId", "");
				toast.info(
					"Broker not found. Please fill in the details to create a new broker.",
				);
			}
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setBrokerSearching(false);
		}
	};

	const handleAddressCheck = async (street: string) => {
		try {
			setAddressChecking(true);
			const response = await checkDuplicateAddress(street);
			if (response.exists) {
				setMatchingDeals(response.deals);
				toast.error("This address already exists in HubSpot");
			} else {
				setMatchingDeals([]);
				toast.success("Address is unique");
			}
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setAddressChecking(false);
		}
	};

	const handlePDFUpload = async (file: File) => {
		try {
			setPDFProcessing(true);
			const fields = await extractPDFContent(file);

			for (const { name, value } of fields) {
				switch (name.toLowerCase()) {
					case "deal name":
						form.setValue("deal.name", value);
						break;
					case "amount":
					case "funding request amount":
						form.setValue(
							"deal.amount",
							Number.parseFloat(value.replace(/[^0-9.-]+/g, "")),
						);
						break;
					case "as is value":
					case "current value":
						form.setValue(
							"deal.asIsValue",
							Number.parseFloat(value.replace(/[^0-9.-]+/g, "")),
						);
						break;
					case "address":
						form.setValue("addresses.0.street", value);
						break;
					case "city":
						form.setValue("addresses.0.city", value);
						break;
					case "state":
						form.setValue("addresses.0.state", value);
						break;
					case "zip":
					case "zip code":
						form.setValue("addresses.0.zipCode", value);
						break;
				}
			}

			toast.success("PDF processed successfully");
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setPDFProcessing(false);
		}
	};

	const handleAmountChange = (amount: number) => {
		form.setValue("deal.amount", amount);
		toast.success(
			`Amount updated to ${new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}).format(amount)}`,
		);
	};

	const handleReset = () => {
		form.reset();
		setMatchingDeals([]);
		setCreatedDeal(null);
		toast.success("Form has been reset");
	};

	const loadTestData = () => {
		form.reset({
			broker: {
				email: "hikebikeclimb@gmail.com",
				firstName: "",
				lastName: "",
				hubspotId: "",
			},
			deal: {
				name: "Test Deal",
				stage: "62553446",
				transactionType: ["Purchase", "Refinance"],
				propertyType: ["Multifamily"],
				propertyTypeFuture: ["Mixed-use"],
				amount: 1000000,
				asIsValue: 1500000,
			},
			addresses: [
				{
					street: "123 Test Street",
					city: "Phoenix",
					state: "AZ",
					zipCode: "85001",
				},
			],
		});
		toast.success("Test data loaded");
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onSubmit = async (data: any) => {
		try {
			setIsSubmitting(true);
			const deal = await createDeal(data);
			setCreatedDeal(deal);
			toast.success(
				<div className="flex items-center justify-between">
					<span>Deal created successfully!</span>
					<Button
						variant="outline"
						size="sm"
						className="ml-2"
						onClick={() => window.open(deal.dealUrl, "_blank")}
					>
						<ExternalLink className="mr-2 h-4 w-4" />
						View in HubSpot
					</Button>
				</div>,
			);
			form.reset();
			setMatchingDeals([]);
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">New Deal</h1>
				{createdDeal && (
					<Button
						variant="outline"
						onClick={() => window.open(createdDeal.dealUrl, "_blank")}
					>
						<ExternalLink className="mr-2 h-4 w-4" />
						View Deal in HubSpot
					</Button>
				)}
			</div>

			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid gap-6 lg:grid-cols-2">
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Broker Information</CardTitle>
							</CardHeader>
							<CardContent>
								<BrokerSearch
									form={form}
									onSearch={handleBrokerSearch}
									isSearching={isBrokerSearching}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Deal Details</CardTitle>
							</CardHeader>
							<CardContent>
								<DealForm form={form} />
							</CardContent>
						</Card>

						<AddressList form={form} onAddressCheck={handleAddressCheck} />
					</div>

					<div className="space-y-6">
						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-4">
									<Button
										type="submit"
										disabled={
											isSubmitting ||
											isBrokerSearching ||
											isAddressChecking ||
											isPDFProcessing
										}
										className="flex-1"
									>
										{isSubmitting ? "Creating Deal..." : "Create Deal"}
									</Button>

									<Button
										type="button"
										variant="outline"
										onClick={handleReset}
										className="flex items-center"
									>
										<RefreshCw className="mr-2 h-4 w-4" />
										Reset
									</Button>

									{process.env.NODE_ENV === "development" && (
										<Button
											type="button"
											variant="outline"
											onClick={loadTestData}
											className="flex items-center"
										>
											<Beaker className="mr-2 h-4 w-4" />
											Test
										</Button>
									)}

									<div className="relative flex-1">
										<PDFUpload
											onUpload={handlePDFUpload}
											isProcessing={isPDFProcessing}
											compact
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						<LoanCalculator
							asIsValue={form.watch("deal.asIsValue") || 0}
							onAmountChange={handleAmountChange}
						/>

						{matchingDeals.length > 0 && (
							<MatchingDeals deals={matchingDeals} />
						)}
					</div>
				</div>
			</form>
		</div>
	);
}
