import React from "react";

export interface CheckboxProps
   extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
   onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
   ({ className = "", onCheckedChange, ...props }, ref) => {
      return (
         <input
         type="checkbox"
         ref={ref}
         className={`h-4 w-4 shrink-0 rounded border border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${className}`}
         onChange={(e) => {
            onCheckedChange?.(e.target.checked);
         }}
         {...props}
         />
      );
   }
);

Checkbox.displayName = "Checkbox";