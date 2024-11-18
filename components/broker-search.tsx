"use client";

import { UseFormReturn } from "react-hook-form";
import { useState, useCallback } from "react";
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
import { Loader2, Search, Check, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BrokerSearchProps {
  form: UseFormReturn<any>;
  onSearch: (email: string) => Promise<void>;
  isSearching: boolean;
}

export function BrokerSearch({ form, onSearch, isSearching }: BrokerSearchProps) {
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const hubspotId = form.watch("broker.hubspotId");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatEmail = (email: string) => {
    return email.replace(/^mailto:/, "").trim();
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((email: string) => {
      if (validateEmail(email)) {
        onSearch(email);
      }
    }, 500),
    [onSearch]
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedEmail = formatEmail(e.target.value);
    form.setValue("broker.email", formattedEmail);
    const isValid = validateEmail(formattedEmail);
    setIsValidEmail(isValid);
    
    if (isValid && !isSearching) {
      debouncedSearch(formattedEmail);
    }
  };

  const handleSearch = () => {
    const email = form.getValues("broker.email");
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    onSearch(email);
  };

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
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                </FormControl>
                <Button 
                  type="button" 
                  onClick={handleSearch}
                  disabled={isSearching || !isValidEmail}
                  variant={hubspotId ? "outline" : "default"}
                  className={cn(
                    "transition-colors",
                    hubspotId && "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                  )}
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : hubspotId ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-between px-2 py-1 h-auto font-normal"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="text-sm text-muted-foreground">
              {isExpanded ? "Hide" : "Show"} Broker Details
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          <div className={cn(
            "grid gap-4 md:grid-cols-2 transition-all",
            isExpanded ? "block" : "hidden"
          )}>
            <FormField
              control={form.control}
              name="broker.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSearching} />
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
                    <Input {...field} disabled={isSearching} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </Form>
  );
}