import { supabaseAdmin } from "@/app/lib/supabase/server";

export async function searchProducts(query: string) {
   const normalizedQuery = query.trim();

   if (normalizedQuery.length < 2) {
      return [];
   }

   const { data, error } = await supabaseAdmin.rpc(
      "search_products_fuzzy",
      {
         search_query: normalizedQuery,
      }
   );

   if (error) {
      throw new Error(`Failed to search products: ${error.message}`);
   }

   return (data ?? []).map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      base_price: product.base_price,
      brands: product.brand_name
         ? {
               name: product.brand_name,
               slug: product.brand_slug,
            }
         : null,
      categories: product.category_name
         ? {
               name: product.category_name,
               slug: product.category_slug,
            }
         : null,
   }));
}