"use server";

import { requireUser } from "@/app/lib/auth/require-user";
import { supabaseAdmin } from "@/app/lib/supabase/server";

import { z } from "zod";

const mergeGuestCartSchema = z.object({
   items: z.array(
      z.object({
      variantId: z.string().uuid(),
      quantity: z.number().int().positive(),
      }),
   ),
});


type MergeGuestCartInput = {
   items: {
      variantId: string;
      quantity: number;
   }[];
};

export async function mergeGuestCart({
   items,
}: MergeGuestCartInput) {
   const user = await requireUser();

   const validation = mergeGuestCartSchema.safeParse({ items });

   if (!validation.success) {
      throw new Error("INVALID_CART_INPUT");
   }

   const validatedItems = validation.data.items;

   if (validatedItems.length === 0) {
      return { success: true };
   }

   const { error } = await supabaseAdmin.rpc("merge_guest_cart", {
      p_user_id: user.id,
      p_items: validatedItems,
   });

   if (error) {
      console.error("Failed to merge guest cart:", error);

      if (error.message.includes("INSUFFICIENT_STOCK")) {
         throw new Error("INSUFFICIENT_STOCK");
      }

      if (error.message.includes("VARIANT_UNAVAILABLE")) {
         throw new Error("VARIANT_UNAVAILABLE");
      }

      if (error.message.includes("INVALID_CART_INPUT")) {
         throw new Error("INVALID_CART_INPUT");
      }

      throw new Error("CART_MERGE_FAILED");
   }

   return { success: true };
}