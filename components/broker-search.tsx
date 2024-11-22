"use client";

import type { UseFormReturn } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BrokerSearchProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	form: UseFormReturn<any>;
	onSearch: (email: string) => Promise<void>;
	isSearching: boolean;
}

const validateEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export function BrokerSearch({
	form,
	onSearch,
	isSearching,
}: BrokerSearchProps) {
	const [isTyping, setIsTyping] = useState(false);
	const email = form.watch("broker.email");
	const hubspotId = form.watch("broker.hubspotId");
	const firstName = form.watch("broker.firstName");
	const lastName = form.watch("broker.lastName");

	const formatEmail = (email: string) => {
		return email.replace(/^mailto:/, "").trim();
	};

	const handleSearch = useCallback(
		async (emailToSearch: string) => {
			if (validateEmail(emailToSearch)) {
				setIsTyping(false);
				await onSearch(emailToSearch);
			}
		},
		[onSearch],
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSearch = useCallback(
		debounce((emailToSearch: string) => {
			handleSearch(emailToSearch);
		}, 1000),
		[],
	);

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsTyping(true);
		const formattedEmail = formatEmail(e.target.value);
		form.setValue("broker.email", formattedEmail);

		if (validateEmail(formattedEmail) && !isSearching) {
			debouncedSearch(formattedEmail);
		}
	};

	const handleManualSearch = () => {
		if (!validateEmail(email)) {
			toast.error("Please enter a valid email address");
			return;
		}
		debouncedSearch.cancel(); // Cancel any pending debounced searches
		setIsTyping(false);
		handleSearch(email);
	};

	const handleCreateBroker = async () => {
		if (!firstName || !lastName) {
			toast.error("Please enter both first and last name");
			return;
		}

		try {
			await form.trigger(["broker.firstName", "broker.lastName"]);
			toast.success("Broker created successfully!");
		} catch (error) {
			toast.error("Failed to create broker");
		}
	};

	const showCreateButton =
		email && !hubspotId && !isSearching && !isTyping && firstName && lastName;

	return (
		<Form {...form}>
			<div className="space-y-4">
				<FormField
					control={form.control}
					name="broker.email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<div className="flex space-x-2">
								<FormControl>
									<Input
										placeholder="broker@example.com"
										{...field}
										onChange={handleEmailChange}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleManualSearch();
											}
										}}
									/>
								</FormControl>
								<Button
									type="button"
									onClick={handleManualSearch}
									disabled={isSearching || !email}
									className="w-24"
								>
									{isSearching ? (
										<LoadingSpinner size="sm" />
									) : (
										<>
											<Search className="mr-2 h-4 w-4" />
											Search
										</>
									)}
								</Button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid gap-4 md:grid-cols-3">
					<FormField
						control={form.control}
						name="broker.firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input
										{...field}
										disabled={isSearching}
										readOnly={!!hubspotId}
										className={cn(hubspotId && "bg-muted")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="broker.lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input
										{...field}
										disabled={isSearching}
										readOnly={!!hubspotId}
										className={cn(hubspotId && "bg-muted")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="broker.hubspotId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>HubSpot ID</FormLabel>
								<FormControl>
									<Input
										{...field}
										readOnly
										className={cn(
											"bg-muted",
											field.value && "border-green-500 text-green-500",
										)}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				{showCreateButton && (
					<Button type="button" onClick={handleCreateBroker} className="w-full">
						<UserPlus className="mr-2 h-4 w-4" />
						Create New Broker
					</Button>
				)}
			</div>
		</Form>
	);
}

BrokerSearch.displayName = "BrokerSearch";
