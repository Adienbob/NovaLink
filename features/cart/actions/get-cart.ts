"use server";

import { requireUser } from "@/app/lib/auth/require-user";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { Locale } from "@/app/lib/types/general-types";
import { localizeProduct } from "@/features/catalog/products/helpers/localize-product";

export async function getCart(locale: Locale) {
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
            name_en,
            name_ar,
            slug,
            description_en,
            description_ar,
            seo_title_en,
            seo_title_ar,
            seo_description_en,
            seo_description_ar,
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

   return data.map((item) => {
      const localizedProduct = localizeProduct(item.variant.product, locale);

      return {
         ...item,
         variant: {
         ...item.variant,
         product: {
            ...localizedProduct,
            images: [...item.variant.product.images].sort(
               (a, b) => a.sort_order - b.sort_order
            ),
         },
         },
      };
   });
}