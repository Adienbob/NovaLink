"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductFilters } from "@/features/catalog/shared/filters/components/product-filters";
import type { ProductFilters as ProductFiltersType } from "@/features/catalog/shared/filters/types/product-filter";
import type { Product } from "@/features/catalog/products/types/product";
import { brandProductsQueryKey } from "@/shared/queries/brand-products-query-options";

type BrandProductsProps = {
   slug: string;
   locale: string;
   availableCategories: {
      id: string;
      name: string;
   }[];
};

export function BrandProducts({
   slug,
   locale,
   availableCategories,
}: BrandProductsProps) {
   const [filters, setFilters] = useState<ProductFiltersType>({
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "relevance",
      page: 1,
      pageSize: 12,
   });

   const { data: products } = useQuery<Product[]>({
      queryKey: brandProductsQueryKey(slug),
      queryFn: () => {
         throw new Error(
            "Brand products should already exist in the hydrated cache.",
         );
      },
      enabled: false,
      staleTime: Infinity,
   });

   if (!products) {
      throw new Error("Brand products are missing from the cache.");
   }

   const filteredProducts = useMemo(() => {
      const filtered = products.filter((product) => {
         const matchesCategory =
            !filters.categories?.length ||
            (product.category !== null &&
            filters.categories.includes(product.category.id));

         const matchesMinPrice =
            filters.minPrice === undefined ||
            product.base_price >= filters.minPrice;

         const matchesMaxPrice =
            filters.maxPrice === undefined ||
            product.base_price <= filters.maxPrice;

         return matchesCategory && matchesMinPrice && matchesMaxPrice;
      });

      switch (filters.sortBy) {
         case "price_asc":
            filtered.sort((a, b) => a.base_price - b.base_price);
            break;
         case "price_desc":
            filtered.sort((a, b) => b.base_price - a.base_price);
            break;
         case "newest":
            filtered.sort((a, b) =>
               (b.created_at ?? "").localeCompare(a.created_at ?? ""),
            );
            break;
         case "name_asc":
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
      }

      return filtered;
   }, [products, filters]);

   const pageSize = filters.pageSize ?? 12;
   const page = filters.page ?? 1;
   const start = (page - 1) * pageSize;

   const paginatedProducts = filteredProducts.slice(
      start,
      start + pageSize,
   );

   const totalPages = Math.ceil(filteredProducts.length / pageSize);

   return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
         <ProductFilters
            availableCategories={availableCategories}
            showBrands={false}
            showCategories
            onFiltersChange={setFilters}
         />

         <section>
            <p className="mb-4 text-sm text-muted-foreground">
               {filteredProducts.length} products
            </p>

            {paginatedProducts.length === 0 ? (
               <p className="py-8 text-center text-muted-foreground">
                  No products match your filters.
               </p>
            ) : (
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedProducts.map((product) => (
                     <article
                        key={product.id}
                        className="space-y-3 rounded-lg border p-4"
                     >
                        {product.images[0] && (
                           <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="aspect-square w-full rounded-md object-contain"
                           />
                        )}

                        <h2 className="font-medium">
                           <Link
                              href={`/${locale}/products/${product.slug}`}
                              className="hover:underline"
                           >
                              {product.name}
                           </Link>
                        </h2>

                        <p className="text-sm text-muted-foreground">
                           {product.brand?.name ?? "Unknown brand"}
                        </p>

                        <p className="font-semibold">
                           {product.base_price}
                        </p>
                     </article>
                  ))}
               </div>
            )}

            {totalPages > 1 && (
               <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                     type="button"
                     disabled={page === 1}
                     onClick={() =>
                        setFilters((prev) => ({
                           ...prev,
                           page: page - 1,
                        }))
                     }
                     className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     Previous
                  </button>

                  <span className="text-sm">
                     Page {page} of {totalPages}
                  </span>

                  <button
                     type="button"
                     disabled={page >= totalPages}
                     onClick={() =>
                        setFilters((prev) => ({
                           ...prev,
                           page: page + 1,
                        }))
                     }
                     className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     Next
                  </button>
               </div>
            )}
         </section>
      </div>
   );
}