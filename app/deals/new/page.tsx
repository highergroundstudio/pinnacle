"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BrokerSearch } from "@/components/broker-search";
import { DealForm } from "@/components/deal-form";
import { AddressForm } from "@/components/address-form";
import { PDFUpload } from "@/components/pdf-upload";
import { searchBrokerByEmail, checkDuplicateAddress, createBroker, createDeal } from "@/lib/hubspot";
import { extractPDFContent } from "@/lib/pdf-parser";
import { Upload } from "lucide-react";

const formSchema = z.object({
  broker: z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    hubspotId: z.string().optional(),
  }),
  deal: z.object({
    name: z.string().min(1, "Deal name is required"),
    stage: z.string().min(1, "Deal stage is required"),
    transactionType: z.array(z.string()).min(1, "At least one transaction type is required"),
    propertyType: z.array(z.string()).min(1, "At least one property type is required"),
    propertyTypeFuture: z.array(z.string()).min(1, "At least one future property type is required"),
    amount: z.number().min(0, "Amount must be positive"),
    asIsValue: z.number().min(0, "As Is Value must be positive"),
  }),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewDealPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBrokerSearching, setBrokerSearching] = useState(false);
  const [isAddressChecking, setAddressChecking] = useState(false);
  const [isPDFProcessing, setPDFProcessing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
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
      
      // Map PDF fields to form fields
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
            form.setValue("address.street", value);
            break;
          case "city":
            form.setValue("address.city", value);
            break;
          case "state":
            form.setValue("address.state", value);
            break;
          case "zip":
          case "zip code":
            form.setValue("address.zipCode", value);
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

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      // Create or update broker
      let brokerId = data.broker.hubspotId;
      if (!brokerId) {
        const broker = await createBroker({
          email: data.broker.email,
          firstName: data.broker.firstName,
          lastName: data.broker.lastName,
        });
        brokerId = broker.brokerid;
      }

      // Create deal
      const deal = await createDeal({
        ...data.deal,
        ...data.address,
        brokerId,
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

            <Card>
              <CardHeader>
                <CardTitle>Property Address</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressForm 
                  form={form} 
                  onAddressCheck={handleAddressCheck}
                  isChecking={isAddressChecking}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isBrokerSearching || isAddressChecking || isPDFProcessing}
                    className="flex-1"
                  >
                    {isSubmitting ? "Creating Deal..." : "Create Deal"}
                  </Button>

                  <div className="relative flex-1">
                    <PDFUpload 
                      onUpload={handlePDFUpload}
                      isProcessing={isPDFProcessing}
                      compact
                    />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>You can either fill out the form manually or upload a PDF to auto-fill the fields.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Deal summary will appear here as you fill out the form.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}