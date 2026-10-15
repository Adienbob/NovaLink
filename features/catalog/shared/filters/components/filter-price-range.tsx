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
      <section className="space-y-3"> <h3 className="font-medium">Price range</h3>

         <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
               <span className="text-sm text-muted-foreground">
                  Minimum
               </span>
               <input
                  type="number"
                  min="0"
                  step="any"
                  value={min}
                  onChange={(event) => setMin(event.target.value)}
                  placeholder="Min"
                  className="w-full rounded-md border px-3 py-2 text-sm"
               />
            </label>

            <label className="space-y-1">
               <span className="text-sm text-muted-foreground">
                  Maximum
               </span>
               <input
                  type="number"
                  min="0"
                  step="any"
                  value={max}
                  onChange={(event) => setMax(event.target.value)}
                  placeholder="Max"
                  className="w-full rounded-md border px-3 py-2 text-sm"
               />
            </label>
         </div>

         {error && (
            <p role="alert" className="text-sm text-destructive">
               {error}
            </p>
         )}

         <button
            type="button"
            onClick={handleApply}
            className="w-full rounded-md border px-3 py-2 text-sm font-medium"
         >
            Apply price
         </button>
      </section>

   );
}
