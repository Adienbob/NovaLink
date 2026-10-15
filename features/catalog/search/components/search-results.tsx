"use client";

import { useMemo, useState } from "react";

import { ProductFilters as ProductFiltersComponent } from "@/features/catalog/shared/filters/components/product-filters";
import type { ProductFilters } from "@/features/catalog/shared/filters/types/product-filter";

type SearchProduct = {
   id: string;
   name: string;
   slug: string;
   description: string;
   base_price: number;
   brand: {
      id: string;
      name: string;
      slug: string;
      logo_url: string | null;
   } | null;
   category: {
      id: string;
      name: string;
      slug: string;
      parent_id: string | null;
   } | null;
};

type SearchResultsProps = {
   products: SearchProduct[];
};

export function SearchResults({
   products,
}: SearchResultsProps) {
   const [filters, setFilters] = useState<ProductFilters>({
      brands: [],
      categories: [],
      minPrice: undefined,
      maxPrice: undefined,
      inStock: false,
      sortBy: "relevance",
      page: 1,
      pageSize: 12,
   });

   const availableBrands = useMemo(
      () =>
         Array.from(
            new Map(
               products
                  .filter((product) => product.brand)
                  .map((product) => [
                     product.brand!.id,
                     {
                        id: product.brand!.id,
                        name: product.brand!.name,
                     },
                  ]),
            ).values(),
         ),
      [products],
   );

   const availableCategories = useMemo(
      () =>
         Array.from(
            new Map(
               products
                  .filter((product) => product.category)
                  .map((product) => [
                     product.category!.id,
                     {
                        id: product.category!.id,
                        name: product.category!.name,
                     },
                  ]),
            ).values(),
         ),
      [products],
   );

   const filteredProducts = useMemo(() => {
      let result = products.filter((product) => {
         if (
            filters.brands?.length &&
            (!product.brand ||
               !filters.brands.includes(product.brand.id))
         ) {
            return false;
         }

         if (
            filters.categories?.length &&
            (!product.category ||
               !filters.categories.includes(product.category.id))
         ) {
            return false;
         }

         if (
            filters.minPrice !== undefined &&
            product.base_price < filters.minPrice
         ) {
            return false;
         }

         if (
            filters.maxPrice !== undefined &&
            product.base_price > filters.maxPrice
         ) {
            return false;
         }

         return true;
      });

      switch (filters.sortBy) {
         case "price_asc":
            result.sort(
               (a, b) => a.base_price - b.base_price,
            );
            break;

         case "price_desc":
            result.sort(
               (a, b) => b.base_price - a.base_price,
            );
            break;

         case "name_asc":
            result.sort((a, b) =>
               a.name.localeCompare(b.name),
            );
            break;

         case "relevance":
         default:
            // Keep the relevance order returned by the RPC.
            break;
      }

      return result;
   }, [products, filters]);

   const pageSize = filters.pageSize ?? 12;
   const currentPage = filters.page ?? 1;

   const totalPages = Math.ceil(
      filteredProducts.length / pageSize,
   );

   const paginatedProducts = filteredProducts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
   );

   function handleFiltersChange(nextFilters: ProductFilters) {
      setFilters({
         ...nextFilters,
         page: 1,
      });
   }

   return (
      <section className="mt-6">
         <ProductFiltersComponent
            availableBrands={availableBrands}
            availableCategories={availableCategories}
            initialFilters={filters}
            showBrands
            showCategories
            onFiltersChange={handleFiltersChange}
         />

         <p className="mt-4 text-sm text-muted-foreground">
            {filteredProducts.length} products found
         </p>

         {filteredProducts.length === 0 ? (
            <p className="mt-6">
               No products match the selected filters.
            </p>
         ) : (
            <>
               <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedProducts.map((product) => (
                     <article
                        key={product.id}
                        className="rounded-lg border p-4"
                     >
                        <h2 className="font-medium">
                           {product.name}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                           {product.brand?.name ?? "Unknown brand"}
                        </p>

                        <p className="mt-2 text-sm">
                           {product.category?.name ?? "Uncategorized"}
                        </p>

                        <p className="mt-3 font-semibold">
                           {Number(product.base_price).toLocaleString(
                              "en-US",
                           )}{" "}
                           EGP
                        </p>
                     </article>
                  ))}
               </div>

               {totalPages > 1 && (
                  <nav
                     aria-label="Search results pagination"
                     className="mt-6 flex items-center justify-center gap-4"
                  >
                     <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() =>
                           setFilters((current) => ({
                              ...current,
                              page: currentPage - 1,
                           }))
                        }
                        className="rounded border px-4 py-2 disabled:opacity-50"
                     >
                        Previous
                     </button>

                     <span>
                        Page {currentPage} of {totalPages}
                     </span>

                     <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() =>
                           setFilters((current) => ({
                              ...current,
                              page: currentPage + 1,
                           }))
                        }
                        className="rounded border px-4 py-2 disabled:opacity-50"
                     >
                        Next
                     </button>
                  </nav>
               )}
            </>
         )}
      </section>
   );
}