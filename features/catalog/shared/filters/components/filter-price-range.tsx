"use client";

import { useEffect, useState } from "react";

type FilterPriceRangeProps = {
   minPrice?: number;
   maxPrice?: number;
   onChange: (price: {
      minPrice?: number;
      maxPrice?: number;
   }) => void;
};

export function FilterPriceRange({
   minPrice,
   maxPrice,
   onChange,
}: FilterPriceRangeProps) {
   const [min, setMin] = useState(minPrice?.toString() ?? "");
   const [max, setMax] = useState(maxPrice?.toString() ?? "");
   const [error, setError] = useState("");

   useEffect(() => {
      setMin(minPrice?.toString() ?? "");
      setMax(maxPrice?.toString() ?? "");
   }, [minPrice, maxPrice]);

   function handleApply() {
      const parsedMin = min.trim() === "" ? undefined : Number(min);
      const parsedMax = max.trim() === "" ? undefined : Number(max);

      if (
         (parsedMin !== undefined &&
            (!Number.isFinite(parsedMin) || parsedMin < 0)) ||
         (parsedMax !== undefined &&
            (!Number.isFinite(parsedMax) || parsedMax < 0))
      ) {
         setError("Enter valid, non-negative prices.");
         return;
      }

      if (
         parsedMin !== undefined &&
         parsedMax !== undefined &&
         parsedMin > parsedMax
      ) {
         setError("Minimum price cannot exceed maximum price.");
         return;
      }

      setError("");
      onChange({ minPrice: parsedMin, maxPrice: parsedMax });

   }

  return (
   <section className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
      Price range
      </h3>

         <div className="grid grid-cols-2 gap-3">
            <label className="min-w-0 space-y-1.5">
               <span className="block text-xs font-medium text-muted-foreground">
                  Minimum
               </span>

               <input
                  type="number"
                  min="0"
                  step="any"
                  value={min}
                  onChange={(event) => {
                     setMin(event.target.value);
                     setError("");
                  }}
                  placeholder="Min"
                  aria-label="Minimum price"
                  aria-invalid={!!error}
                  className="w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-ring/20"
               />
            </label>

            <label className="min-w-0 space-y-1.5">
               <span className="block text-xs font-medium text-muted-foreground">
                  Maximum
               </span>

               <input
                  type="number"
                  min="0"
                  step="any"
                  value={max}
                  onChange={(event) => {
                     setMax(event.target.value);
                     setError("");
                  }}
                  placeholder="Max"
                  aria-label="Maximum price"
                  aria-invalid={!!error}
                  className="w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-ring/20"
               />
            </label>
         </div>

         {error && (
            <p
               role="alert"
               className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs leading-relaxed text-destructive"
            >
               {error}
            </p>
         )}

         <button
            type="button"
            onClick={handleApply}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.99]"
         >
            Apply price
         </button>
      </section>
   );
}
