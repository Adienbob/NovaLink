"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
   useSearchParams,
   useRouter,
   usePathname,
} from "next/navigation";

import { ProductFilters as ProductFiltersComponent } from "@/features/catalog/shared/filters/components/product-filters";
import type { ProductFilters } from "@/features/catalog/shared/filters/types/product-filter";
import Link from "next/link";

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
   locale: string;
};

const DEFAULT_PAGE_SIZE = 12;

const VALID_SORT_OPTIONS: NonNullable<ProductFilters["sortBy"]>[] = [
   "relevance",
   "price_asc",
   "price_desc",
   "name_asc",
];

function parseNonNegativeNumber(
   value: string | null,
): number | undefined {
   if (value === null || value.trim() === "") {
      return undefined;
   }

   const number = Number(value);

   if (!Number.isFinite(number) || number < 0) {
      return undefined;
   }

   return number;
}

function parsePositiveInteger(
   value: string | null,
   fallback: number,
): number {
   if (value === null || !/^\d+$/.test(value)) {
      return fallback;
   }

   const number = Number(value);

   return Number.isSafeInteger(number) && number > 0
      ? number
      : fallback;
}

export function SearchResults({
   products,
   locale,
}: SearchResultsProps) {
   const searchParams = useSearchParams();
   const router = useRouter();
   const pathname = usePathname();
   const updateUrl = useCallback(
      (nextFilters: ProductFilters) => {
         const params = new URLSearchParams(searchParams.toString());

         function setOrDelete(key: string, value: string | undefined) {
            if (value === undefined || value === "") {
               params.delete(key);
            } else {
               params.set(key, value);
            }
         }

         const selectedBrandSlugs = products
            .filter(
               (product) =>
                  product.brand &&
                  nextFilters.brands?.includes(product.brand.id),
            )
            .map((product) => product.brand!.slug);

         const selectedCategorySlugs = products
            .filter(
               (product) =>
                  product.category &&
                  nextFilters.categories?.includes(product.category.id),
            )
            .map((product) => product.category!.slug);

         setOrDelete(
            "brands",
            [...new Set(selectedBrandSlugs)].join(","),
         );

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

         router.replace(
            `${pathname}?${params.toString()}`,
            { scroll: false },
         );
      },
      [pathname, products, router, searchParams],
   );
      

   const [filters, setFilters] = useState<ProductFilters>(() => {
      const brandSlugs = new Set(
         (searchParams.get("brands") ?? "")
            .split(",")
            .map((slug) => slug.trim())
            .filter(Boolean),
      );

      const categorySlugs = new Set(
         (searchParams.get("categories") ?? "")
            .split(",")
            .map((slug) => slug.trim())
            .filter(Boolean),
      );

      const sortByParam = searchParams.get("sortBy");

      const sortBy =
         sortByParam &&
         VALID_SORT_OPTIONS.includes(
            sortByParam as NonNullable<ProductFilters["sortBy"]>,
         )
            ? (sortByParam as NonNullable<ProductFilters["sortBy"]>)
            : "relevance";

      return {
         brands: [
            ...new Set(
               products
                  .filter(
                     (product) =>
                        product.brand &&
                        brandSlugs.has(product.brand.slug),
                  )
                  .map((product) => product.brand!.id),
            ),
         ],

         categories: [
            ...new Set(
               products
                  .filter(
                     (product) =>
                        product.category &&
                        categorySlugs.has(product.category.slug),
                  )
                  .map((product) => product.category!.id),
            ),
         ],

         minPrice: parseNonNegativeNumber(
            searchParams.get("minPrice"),
         ),

         maxPrice: parseNonNegativeNumber(
            searchParams.get("maxPrice"),
         ),

         inStock: false,
         sortBy,

         page: parsePositiveInteger(
            searchParams.get("page"),
            1,
         ),

         pageSize: parsePositiveInteger(
            searchParams.get("pageSize"),
            DEFAULT_PAGE_SIZE,
         ),
      };
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
      const result = products.filter((product) => {
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
            // Preserve the relevance order returned by the RPC.
            break;
      }

      return result;
   }, [products, filters]);

   const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
   const currentPage = filters.page ?? 1;

   const totalPages = Math.ceil(
      filteredProducts.length / pageSize,
   );

   const paginatedProducts = filteredProducts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
   );

   function handleFiltersChange(nextFilters: ProductFilters) {
      const updatedFilters = {
         ...nextFilters,
         page: 1,
      };

      setFilters(updatedFilters);
      updateUrl(updatedFilters);
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
                        <Link
                           href={`/${locale}/products/${product.slug}`}
                           className="hover:underline"
                        >
                           {product.name}
                        </Link>
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
                        onClick={() => {
                           const updatedFilters = {
                              ...filters,
                              page: currentPage - 1,
                           };

                           setFilters(updatedFilters);
                           updateUrl(updatedFilters);
                        }}
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
                        onClick={() => {
                           const updatedFilters = {
                              ...filters,
                              page: currentPage + 1,
                           };

                           setFilters(updatedFilters);
                           updateUrl(updatedFilters);
                        }}
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