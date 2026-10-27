// features/catalog/categories/queries/get-category-by-slug.ts
import { supabaseAdmin } from "@/app/lib/supabase/server";


export async function getCategoryBySlug(slug: string) {

   const { data, error } = await supabaseAdmin
      .from("categories")
      .select("name_ar, name, description_ar, description_en")
      .eq("slug", slug)
      .single();

   if (error) {
      throw new Error(
         `Failed to fetch category products: ${error.message}`,
      );
   }

   return data;
}