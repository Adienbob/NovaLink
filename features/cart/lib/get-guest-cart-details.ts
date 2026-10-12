"use server";

import { supabaseAdmin } from "@/app/lib/supabase/server";

export async function getGuestCartDetails(variantIds: string[]) {
   if (variantIds.length === 0) {
      return [];
   }

   const uniqueVariantIds = [...new Set(variantIds)];

   const { data, error } = await supabaseAdmin
      .from("product_variants")
      .select(`
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
      `)
      .in("id", uniqueVariantIds)
      .eq("is_active", true)
      .eq("product.is_active", true);

   if (error) {
      console.error("Failed to fetch guest cart details:", error);
      throw new Error("GUEST_CART_DETAILS_FETCH_FAILED");
   }

   return data.map((variant) => ({
      ...variant,
      product: {
         ...variant.product,
         images: [...variant.product.images].sort(
            (a, b) => a.sort_order - b.sort_order,
         ),
      },
   }));
}
