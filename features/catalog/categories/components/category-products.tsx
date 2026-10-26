"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductFilters } from "@/features/catalog/shared/filters/components/product-filters";
import type { ProductFilters as ProductFiltersType } from "@/features/catalog/shared/filters/types/product-filter";
import { categoryProductsQueryKey } from "@/shared/queries/category-products-query-options";
import type { Product } from "@/features/catalog/products/types/product";
import ProductGrid from "@/components/storefront/product-grid";

type CategoryProductsProps = {
   slug: string;
   locale: string;
   availableBrands: {
      id: string;
      name: string;
      slug: string;
   }[];
};

function parsePositiveInteger(
   value: string | null,
   fallback: number,
): number {
   if (value === null || !/^\d+$/.test(value)) return fallback;

   const parsed = Number(value);

   return Number.isSafeInteger(parsed) && parsed > 0
      ? parsed
      : fallback;
}

function parsePrice(value: string | null): number | undefined {
   if (value === null || value.trim() === "") return undefined;

   const parsed = Number(value);

   return Number.isFinite(parsed) && parsed >= 0
      ? parsed
      : undefined;
}

const validSortOptions: NonNullable<ProductFiltersType["sortBy"]>[] = [
   "relevance",
   "price_asc",
   "price_desc",
   "newest",
   "name_asc",
];

export function CategoryProducts({
   slug,
   locale,
   availableBrands,
}: CategoryProductsProps) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const [filters, setFilters] = useState<ProductFiltersType>(() => {
      const brandSlugs = new Set(
         (searchParams.get("brands") ?? "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
      );

      const sortByParam = searchParams.get("sortBy");

      const sortBy =
         sortByParam &&
         validSortOptions.includes(
            sortByParam as NonNullable<ProductFiltersType["sortBy"]>,
         )
            ? (sortByParam as NonNullable<ProductFiltersType["sortBy"]>)
            : "relevance";

      return {
         brands: availableBrands
            .filter(
               (brand) => brand.slug && brandSlugs.has(brand.slug),
            )
            .map((brand) => brand.id),
         minPrice: parsePrice(searchParams.get("minPrice")),
         maxPrice: parsePrice(searchParams.get("maxPrice")),
         sortBy,
         page: parsePositiveInteger(searchParams.get("page"), 1),
         pageSize: parsePositiveInteger(
            searchParams.get("pageSize"),
            12,
         ),
      };
   });

   useEffect(() => {
      const params = new URLSearchParams(searchParams.toString());

      const brandSlugs = new Set(
         (params.get("brands") ?? "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
      );

      const sortByParam = params.get("sortBy");

      const sortBy =
         sortByParam &&
         validSortOptions.includes(
            sortByParam as NonNullable<ProductFiltersType["sortBy"]>,
         )
            ? (sortByParam as NonNullable<ProductFiltersType["sortBy"]>)
            : "relevance";

      setFilters({
         brands: availableBrands
            .filter(
               (brand) => brand.slug && brandSlugs.has(brand.slug),
            )
            .map((brand) => brand.id),
         minPrice: parsePrice(params.get("minPrice")),
         maxPrice: parsePrice(params.get("maxPrice")),
         sortBy,
         page: parsePositiveInteger(params.get("page"), 1),
         pageSize: parsePositiveInteger(params.get("pageSize"), 12),
      });
   }, [searchParams, availableBrands]);

   const updateUrl = useCallback(
      (nextFilters: ProductFiltersType) => {
         const params = new URLSearchParams(searchParams.toString());

         const selectedBrandSlugs = availableBrands
            .filter((brand) =>
               nextFilters.brands?.includes(brand.id),
            )
            .map((brand) => brand.slug)
            .filter((value): value is string => Boolean(value));

         if (selectedBrandSlugs.length > 0) {
            params.set("brands", selectedBrandSlugs.join(","));
         } else {
            params.delete("brands");
         }

         if (nextFilters.minPrice !== undefined) {
            params.set("minPrice", String(nextFilters.minPrice));
         } else {
            params.delete("minPrice");
         }

         if (nextFilters.maxPrice !== undefined) {
            params.set("maxPrice", String(nextFilters.maxPrice));
         } else {
            params.delete("maxPrice");
         }

         if (
            nextFilters.sortBy &&
            nextFilters.sortBy !== "relevance"
         ) {
            params.set("sortBy", nextFilters.sortBy);
         } else {
            params.delete("sortBy");
         }

         if (nextFilters.page && nextFilters.page !== 1) {
            params.set("page", String(nextFilters.page));
         } else {
            params.delete("page");
         }

         if (
            nextFilters.pageSize &&
            nextFilters.pageSize !== 12
         ) {
            params.set("pageSize", String(nextFilters.pageSize));
         } else {
            params.delete("pageSize");
         }

         const query = params.toString();

         router.replace(
            query ? `${pathname}?${query}` : pathname,
            { scroll: false },
         );
      },
      [availableBrands, pathname, router, searchParams],
   );

   const handleFiltersChange = useCallback(
      (nextFilters: ProductFiltersType) => {
         const updatedFilters = {
            ...nextFilters,
            page: 1,
         };

         setFilters(updatedFilters);
         updateUrl(updatedFilters);
      },
      [updateUrl],
   );

   const handlePageChange = useCallback(
      (nextPage: number) => {
         const updatedFilters = {
            ...filters,
            page: nextPage,
         };

         setFilters(updatedFilters);
         updateUrl(updatedFilters);
      },
      [filters, updateUrl],
   );

   const { data: products } = useQuery<Product[]>({
      queryKey: categoryProductsQueryKey(slug),
      queryFn: () => {
         throw new Error(
            "Category products should already exist in the hydrated cache.",
         );
      },
      enabled: false,
      staleTime: Infinity,
   });

   if (!products) {
      throw new Error("Category products are missing from the cache.");
   }

   const filteredProducts = useMemo(() => {
      const filtered = products.filter((product) => {
         const matchesBrand =
            !filters.brands?.length ||
            (product.brand !== null &&
               filters.brands.includes(product.brand.id));

         const matchesMinPrice =
            filters.minPrice === undefined ||
            product.base_price >= filters.minPrice;

         const matchesMaxPrice =
            filters.maxPrice === undefined ||
            product.base_price <= filters.maxPrice;

         return matchesBrand && matchesMinPrice && matchesMaxPrice;
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
   const totalPages = Math.ceil(filteredProducts.length / pageSize);

   // Keep the selected page valid when filters reduce the result count.
   const page = Math.min(filters.page ?? 1, Math.max(totalPages, 1));

   useEffect(() => {
      if (filters.page !== page) {
         const updatedFilters = { ...filters, page };
         setFilters(updatedFilters);
         updateUrl(updatedFilters);
      }
   }, [filters, page, updateUrl]);

   const start = (page - 1) * pageSize;
   const paginatedProducts = filteredProducts.slice(
      start,
      start + pageSize,
   );

   return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
         <ProductFilters
            availableCategories={availableBrands}
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