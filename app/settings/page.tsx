"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { pb } from "@/lib/pocketbase";

const formSchema = z.object({
  googleApiKey: z.string().min(1, "Google API key is required"),
  hubspotToken: z.string().min(1, "HubSpot token is required"),
  filesystemPath: z.string().min(1, "Filesystem path is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      googleApiKey: "",
      hubspotToken: "",
      filesystemPath: "/data/deals",
    },
  });

  // Load settings from PocketBase on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const record = await pb.collection('settings').getFirstListItem('type="app_settings"');
        form.reset({
          googleApiKey: record.googleApiKey || "",
          hubspotToken: record.hubspotToken || "",
          filesystemPath: record.filesystemPath || "/data/deals",
        });
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
    loadSettings();
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);

      // Store settings in PocketBase
      try {
        const record = await pb.collection('settings').getFirstListItem('type="app_settings"');
        await pb.collection('settings').update(record.id, {
          googleApiKey: data.googleApiKey,
          hubspotToken: data.hubspotToken,
          filesystemPath: data.filesystemPath,
        });
      } catch (error) {
        // If no record exists, create one
        await pb.collection('settings').create({
          type: 'app_settings',
          googleApiKey: data.googleApiKey,
          hubspotToken: data.hubspotToken,
          filesystemPath: data.filesystemPath,
        });
      }

      // Store in localStorage for client-side access
      localStorage.setItem("googleApiKey", data.googleApiKey);
      localStorage.setItem("hubspotToken", data.hubspotToken);
      localStorage.setItem("filesystemPath", data.filesystemPath);

      toast.success("Settings updated successfully");

      // Reload the page to apply new settings
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="googleApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps API Key</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hubspotToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HubSpot API Token</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filesystemPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filesystem Path</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}