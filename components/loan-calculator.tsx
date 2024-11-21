"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface LoanCalculatorProps {
  asIsValue: number;
  onAmountChange: (amount: number) => void;
}

const PRESET_PERCENTAGES = [70, 75, 80];

export function LoanCalculator({ asIsValue, onAmountChange }: LoanCalculatorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [ltv, setLtv] = React.useState<string>("75");
  const [calculatedAmount, setCalculatedAmount] = React.useState<number>(0);

  React.useEffect(() => {
    const percentage = parseFloat(ltv);
    if (!isNaN(percentage) && percentage > 0 && percentage <= 100) {
      setCalculatedAmount((asIsValue * percentage) / 100);
    }
  }, [asIsValue, ltv]);

  const handleApplyAmount = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    onAmountChange(calculatedAmount);
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Loan Calculator</CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
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
                    e.preventDefault();
                    setLtv(percentage.toString());
                  }}
                >
                  {percentage}%
                </Button>
              ))}
            </div>

            {asIsValue > 0 && ltv && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Calculated Amount:</div>
                  <div className="text-xl font-bold text-primary">
                    {formatCurrency(calculatedAmount)}
                  </div>
                </div>
                <Button 
                  type="button"
                  onClick={handleApplyAmount}
                  className="w-full"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Apply Amount
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}