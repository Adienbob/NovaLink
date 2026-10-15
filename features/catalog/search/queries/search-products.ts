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
   console.log(data)

   return (data ?? []).map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      base_price: product.base_price,
      brand: product.brand_id
         ? {
            id: product.brand_id,
            name: product.brand_name,
            slug: product.brand_slug,
            logo_url: null,
         }
         : null,
      category: product.category_id
         ? {
            id: product.category_id,
            name: product.category_name,
            slug: product.category_slug,
            parent_id: null,
         }
         : null,
   }));
}