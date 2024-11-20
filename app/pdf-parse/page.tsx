"use client";

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload, Copy, RefreshCw, Mail } from "lucide-react";
import { extractPDFContent, type ParsedField } from '@/lib/pdf-parser';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

type ViewMode = 'lender' | 'review';

export default function PDFParsePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ParsedField[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('lender');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      try {
        setIsProcessing(true);
        const file = acceptedFiles[0];
        const fields = await extractPDFContent(file);
        setExtractedFields(fields);
        toast.success('PDF processed successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to process PDF');
      } finally {
        setIsProcessing(false);
      }
    }
  });

  const formatEmailContent = (asHtml: boolean = false) => {
    const fieldOrder = [
      "Deal Name",
      "Loan Purpose",
      "Property Type",
      "Property Address",
      "Current Value ($)",
      "Property Size (Acres)",
      "Number of Units",
      "Property Description",
      "Terms Requested (in Months)",
      "List of Uses",
      "Exit Strategy",
      "Deadline Dates",
      "Borrowing Entity Name",
      "Owner Names",
      "Owners' Combined Liquidity",
      "Owners' Combined Net Worth",
      "Owner Experience",
      "Borrower Situation & File Notes",
    ];

    const sortedFields = [...extractedFields].sort((a, b) => {
      const indexA = fieldOrder.indexOf(a.name);
      const indexB = fieldOrder.indexOf(b.name);
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    const fields = viewMode === 'review' 
      ? sortedFields.filter(field => !field.value)
      : sortedFields;

    if (viewMode === 'review' && fields.length === 0) {
      return asHtml 
        ? '<div>All fields are filled out.</div>'
        : 'All fields are filled out.';
    }

    const title = viewMode === 'review'
      ? 'Please provide the following information:'
      : 'Please let me know your interest and terms in the following loan request:';

    if (asHtml) {
      return `
        <div id="parsedHTML" class="input p-4 bg-gray-100 rounded-md">
          <div>${title}</div>
          <br>
          ${fields.map(({ name, value }) => `
            <div><strong>${name}:</strong> ${value || '[Missing]'}</div>
          `).join('')}
        </div>
      `.trim();
    }

    return [
      title,
      '',
      ...fields.map(({ name, value }) => 
        `${name}: ${value || '[Missing]'}`
      ),
      ''
    ].join('\n');
  };

  const copyToClipboard = (asHtml: boolean = false) => {
    const content = formatEmailContent(asHtml);
    if (asHtml) {
      const blob = new Blob([content], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      navigator.clipboard.write([clipboardItem]);
      toast.success('Copied HTML to clipboard');
    } else {
      navigator.clipboard.writeText(content);
      toast.success('Copied plain text to clipboard');
    }
  };

  const openEmail = () => {
    const content = formatEmailContent(false);
    const mailtoLink = `mailto:?subject=Loan Request Details&body=${encodeURIComponent(content)}`;
    window.location.href = mailtoLink;
  };

  const clearFields = () => {
    setExtractedFields([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">PDF Parse</h1>
        <div className="flex items-center space-x-4">
          <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lender">Lender Email</SelectItem>
              <SelectItem value="review">Initial Review</SelectItem>
            </SelectContent>
          </Select>
          {extractedFields.length > 0 && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={clearFields}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button 
                variant="outline"
                onClick={() => copyToClipboard(false)}
                className="flex items-center"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Text
              </Button>
              <Button 
                variant="outline"
                onClick={() => copyToClipboard(true)}
                className="flex items-center"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy HTML
              </Button>
              <Button 
                onClick={openEmail}
                className="flex items-center"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              isProcessing ? "pointer-events-none" : "hover:border-primary hover:bg-primary/5"
            )}
          >
            <input {...getInputProps()} />
            {isProcessing && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">Processing PDF...</p>
                </div>
              </div>
            )}
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                {isDragActive
                  ? "Drop the PDF file here"
                  : "Drag and drop a PDF file here, or click to select"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {extractedFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {viewMode === 'review' ? 'Missing Fields' : 'Extracted Fields'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formatEmailContent()
                .split('\n')
                .map((line, index) => (
                  <div
                    key={index}
                    className={cn(
                      "text-sm",
                      index === 0 ? "font-medium text-lg mb-4" : "font-mono"
                    )}
                  >
                    {line}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}