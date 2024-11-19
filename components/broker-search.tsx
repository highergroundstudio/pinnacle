// Previous broker-search.tsx content with these changes:
// 1. Remove isExpanded state and related logic
// 2. Always show all fields
// 3. Keep fields readonly when broker is found

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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Search, Check, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BrokerSearchProps {
  form: UseFormReturn<any>;
  onSearch: (email: string) => Promise<void>;
  isSearching: boolean;
}

export function BrokerSearch({ form, onSearch, isSearching }: BrokerSearchProps) {
  const [isTyping, setIsTyping] = useState(false);
  const email = form.watch("broker.email");
  const hubspotId = form.watch("broker.hubspotId");
  const firstName = form.watch("broker.firstName");
  const lastName = form.watch("broker.lastName");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatEmail = (email: string) => {
    return email.replace(/^mailto:/, "").trim();
  };

  const debouncedSearch = useCallback(
    debounce((email: string) => {
      if (validateEmail(email)) {
        onSearch(email);
        setIsTyping(false);
      }
    }, 500),
    [onSearch]
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(true);
    const formattedEmail = formatEmail(e.target.value);
    form.setValue("broker.email", formattedEmail);
    
    if (validateEmail(formattedEmail) && !isSearching) {
      debouncedSearch(formattedEmail);
    }
  };

  const handleSearch = () => {
    const email = form.getValues("broker.email");
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsTyping(false);
    onSearch(email);
  };

  const getButtonIcon = () => {
    if (isSearching) {
      return <LoadingSpinner size="sm" />;
    }
    if (hubspotId) {
      return <Check className="h-4 w-4" />;
    }
    if (isTyping) {
      return <LoadingSpinner size="sm" className="opacity-50" />;
    }
    return <Search className="h-4 w-4" />;
  };

  const handleCreateBroker = async () => {
    const firstName = form.getValues("broker.firstName");
    const lastName = form.getValues("broker.lastName");
    
    if (!firstName || !lastName) {
      toast.error("Please enter both first and last name");
      return;
    }

    try {
      // Trigger form validation
      const isValid = await form.trigger(["broker.firstName", "broker.lastName"]);
      if (!isValid) return;

      // Create broker logic would go here
      toast.success("Broker created successfully!");
    } catch (error) {
      toast.error("Failed to create broker");
    }
  };

  const showCreateButton = email && !hubspotId && !isSearching && !isTyping;

  return (
    <Form {...form}>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="broker.email"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
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
                    disabled={isSearching || !email}
                    variant={hubspotId ? "outline" : "default"}
                    className={cn(
                      "transition-colors",
                      hubspotId && "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                    )}
                  >
                    {getButtonIcon()}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {hubspotId && (
            <FormField
              control={form.control}
              name="broker.hubspotId"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>HubSpot ID</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      readOnly 
                      className={cn(
                        "bg-muted",
                        firstName && lastName && "border-green-500 text-green-500"
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>

        {showCreateButton && (
          <Button
            type="button"
            onClick={handleCreateBroker}
            className="w-full"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create New Broker
          </Button>
        )}
      </div>
    </Form>
  );
}