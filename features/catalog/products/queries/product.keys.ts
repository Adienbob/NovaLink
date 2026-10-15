import type { ProductFilters } from "../../shared/filters/types/product-filter";

export const productKeys = {
   all: ["products"] as const,

   categories: () => [...productKeys.all, "category"] as const,

   category: (
      categorySlug: string,
      filters: ProductFilters,
   ) => [...productKeys.categories(), categorySlug, filters] as const,

   brands: () => [...productKeys.all, "brand"] as const,

   brand: (
      brandSlug: string,
      filters: ProductFilters,
   ) => [...productKeys.brands(), brandSlug, filters] as const,

   searches: () => [...productKeys.all, "search"] as const,

   search: (
      searchTerm: string,
      filters: ProductFilters,
   ) => [...productKeys.searches(), searchTerm, filters] as const,
};