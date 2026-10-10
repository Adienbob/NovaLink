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
      supabaseAdmin
         .from("brands")
         .select("id, name")
         .ilike("name", `%${normalizedQuery}%`)
         .limit(10),

      supabaseAdmin
         .from("categories")
         .select("id, name")
         .ilike("name", `%${normalizedQuery}%`)
         .limit(10),

      supabaseAdmin
         .from("products")
         .select("name")
         .eq("is_active", true)
         .ilike("name", `%${normalizedQuery}%`)
         .limit(10),
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

   const suggestions = new Set<string>();

   // Add matching brands.
   for (const brand of brandsResult.data) {
      suggestions.add(brand.name);
   }

   // Add matching categories.
   for (const category of categoriesResult.data) {
      suggestions.add(category.name);
   }

   // Add matching product names.
   for (const product of productsResult.data) {
      suggestions.add(product.name);
   }

   // Find categories associated with matching brands.
   const brandIds = brandsResult.data.map((brand) => brand.id);

   if (brandIds.length > 0) {
      const { data: brandProducts, error } = await supabaseAdmin
         .from("products")
         .select(`
            brand_id,
            brand:brands (
               name
            ),
            category:categories (
               name
            )
         `)
         .in("brand_id", brandIds)
         .eq("is_active", true)
         .limit(50);

      if (error) {
         throw new Error(
            `Failed to fetch brand categories: ${error.message}`
         );
      }

      for (const product of brandProducts ?? []) {
         if (product.brand && product.category) {
            suggestions.add(
               `${product.brand.name} ${product.category.name}`
            );
         }
      }
   }

   return [...suggestions]
      .slice(0, MAX_SUGGESTIONS)
      .map((text) => ({ text }));
}