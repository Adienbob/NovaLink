"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
   usePathname,
   useRouter,
   useSearchParams,
} from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProductFilters } from "@/features/catalog/shared/filters/components/product-filters";
import type { ProductFilters as ProductFiltersType } from "@/features/catalog/shared/filters/types/product-filter";
import type { Product } from "@/features/catalog/products/types/product";
import { brandProductsQueryKey } from "@/shared/queries/brand-products-query-options";
import ProductGrid from "@/components/storefront/product-grid";

type BrandProductsProps = {
   slug: string;
   locale: string;
   availableCategories: {
      id: string;
      name: string;
      slug: string;
   }[];
};

export function BrandProducts({
   slug,
   locale,
   availableCategories,
}: BrandProductsProps) {

   const router = useRouter();
   const pathname = usePathname();

   function parsePositiveInteger(
      value: string | null,
      fallback: number,
   ): number {
      if (value === null || !/^\d+$/.test(value)) {
         return fallback;
      }

      const parsed = Number(value);

      return Number.isSafeInteger(parsed) && parsed > 0
         ? parsed
         : fallback;
   }

   const searchParams = useSearchParams();

   const [filters, setFilters] = useState<ProductFiltersType>(() => {
      const categorySlugs = new Set(
         (searchParams.get("categories") ?? "")
            .split(",")
            .map((slug) => slug.trim())
            .filter(Boolean),
      );

      const minPriceParam = searchParams.get("minPrice");
      const maxPriceParam = searchParams.get("maxPrice");

      function parsePrice(value: string | null) {
         if (value === null || value.trim() === "") {
            return undefined;
         }

         const parsed = Number(value);

         return Number.isFinite(parsed) && parsed >= 0
            ? parsed
            : undefined;
      }

      const sortByParam = searchParams.get("sortBy");

      const validSortOptions: NonNullable<
         ProductFiltersType["sortBy"]
      >[] = [
         "relevance",
         "price_asc",
         "price_desc",
         "newest",
         "name_asc",
      ];

      const sortBy =
         sortByParam &&
         validSortOptions.includes(
            sortByParam as NonNullable<ProductFiltersType["sortBy"]>,
         )
            ? (sortByParam as NonNullable<ProductFiltersType["sortBy"]>)
            : "relevance";

      return {
         brands: [],
         categories: availableCategories
            .filter((category) => categorySlugs.has(category.slug))
            .map((category) => category.id),
         minPrice: parsePrice(minPriceParam),
         maxPrice: parsePrice(maxPriceParam),
         sortBy,
         page: parsePositiveInteger(searchParams.get("page"), 1),
         pageSize: parsePositiveInteger(
            searchParams.get("pageSize"),
            12,
         ),
      };
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

   const updateUrl = useCallback(
      (nextFilters: ProductFiltersType) => {
         const params = new URLSearchParams(searchParams.toString());

         function setOrDelete(
            key: string,
            value: string | undefined,
         ) {
            if (value === undefined || value === "") {
               params.delete(key);
            } else {
               params.set(key, value);
            }
         }

         const selectedCategorySlugs = availableCategories
            .filter((category) =>
               nextFilters.categories?.includes(category.id),
            )
            .map((category) => category.slug);

         setOrDelete(
            "categories",
            [...new Set(selectedCategorySlugs)].join(","),
         );

         setOrDelete(
            "minPrice",
            nextFilters.minPrice?.toString(),
         );

         setOrDelete(
            "maxPrice",
            nextFilters.maxPrice?.toString(),
         );

         setOrDelete(
            "sortBy",
            nextFilters.sortBy === "relevance"
               ? undefined
               : nextFilters.sortBy,
         );

         setOrDelete(
            "page",
            nextFilters.page && nextFilters.page > 1
               ? nextFilters.page.toString()
               : undefined,
         );

         setOrDelete(
            "pageSize",
            nextFilters.pageSize === 12
               ? undefined
               : nextFilters.pageSize?.toString(),
         );

         const query = params.toString();

         router.replace(
            query ? `${pathname}?${query}` : pathname,
            { scroll: false },
         );
      },
      [availableCategories, pathname, router, searchParams],
   );

   function handleFiltersChange(nextFilters: ProductFiltersType) {
      const updatedFilters = {
         ...nextFilters,
         page: 1,
      };

      setFilters(updatedFilters);
      updateUrl(updatedFilters);
   }

   return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
         <ProductFilters
            availableCategories={availableCategories}
            initialFilters={filters}
            showBrands={false}
            showCategories
            onFiltersChange={handleFiltersChange}
         />
         

         <section>
            {paginatedProducts.length === 0 ? (
               <p className="py-8 text-center text-muted-foreground">
                  No products match your filters.
               </p>
            ) : (
               <div className="">
                  <ProductGrid products={paginatedProducts} locale={locale} />
               </div>
            )}

            {totalPages > 1 && (
               <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                     type="button"
                     disabled={page === 1}
                     onClick={() => {
                        const updatedFilters = {
                           ...filters,
                           page: page - 1,
                        };

                        setFilters(updatedFilters);
                        updateUrl(updatedFilters);
                     }}
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
                     onClick={() => {
                        const updatedFilters = {
                           ...filters,
                           page: page + 1,
                        };

                        setFilters(updatedFilters);
                        updateUrl(updatedFilters);
                     }}
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