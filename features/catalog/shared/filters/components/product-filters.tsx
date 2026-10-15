"use client";

import { useEffect, useState } from "react";
import type { ProductFilters as ProductFiltersType } from "../types/product-filter";
import { FilterBrands } from "./filter-brands";
import { FilterCategories } from "./filter-categories";
import { FilterPriceRange } from "./filter-price-range";

type ProductFiltersProps = {
   availableBrands?: { id: string; name: string }[];
   availableCategories?: { id: string; name: string }[];
   initialFilters?: ProductFiltersType;
   showBrands?: boolean;
   showCategories?: boolean;
   onFiltersChange?: (filters: ProductFiltersType) => void;
};

const defaultFilters: ProductFiltersType = {
   brands: [],
   categories: [],
   minPrice: undefined,
   maxPrice: undefined,
   sortBy: "relevance",
   page: 1,
   pageSize: 12,
};

export function ProductFilters({
   availableBrands = [],
   availableCategories = [],
   initialFilters,
   showBrands = true,
   showCategories = true,
   onFiltersChange,
}: ProductFiltersProps) {
   const [filters, setFilters] = useState<ProductFiltersType>({
      ...defaultFilters,
      ...initialFilters,
   });

   useEffect(() => {
      setFilters({
         ...defaultFilters,
         ...initialFilters,
      });
   }, [initialFilters]);

   function updateFilters(updates: Partial<ProductFiltersType>) {
      const next = {
         ...filters,
         ...updates,
         page: 1,
      };

      setFilters(next);
      onFiltersChange?.(next);
   }

   function clearFilters() {
      const cleared = {
         ...defaultFilters,
         page: 1,
      };

      setFilters(cleared);
      onFiltersChange?.(cleared);
   }

   return (
      <aside className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>

            <button
               type="button"
               onClick={clearFilters}
               className="text-sm underline underline-offset-4"
            >
               Clear all
            </button>
         </div>

         {showBrands && (
            <FilterBrands
               brands={availableBrands}
               selectedBrands={filters.brands ?? []}
               onChange={(brands) => updateFilters({ brands })}
            />
         )}

         {showCategories && (
            <FilterCategories
               categories={availableCategories}
               selectedCategories={filters.categories ?? []}
               onChange={(categories) => updateFilters({ categories })}
            />
         )}

         <FilterPriceRange
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onChange={(price) => updateFilters(price)}
         />

         <section className="space-y-3">
            <label htmlFor="product-sort" className="font-medium">
               Sort by
            </label>

            <select
               id="product-sort"
               value={filters.sortBy ?? "relevance"}
               onChange={(event) =>
                  updateFilters({
                     sortBy: event.target.value as ProductFiltersType["sortBy"],
                  })
               }
               className="w-full rounded-md border px-3 py-2 text-sm"
            >
               <option value="relevance">Relevance</option>
               <option value="price_asc">Price: Low to High</option>
               <option value="price_desc">Price: High to Low</option>
               <option value="newest">Newest</option>
               <option value="name_asc">Name: A–Z</option>
            </select>
         </section>
      </aside>
   );
}