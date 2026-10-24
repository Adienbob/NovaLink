"use server";

import { supabaseAdmin } from "@/app/lib/supabase/server";

export async function getPublicBrands() {

   const { data, error } = await supabaseAdmin
      .from("brands")
      .select("id, name, slug")
      .order("name", { ascending: true });

   if (error) {
      console.error("Error fetching public brands:", error);
      return [];
   }

   return data || [];
}