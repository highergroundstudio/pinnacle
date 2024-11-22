"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { useLoadScript } from "@react-google-maps/api";

interface AddressInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
}

const libraries: "places"[] = ["places"];

const AddressInput = React.forwardRef<HTMLInputElement, AddressInputProps>(
	({ onPlaceSelect, ...props }, ref) => {
		const { isLoaded } = useLoadScript({
			googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
			libraries,
		});

		React.useEffect(() => {
			if (!isLoaded || !ref || typeof ref === "function") return;

			const input = ref.current;
			if (!input) return;

			const autocomplete = new google.maps.places.Autocomplete(input, {
				types: ["address"],
				componentRestrictions: { country: "us" },
			});

			autocomplete.addListener("place_changed", () => {
				const place = autocomplete.getPlace();
				if (onPlaceSelect) {
					onPlaceSelect(place);
				}
			});

			return () => {
				google.maps.event.clearInstanceListeners(autocomplete);
			};
		}, [isLoaded, ref, onPlaceSelect]);

		return <Input ref={ref} type="text" {...props} />;
	},
);

AddressInput.displayName = "AddressInput";

export { AddressInput };
