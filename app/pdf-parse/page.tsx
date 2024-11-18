"use client";

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload, Copy, RefreshCw } from "lucide-react";
import { extractPDFContent, type ParsedField } from '@/lib/pdf-parser';

export default function PDFParsePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ParsedField[]>([]);

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

  const copyToClipboard = () => {
    const formattedText = extractedFields
      .map(({ name, value }) => `${name}: ${value}`)
      .join('\n');
    navigator.clipboard.writeText(formattedText);
    toast.success('Copied to clipboard');
  };

  const clearFields = () => {
    setExtractedFields([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">PDF Parse</h1>
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
              onClick={copyToClipboard}
              className="flex items-center"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy All
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${isProcessing ? 'pointer-events-none opacity-50' : 'hover:border-primary hover:bg-primary/5'}
            `}
          >
            <input {...getInputProps()} />
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p>Processing PDF...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  {isDragActive
                    ? "Drop the PDF file here"
                    : "Drag and drop a PDF file here, or click to select"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {extractedFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {extractedFields.map((field, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-muted/50 flex justify-between items-center group"
                >
                  <div className="flex-1">
                    <span className="font-medium">{field.name}:</span>
                    <span className="ml-2 font-mono">{field.value}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      navigator.clipboard.writeText(`${field.name}: ${field.value}`);
                      toast.success('Field copied to clipboard');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}