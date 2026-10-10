import { supabaseAdmin } from "@/app/lib/supabase/server";
export async function searchProducts(query: string) {
   const normalizedQuery = query.trim();

   if (normalizedQuery.length < 2) {
      return [];
   }


   const { data, error } = await supabaseAdmin
      .from("products")
      .select(`
         id,
         name,
         slug,
         description,
         base_price,
         brands (
            name,
            slug
         ),
         categories (
            name,
            slug
         )
      `)
      .eq("is_active", true)
      .ilike("name", `%${normalizedQuery}%`)
      .order("name")
      .limit(24);

   if (error) {
      throw new Error(`Failed to search products: ${error.message}`);
   }

   return data ?? [];
}