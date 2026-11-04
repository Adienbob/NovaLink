"use server";

import { supabaseAdmin } from "@/app/lib/supabase/server";
import { Locale } from "@/app/lib/types/general-types";
import { localizeProduct } from "@/features/catalog/products/helpers/localize-product";

export async function getGuestCartDetails(
   variantIds: string[],
   locale: Locale
) {
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
      `)
      .in("id", uniqueVariantIds)
      .eq("is_active", true)
      .eq("product.is_active", true);

   if (error) {
      console.error("Failed to fetch guest cart details:", error);
      throw new Error("GUEST_CART_DETAILS_FETCH_FAILED");
   }

   return data.map((variant) => {
      const localizedProduct = localizeProduct(variant.product, locale);

      return {
         ...variant,
         product: {
         ...localizedProduct,
         images: [...variant.product.images].sort(
            (a, b) => a.sort_order - b.sort_order
         ),
         },
      };
   });
}