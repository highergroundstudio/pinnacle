"use client";

import * as React from "react";
import { UseFormReturn } from "react-hook-form";
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
import { Loader2, Search, Check } from "lucide-react";
import { AddressInput } from "@/components/ui/address-input";
import { cn } from "@/lib/utils";

interface AddressFormProps {
  form: UseFormReturn<any>;
  onAddressCheck: (address: string) => Promise<void>;
  isChecking: boolean;
}

export function AddressForm({ form, onAddressCheck, isChecking }: AddressFormProps) {
  const [isUnique, setIsUnique] = React.useState(false);
  const [canCheck, setCanCheck] = React.useState(false);

  const handleAddressCheck = async () => {
    const street = form.getValues("address.street");
    const city = form.getValues("address.city");
    const state = form.getValues("address.state");
    const zipCode = form.getValues("address.zipCode");

    if (street && city && state && zipCode) {
      const fullAddress = `${street}, ${city}, ${state} ${zipCode}`;
      try {
        await onAddressCheck(fullAddress);
        setIsUnique(true);
      } catch {
        setIsUnique(false);
      }
    }
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (!place.address_components) return;
    setIsUnique(false);

    let streetNumber = "";
    let streetName = "";
    let city = "";
    let state = "";
    let zipCode = "";

    place.address_components.forEach((component) => {
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
    });

    const street = `${streetNumber} ${streetName}`.trim();

    form.setValue("address.street", street);
    form.setValue("address.city", city);
    form.setValue("address.state", state);
    form.setValue("address.zipCode", zipCode);

    setCanCheck(!!(street && city && state && zipCode));
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="address.street"
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
            className={cn(
              "mt-8",
              isUnique && "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
            )}
            variant={isUnique ? "outline" : "default"}
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : isUnique ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Verified
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Check
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="address.city"
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
            name="address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isChecking} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.zipCode"
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