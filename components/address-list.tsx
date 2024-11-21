"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddressForm } from "@/components/address-form";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface AddressListProps {
	form: UseFormReturn<any>;
	onAddressCheck: (street: string) => Promise<void>;
}

export function AddressList({ form, onAddressCheck }: AddressListProps) {
	const [addresses, setAddresses] = useState([0]); // Array of address indices
	const [isChecking, setIsChecking] = useState<Record<number, boolean>>({});

	const addAddress = () => {
		setAddresses((prev) => [...prev, Math.max(...prev) + 1]);
	};

	const removeAddress = (index: number) => {
		setAddresses((prev) => prev.filter((i) => i !== index));
		// Clear form data for removed address
		form.setValue(`addresses.${index}`, undefined);
	};

	const handleAddressCheck = async (index: number, street: string) => {
		setIsChecking((prev) => ({ ...prev, [index]: true }));
		try {
			await onAddressCheck(street);
		} finally {
			setIsChecking((prev) => ({ ...prev, [index]: false }));
		}
	};

	return (
		<div className="space-y-4">
			{addresses.map((index) => (
				<Card key={index} className="relative">
					<CardContent className="pt-6">
						<AddressForm
							form={form}
							index={index}
							onAddressCheck={(street) => handleAddressCheck(index, street)}
							isChecking={isChecking[index] || false}
						/>
						{addresses.length > 1 && (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="absolute top-2 right-2"
								onClick={() => removeAddress(index)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						)}
					</CardContent>
				</Card>
			))}

			<Button
				type="button"
				variant="outline"
				className="w-full"
				onClick={addAddress}
			>
				<Plus className="mr-2 h-4 w-4" />
				Add Another Address
			</Button>
		</div>
	);
}
