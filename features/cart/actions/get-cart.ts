"use server";

import { requireUser } from "@/app/lib/auth/require-user";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export async function getCart() {
   const user = await requireUser();

   const { data, error } = await supabaseAdmin
      .from("cart_items")
      .select(`
         id,
         product_variant_id,
         quantity,
         created_at,
         updated_at,
         variant:product_variants!inner (
         id,
         sku,
         variant_name,
         attributes,
         price,
         stock_quantity,
         is_active,
         product:products!inner (
            id,
            name,
            slug,
            is_active,
            brand:brands (
               name,
               slug
            ),
            images:product_images (
               url,
               alt_text,
               sort_order
            )
         )
         )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

   if (error) {
      console.error("Failed to fetch cart:", error);
      throw new Error("CART_FETCH_FAILED");
   }

   return data.map((item) => ({
      ...item,
      variant: {
         ...item.variant,
         product: {
         ...item.variant.product,
         images: [...item.variant.product.images].sort(
            (a, b) => a.sort_order - b.sort_order,
         ),
         },
      },
   }));
}