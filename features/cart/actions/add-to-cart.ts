"use server";

import { requireUser } from "@/app/lib/auth/require-user";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { z } from "zod";

const addToCartSchema = z.object({
variantId: z.string().uuid(),
quantity: z.number().int().positive(),
});


type AddToCartInput = {
   variantId: string;
   quantity: number;
};

export async function addToCart({
   variantId,
   quantity,
}: AddToCartInput) {
   const user = await requireUser();

   const validation = addToCartSchema.safeParse({
      variantId,
      quantity,
   });

   if (!validation.success) {
      throw new Error("INVALID_CART_INPUT");
   }

   const { data: variant, error: variantError } = await supabaseAdmin
   .from("product_variants")
   .select(`
      id,
      stock_quantity,
      is_active,
      product:products!inner (
         is_active
      )
   `)
   .eq("id", variantId)
   .single();

   if (variantError || !variant || !variant.is_active) {
      throw new Error("VARIANT_UNAVAILABLE");
   }

   const { data: existingItem, error: existingError } = await supabaseAdmin
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_variant_id", variantId)
      .maybeSingle();

   if (existingError) {
      throw new Error("CART_FETCH_FAILED");
   }

   const newQuantity = (existingItem?.quantity ?? 0) + quantity;

   if (newQuantity > variant.stock_quantity) {
      throw new Error("INSUFFICIENT_STOCK");
   }

   if (existingItem) {
      const { data, error } = await supabaseAdmin
         .from("cart_items")
         .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
         })
         .eq("id", existingItem.id)
         .eq("user_id", user.id)
         .select("id, product_variant_id, quantity, created_at, updated_at")
         .single();

      if (error) {
         throw new Error("CART_UPDATE_FAILED");
      }

      return data;
   }

   const { data, error } = await supabaseAdmin
      .from("cart_items")
      .insert({
         user_id: user.id,
         product_variant_id: variantId,
         quantity,
      })
      .select("id, product_variant_id, quantity, created_at, updated_at")
      .single();

   if (error) {
      throw new Error("CART_INSERT_FAILED");
   }

   return data;
}