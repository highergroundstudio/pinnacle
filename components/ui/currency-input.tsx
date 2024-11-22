"use client";

import * as React from "react";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps
	extends React.ComponentProps<typeof NumericFormat> {
	className?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
	({ className, ...props }, ref) => {
		const [expression, setExpression] = React.useState("");
		const [isCalculating, setIsCalculating] = React.useState(false);

		const evaluateExpression = (expr: string) => {
			try {
				// Remove currency symbols and commas
				const cleanExpr = expr.replace(/[$,]/g, "");
				// Only allow numbers, basic math operators, and parentheses
				if (!/^[\d\s+\-*/(). ]+$/.test(cleanExpr)) return null;
				// Use Function instead of eval for better security
				const result = new Function(`return ${cleanExpr}`)();
				return Number.isNaN(result) ? null : result;
			} catch {
				return null;
			}
		};

		return (
			<NumericFormat
				getInputRef={ref}
				customInput={Input}
				thousandSeparator
				prefix="$"
				className={cn(className)}
				allowNegative={false}
				onValueChange={(values, sourceInfo) => {
					// Only process calculation if user is typing
					if (sourceInfo.source === "event") {
						const result = evaluateExpression(values.value);
						if (result !== null) {
							props.onValueChange?.(
								{
									...values,
									floatValue: result,
									value: result.toString(),
								},
								sourceInfo,
							);
						} else {
							props.onValueChange?.(values, sourceInfo);
						}
					} else {
						props.onValueChange?.(values, sourceInfo);
					}
				}}
				{...props}
			/>
		);
	},
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
