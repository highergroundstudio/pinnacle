"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload, Copy, RefreshCw } from "lucide-react";
import { extractPDFContent, type ParsedField } from "@/lib/pdf-parser";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Custom Hook with Fallback
export function useCopyToClipboard() {
	const [copiedText, setCopiedText] = useState<string | null>(null);

	const copyToClipboard = async (text: string, isHtml = false) => {
		try {
			if (navigator.clipboard) {
				if (isHtml) {
					const blob = new Blob([text], { type: "text/html" });
					const clipboardItem = new ClipboardItem({ "text/html": blob });
					await navigator.clipboard.write([clipboardItem]);
				} else {
					await navigator.clipboard.writeText(text);
				}
			} else {
				// Fallback for insecure contexts
				const textArea = document.createElement("textarea");
				textArea.value = text;
				textArea.style.position = "fixed";
				textArea.style.opacity = "0";
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				document.execCommand("copy");
				document.body.removeChild(textArea);
			}
			setCopiedText(text);
			return true;
		} catch (error) {
			console.error("Failed to copy to clipboard:", error);
			return false;
		}
	};

	return [copiedText, copyToClipboard] as const;
}

type ViewMode = "lender" | "review";

export default function PDFParsePage() {
	const [isProcessing, setIsProcessing] = useState(false);
	const [extractedFields, setExtractedFields] = useState<ParsedField[]>([]);
	const [viewMode, setViewMode] = useState<ViewMode>("lender");

	const [copiedText, copyToClipboard] = useCopyToClipboard();

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			"application/pdf": [".pdf"],
		},
		maxFiles: 1,
		onDrop: async (acceptedFiles) => {
			if (acceptedFiles.length === 0) return;

			try {
				setIsProcessing(true);
				const file = acceptedFiles[0];
				const fields = await extractPDFContent(file);
				setExtractedFields(fields); // Keep the order as extracted
				toast.success("PDF processed successfully");
			} catch (error: unknown) {
				toast.error((error as Error).message || "Failed to process PDF");
			} finally {
				setIsProcessing(false);
			}
		},
	});

	// const filteredFields = extractedFields
	// 	.filter(
	// 		(field) =>
	// 			field.value !== undefined &&
	// 			field.value !== "" &&
	// 			field.value !== "0" &&
	// 			field.value !== "$0",
	// 	)
	// 	.map((field) => {
	// 		if (field.name.toLowerCase().includes("$")) {
	// 			const numericValue = Number(field.value);
	// 			if (!Number.isNaN(numericValue)) {
	// 				field.value = numericValue.toLocaleString("en-US", {
	// 					style: "currency",
	// 					currency: "USD",
	// 					minimumFractionDigits: 0,
	// 					maximumFractionDigits: 0,
	// 				});
	// 			}
	// 		}
	// 		return field;
	// 	});

	const preMessage =
		"Please let me know your interest and terms in the following loan request: \n\n";

	const generateTextContent = () => {
		return (
			preMessage +
			extractedFields.map(({ name, value }) => `${name}: ${value}\n`).join("")
		);
	};

	const generateHtmlContent = () => {
		return `<div>${preMessage}</div><br>${extractedFields
			.map(({ name, value }) => `<div><strong>${name}:</strong> ${value}</div>`)
			.join("")}`;
	};

	const handleCopyText = async () => {
		const textContent = generateTextContent();
		const success = await copyToClipboard(textContent);
		if (success) toast.success("Copied text to clipboard");
	};

	const handleCopyHtml = async () => {
		const htmlContent = generateHtmlContent();
		const success = await copyToClipboard(htmlContent, true);
		if (success) toast.success("Copied HTML to clipboard");
	};

	const renderFields = () => {
		return extractedFields.map(({ name, value }) => (
			<div key={name} className="flex justify-between">
				<span className="font-medium">{name}:</span>
				<span>{viewMode === "lender" ? value : "[Missing]"}</span>
			</div>
		));
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">PDF Parse</h1>
				<div className="flex items-center space-x-4">
					<Select
						value={viewMode}
						onValueChange={(value: ViewMode) => setViewMode(value)}
					>
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
								onClick={() => setExtractedFields([])}
								className="flex items-center"
							>
								<RefreshCw className="mr-2 h-4 w-4" />
								Clear
							</Button>
							<Button
								variant="outline"
								onClick={handleCopyText}
								className="flex items-center"
							>
								<Copy className="mr-2 h-4 w-4" />
								Copy Text
							</Button>
							<Button
								variant="outline"
								onClick={handleCopyHtml}
								className="flex items-center"
							>
								<Copy className="mr-2 h-4 w-4" />
								Copy HTML
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
							isDragActive
								? "border-primary bg-primary/5"
								: "border-muted-foreground/25",
							isProcessing
								? "pointer-events-none"
								: "hover:border-primary hover:bg-primary/5",
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
							{viewMode === "review" ? "Missing Fields" : "Extracted Fields"}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">{renderFields()}</CardContent>
				</Card>
			)}
		</div>
	);
}
