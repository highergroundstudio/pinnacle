"use client";

import { forwardRef } from "react";
import { Input } from "./input";
import Autocomplete from "react-google-autocomplete";

interface AddressInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
}

const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ onPlaceSelect, className, ...props }, ref) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return <Input ref={ref} {...props} />;
    }

    return (
      <Autocomplete
        apiKey={apiKey}
        onPlaceSelected={onPlaceSelect}
        language="en"
        options={{
          types: ["address"],
          componentRestrictions: { country: "us" },
        }}
        style={{ width: "100%" }}
        {...props}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    );
  }
);

AddressInput.displayName = "AddressInput";

export { AddressInput };