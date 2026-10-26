"use client";

import { useMemo, useState } from "react";

type BrandOption = {
   id: string;
   name: string;
};

type FilterBrandsProps = {
   brands: BrandOption[];
   selectedBrands: string[];
   onChange: (brands: string[]) => void;
};

export function FilterBrands({
   brands,
   selectedBrands,
   onChange,
   }: FilterBrandsProps) {
   const [search, setSearch] = useState("");

   const filteredBrands = useMemo(
      () =>
      brands.filter((brand) =>
      brand.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
      [brands, search],
   );

   function toggleBrand(brandId: string) {
      const isSelected = selectedBrands.includes(brandId);

      onChange(
         isSelected
            ? selectedBrands.filter((id) => id !== brandId)
            : [...selectedBrands, brandId],
      )
   }

   return ( 
      <section className="space-y-4">
         <h3 className="text-sm font-semibold text-foreground">
            Brands
         </h3>

         <input
         type="search"
         value={search}
         onChange={(event) => setSearch(event.target.value)}
         placeholder="Search brands..."
         aria-label="Search brands"
         className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-ring/20"
         />

         <div className="max-h-56 space-y-1 overflow-y-auto pe-1">
            {filteredBrands.map((brand) => {
               const isSelected = selectedBrands.includes(brand.id);

               return (
                  <label
                     key={brand.id}
                     className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition-colors ${
                        isSelected
                           ? "bg-primary/5 text-primary"
                           : "text-foreground hover:bg-muted/70"
                     }`}
                  >
                     <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleBrand(brand.id)}
                        className="size-4 shrink-0 cursor-pointer rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                     />

                     <span className="min-w-0 flex-1 break-words">
                        {brand.name}
                     </span>
                  </label>
               );
            })}

            {filteredBrands.length === 0 && (
               <p className="rounded-lg border border-dashed border-border px-3 py-5 text-center text-sm text-muted-foreground">
                  No brands found.
               </p>
            )}

         </div>
      </section>

   );
}
