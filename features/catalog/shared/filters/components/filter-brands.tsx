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
      <section className="space-y-3"> <h3 className="font-medium">Brands</h3>
         <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search brands..."
            aria-label="Search brands"
            className="w-full rounded-md border px-3 py-2 text-sm"
         />

         <div className="max-h-52 space-y-2 overflow-y-auto">
            {filteredBrands.map((brand) => (
               <label
                  key={brand.id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
               >
                  <input
                     type="checkbox"
                     checked={selectedBrands.includes(brand.id)}
                     onChange={() => toggleBrand(brand.id)}
                  />
                  <span>{brand.name}</span>
               </label>
            ))}

            {filteredBrands.length === 0 && (
               <p className="text-sm text-muted-foreground">
                  No brands found.
               </p>
            )}
         </div>
      </section>
   );
}
