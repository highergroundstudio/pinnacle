"use client";

import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";

interface PDFUploadProps {
  onUpload: (file: File) => Promise<void>;
  isProcessing: boolean;
  compact?: boolean;
}

export function PDFUpload({ onUpload, isProcessing, compact = false }: PDFUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isProcessing,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      await onUpload(acceptedFiles[0]);
    }
  });

  if (compact) {
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Button 
          type="button" 
          variant="outline" 
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Import from PDF
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
        ${isProcessing ? 'pointer-events-none opacity-50' : 'hover:border-primary hover:bg-primary/5'}
      `}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Processing PDF...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the PDF file here"
              : "Drag and drop a PDF file here, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF will be processed to pre-fill the form fields
          </p>
        </div>
      )}
    </div>
  );
}