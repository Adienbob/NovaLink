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

      <aside className="h-fit rounded-xl border border-border bg-card shadow-sm">
      {/* Header */} <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4"> <div className="flex items-center gap-2.5"> <span
                     aria-hidden="true"
                     className="h-5 w-1 rounded-full bg-primary"
                  /> <h2 className="text-base font-bold tracking-tight text-foreground">
      Filters </h2> </div>

            <button
               type="button"
               onClick={clearFilters}
               className="rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
               Clear all
            </button>
         </div>

         {/* Filter Sections */}
         <div className="divide-y divide-border px-5">
            {showBrands && (
               <div className="py-5">
                  <FilterBrands
                     brands={availableBrands}
                     selectedBrands={filters.brands ?? []}
                     onChange={(brands) => updateFilters({ brands })}
                  />
               </div>
            )}

            {showCategories && (
               <div className="py-5">
                  <FilterCategories
                     categories={availableCategories}
                     selectedCategories={filters.categories ?? []}
                     onChange={(categories) => updateFilters({ categories })}
                  />
               </div>
            )}

            <div className="py-5">
               <FilterPriceRange
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onChange={(price) => updateFilters(price)}
               />
            </div>

            {/* Sorting */}
            <section className="space-y-3 py-5">
               <label
                  htmlFor="product-sort"
                  className="block text-sm font-semibold text-foreground"
               >
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
                  className="w-full cursor-pointer appearance-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
               >
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="name_asc">Name: A–Z</option>
               </select>
            </section>
         </div>
      </aside>

   );
}
