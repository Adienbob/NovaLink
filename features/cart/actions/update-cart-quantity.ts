"use server";

import { requireUser } from "@/app/lib/auth/require-user";
import { supabaseAdmin } from "@/app/lib/supabase/server";

import { z } from "zod";

const updateCartQuantitySchema = z.object({
   variantId: z.string().uuid(),
   quantity: z.number().int().positive(),
});


type UpdateCartQuantityInput = {
   variantId: string;
   quantity: number;
};

export async function updateCartQuantity({
   variantId,
   quantity,
}: UpdateCartQuantityInput) {
   const user = await requireUser();

   const validation = updateCartQuantitySchema.safeParse({
      variantId,
      quantity,
   });

   if (!validation.success) {
      throw new Error("INVALID_CART_INPUT");
   }

   const { data: item, error: itemError } = await supabaseAdmin
      .from("cart_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_variant_id", variantId)
      .maybeSingle();

   if (itemError) {
      throw new Error("CART_FETCH_FAILED");
   }

   if (!item) {
      throw new Error("CART_ITEM_NOT_FOUND");
   }

   const { data: variant, error: variantError } = await supabaseAdmin
      .from("product_variants")
      .select(`       id,
            stock_quantity,
            is_active,
            product:products!inner (
               is_active
            )
         `)
      .eq("id", variantId)
      .single();


   if (
      variantError ||
      !variant ||
      !variant.is_active ||
      !variant.product?.is_active
   ) {
      throw new Error("VARIANT_UNAVAILABLE");
   }


   if (quantity > variant.stock_quantity) {
      throw new Error("INSUFFICIENT_STOCK");
   }

   const { data, error } = await supabaseAdmin
      .from("cart_items")
      .update({
         quantity,
         updated_at: new Date().toISOString(),
      })
      .eq("id", item.id)
      .eq("user_id", user.id)
      .select("id, product_variant_id, quantity, created_at, updated_at")
      .single();

   if (error) {
      throw new Error("CART_UPDATE_FAILED");
   }

   return data;
}