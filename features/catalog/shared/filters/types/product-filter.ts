export type ProductFilters = {
   brands?: string[];
   categories?: string[];
   minPrice?: number;
   maxPrice?: number;
   inStock?: boolean;
   sortBy?: "relevance" | "price_asc" | "price_desc" | "newest" | "name_asc";
   page?: number;
   pageSize?: number;
};