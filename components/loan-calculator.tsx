"use client";

import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface LoanCalculatorProps {
  form: UseFormReturn<any>;
}

const PRESET_PERCENTAGES = [70, 75, 80];

export function LoanCalculator({ form }: LoanCalculatorProps) {
  const [ltv, setLtv] = React.useState<string>("75");
  const [calculatedAmount, setCalculatedAmount] = React.useState<number>(0);
  const asIsValue = form.watch("deal.asIsValue") || 0;

  React.useEffect(() => {
    const percentage = parseFloat(ltv);
    if (!isNaN(percentage) && percentage > 0 && percentage <= 100) {
      setCalculatedAmount((asIsValue * percentage) / 100);
    }
  }, [asIsValue, ltv]);

  // Auto-update amount when LTV changes
  React.useEffect(() => {
    const percentage = parseFloat(ltv);
    if (!isNaN(percentage) && percentage > 0 && percentage <= 100) {
      const amount = (asIsValue * percentage) / 100;
      form.setValue("deal.amount", amount);
    }
  }, [ltv, asIsValue, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Loan Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>As-Is Value</Label>
          <div className="text-2xl font-bold">
            {formatCurrency(asIsValue)}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ltv">Loan-to-Value (%)</Label>
          <div className="flex space-x-2">
            <Input
              id="ltv"
              type="number"
              min="0"
              max="100"
              value={ltv}
              onChange={(e) => setLtv(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_PERCENTAGES.map((percentage) => (
            <Button
              key={percentage}
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                setLtv(percentage.toString());
              }}
            >
              {percentage}%
            </Button>
          ))}
        </div>

        {asIsValue > 0 && ltv && (
          <div className="pt-2 space-y-1">
            <div className="text-sm text-muted-foreground">Calculated Amount:</div>
            <div className="text-xl font-bold text-primary">
              {formatCurrency(calculatedAmount)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}