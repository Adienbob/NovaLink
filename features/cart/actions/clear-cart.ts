"use server";

import { requireUser } from "@/app/lib/auth/require-user";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export async function clearCart() {
   const user = await requireUser();

   const { error } = await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

   if (error) {
      throw new Error("CART_CLEAR_FAILED");
   }

   return { success: true };
}