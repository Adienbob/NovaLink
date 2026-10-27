// features/catalog/categories/queries/get-category-by-slug.ts
import { supabaseAdmin } from "@/app/lib/supabase/server";


export async function getBrandsBySlug(slug: string) {

   const { data, error } = await supabaseAdmin
      .from("brands")
      .select("name_ar, name, description_ar, description_en")
      .eq("slug", slug)
      .single();

   if (error) {
      throw new Error(
         `Failed to fetch category brands: ${error.message}`,
      );
   }

   return data;
}