"use server";

import { requireUser } from "@/app/lib/auth/require-user";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { z } from "zod";

const removeFromCartSchema = z.object({
   variantId: z.string().uuid(),
});


type RemoveFromCartInput = {
   variantId: string;
};

export async function removeFromCart({
   variantId,
}: RemoveFromCartInput) {
   const user = await requireUser();

   const validation = removeFromCartSchema.safeParse({ variantId });

   if (!validation.success) {
      throw new Error("INVALID_CART_INPUT");
   }

   const { data, error } = await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_variant_id", variantId)
      .select("id");

   if (error) {
      throw new Error("CART_REMOVE_FAILED");
   }

   if (data.length === 0) {
      throw new Error("CART_ITEM_NOT_FOUND");
   }

   return { success: true };
}