"use server";

import { supabaseAdmin } from "@/app/lib/supabase/server";

export async function getPublicCategories() {

   const { data, error } = await supabaseAdmin
      .from("categories")
      .select("id, name, slug, parent_id, logo_url")
      .order("name", { ascending: true });

   if (error) {
      console.error("Error fetching public categories:", error);
      return [];
   }

   return data || [];
}