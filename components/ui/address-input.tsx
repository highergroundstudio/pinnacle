"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface AddressInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
}

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ className, onPlaceSelect, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (!window.google || !inputRef.current) return;

      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["address"], componentRestrictions: { country: "us" } }
      );

      autoCompleteRef.current.addListener("place_changed", () => {
        if (!autoCompleteRef.current) return;
        
        const place = autoCompleteRef.current.getPlace();
        onPlaceSelect?.(place);
        setIsLoading(false);
      });

      return () => {
        if (autoCompleteRef.current) {
          google.maps.event.clearInstanceListeners(autoCompleteRef.current);
        }
      };
    }, [onPlaceSelect]);

    return (
      <div className="relative">
        <Input
          ref={(node) => {
            // Handle both refs
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            inputRef.current = node;
          }}
          className={cn("pr-8", className)}
          onFocus={() => setIsLoading(true)}
          onBlur={() => setIsLoading(false)}
          {...props}
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>
    );
  }
);