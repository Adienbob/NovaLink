import { supabaseAdmin } from "@/app/lib/supabase/server";
import { SearchSuggestion } from "../types/search";

const MAX_SUGGESTIONS = 8;

export async function getSearchSuggestions(
   query: string
): Promise<SearchSuggestion[]> {
   const normalizedQuery = query.trim();

   if (normalizedQuery.length < 2) {
      return [];
   }
   

   const [
      brandsResult,
      categoriesResult,
      productsResult,
   ] = await Promise.all([
      supabaseAdmin.rpc("search_brands_fuzzy", {
         search_query: normalizedQuery,
      }),

      supabaseAdmin.rpc("search_categories_fuzzy", {
         search_query: normalizedQuery,
      }),

      supabaseAdmin.rpc("search_suggestions_fuzzy", {
         search_query: normalizedQuery,
      }),
   ]);

   if (brandsResult.error) {
      throw new Error(
         `Failed to fetch brand suggestions: ${brandsResult.error.message}`
      );
   }

   if (categoriesResult.error) {
      throw new Error(
         `Failed to fetch category suggestions: ${categoriesResult.error.message}`
      );
   }

   if (productsResult.error) {
      throw new Error(
         `Failed to fetch product suggestions: ${productsResult.error.message}`
      );
   }

   const categoryIds = categoriesResult.data.map(
   (category) => category.id
);

   const { data: categoryProducts, error: categoryProductsError } =
      categoryIds.length > 0
         ? await supabaseAdmin
            .from("products")
            .select("name")
            .in("category_id", categoryIds)
            .eq("is_active", true)
            .limit(10)
         : { data: [], error: null };

   if (categoryProductsError) {
      throw new Error(
         `Failed to fetch category products: ${categoryProductsError.message}`
      );
   }

   const suggestions = new Set<string>();

// Add matching brands.
for (const brand of brandsResult.data) {
   suggestions.add(brand.name);
}

// Add matching categories first.
for (const category of categoriesResult.data) {
   suggestions.add(category.name);
}

// Add products from matching categories.
for (const product of categoryProducts ?? []) {
   suggestions.add(product.name);
}

// Add matching product names.
for (const product of productsResult.data) {
   suggestions.add(product.name);
}

   return [...suggestions]
      .slice(0, MAX_SUGGESTIONS)
      .map((text) => ({ text }));
}