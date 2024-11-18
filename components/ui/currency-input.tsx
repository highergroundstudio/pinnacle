"use client";

import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Input } from "@/components/ui/input";

const CurrencyInput = React.forwardRef<HTMLInputElement, NumericFormatProps>(
  (props, ref) => {
    return (
      <NumericFormat
        getInputRef={ref}
        customInput={Input}
        thousandSeparator=","
        prefix="$"
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };