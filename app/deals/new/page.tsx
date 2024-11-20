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
import { searchBrokerByEmail, checkDuplicateAddress, createBroker, createDeal } from "@/lib/hubspot";
import { extractPDFContent } from "@/lib/pdf-parser";
import { dealFormSchema } from "@/lib/schema";
import { mapFormToHubspotProperties } from "@/lib/utils";
import { RefreshCw, Upload } from "lucide-react";

export default function NewDealPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBrokerSearching, setBrokerSearching] = useState(false);
  const [isAddressChecking, setAddressChecking] = useState(false);
  const [isPDFProcessing, setPDFProcessing] = useState(false);

  const form = useForm({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      broker: {
        email: "",
        firstName: "",
        lastName: "",
      },
      deal: {
        name: "",
        stage: "",
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
        }
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
        toast.success(`Found broker: ${broker.fullname}`);
      } else {
        toast.info("Broker not found. Please fill in the details to create a new broker.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setBrokerSearching(false);
    }
  };

  const handleAddressCheck = async (address: string) => {
    try {
      setAddressChecking(true);
      const isDuplicate = await checkDuplicateAddress(address);
      if (isDuplicate) {
        toast.error("This address already exists in HubSpot");
      } else {
        toast.success("Address is unique");
      }
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
      
      fields.forEach(({ name, value }) => {
        switch (name.toLowerCase()) {
          case "deal name":
            form.setValue("deal.name", value);
            break;
          case "amount":
          case "funding request amount":
            form.setValue("deal.amount", parseFloat(value.replace(/[^0-9.-]+/g, "")));
            break;
          case "as is value":
          case "current value":
            form.setValue("deal.asIsValue", parseFloat(value.replace(/[^0-9.-]+/g, "")));
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
      });

      toast.success('PDF processed successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPDFProcessing(false);
    }
  };

  const handleReset = () => {
    form.reset();
    toast.success("Form has been reset");
  };

  const handleAmountChange = (amount: number) => {
    form.setValue("deal.amount", amount);
    toast.success(`Amount updated to ${new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)}`);
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      // Create or update broker if email is provided
      let brokerId = data.broker.hubspotId;
      if (data.broker.email && !brokerId) {
        const broker = await createBroker({
          email: data.broker.email,
          firstName: data.broker.firstName,
          lastName: data.broker.lastName,
        });
        brokerId = broker.brokerid;
      }

      // Create deal with mapped properties
      const dealProperties = mapFormToHubspotProperties(data);
      const deal = await createDeal({
        ...dealProperties,
        brokerId: brokerId || "",
      });

      toast.success("Deal created successfully");
      form.reset();
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

            <AddressList 
              form={form} 
              onAddressCheck={handleAddressCheck}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isBrokerSearching || isAddressChecking || isPDFProcessing}
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
          </div>
        </div>
      </form>
    </div>
  );
}