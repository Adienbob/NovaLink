import { supabaseAdmin } from "@/app/lib/supabase/server";
import { requireUser } from "@/app/lib/auth/require-user";

export async function getAddresses() {
   const user = await requireUser();

   const { data, error } = await supabaseAdmin
      .from("addresses")
      .select("*, governorate:governorates(id, name_ar, name_en)")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

   if (error) {
      throw new Error(error.message);
   }

   return data ?? [];
}

export async function getGovernorates() {
   const { data, error } = await supabaseAdmin
      .from("governorates")
      .select("id, name_en, name_ar")
      .order("name_en");

   if (error) {
      throw new Error(error.message);
   }

   return data ?? [];
}