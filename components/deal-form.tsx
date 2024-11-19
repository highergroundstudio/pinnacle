"use client";

import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
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
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DealFormProps {
  form: UseFormReturn<any>;
}

const dealStages = [
  { value: "pre-submission", label: "Pre-Submission" },
  { value: "new-submission", label: "New Submission" },
  { value: "new-submission-form", label: "New Submission w/ Form" },
  { value: "second-review", label: "Second Review" },
  { value: "committee-pricing", label: "In Committee for Pricing" },
  { value: "engage-process", label: "Engage - In Process" },
];

const transactionTypes = [
  "Purchase",
  "Refinance",
  "Cashout",
  "Rehab/Construction",
  "Construction",
  "Bridge",
  "Equity",
  "Equipment",
  "Business",
  "Other",
];

const propertyTypes = [
  "Multifamily",
  "Industrial",
  "Land",
  "Retail",
  "Office",
  "Mixed-use",
  "Self Storage",
  "Mobile Home Park",
  "Hospitality",
  "1-4 Unit Residential Rental",
  "Assisted Living",
  "Agricultural",
  "Medical",
  "RV Park",
  "Other",
];

export function DealForm({ form }: DealFormProps) {
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isNameUnique, setIsNameUnique] = useState(false);

  // Watch for street address changes to auto-update deal name
  const street = form.watch("address.street");
  const dealName = form.watch("deal.name");

  useEffect(() => {
    if (street && !dealName) {
      form.setValue("deal.name", street);
    }
  }, [street, dealName, form]);

  // Check for duplicate deal names
  useEffect(() => {
    const checkDealName = async () => {
      if (!dealName) return;
      
      try {
        setIsCheckingName(true);
        const isDuplicate = await checkDuplicateDealName(dealName);
        setIsNameUnique(!isDuplicate);
        if (isDuplicate) {
          toast.error("A similar deal name already exists");
        }
      } catch (error) {
        console.error("Failed to check deal name:", error);
      } finally {
        setIsCheckingName(false);
      }
    };

    const timeoutId = setTimeout(checkDealName, 500);
    return () => clearTimeout(timeoutId);
  }, [dealName]);

  return (
    <Form {...form}>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="deal.name"
            render={({ field }) => (
              <FormItem>
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
                      dealName && isNameUnique && "border-green-500"
                    )}
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dealStages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
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

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="deal.transactionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={field.value}
                    options={transactionTypes}
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
            name="deal.propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={field.value}
                    options={propertyTypes}
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
                    options={propertyTypes}
                    onChange={field.onChange}
                    placeholder="Select future property types"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
        </div>
      </div>
    </Form>
  );
}