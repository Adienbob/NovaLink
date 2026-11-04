// actions/create-product.ts
"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import {
   productCreateSchema,
   type ProductCreateValues,
} from "../schema/product-schemas";
import { requireRole } from "@/app/lib/auth/require-role";
import { mapProductDbError } from "../helpers/map-db-error";
import { toVariantRow } from "../helpers/to-variant-row";
import { generateSlug } from "./generate-slug";

export async function createProduct(payload: ProductCreateValues) {
   const staffUser = await requireRole(["admin", "owner"]);

   const parsed = productCreateSchema.safeParse(payload);
   if (!parsed.success) throw new Error("INVALID_PRODUCT_DATA");

   const p = parsed.data;


   const { variants, images, ...product } = parsed.data;
   const slug = generateSlug(product.slug || product.name_en);

   const { data: productId, error } = await supabaseAdmin.rpc(
      "create_product_with_variants",
      {
         p_product: {
            name_en: p.name_en,
            name_ar: p.name_ar,
            slug,
            description_en: p.description_en,
            description_ar: p.description_ar,
            brand_id: p.brand_id ?? null,
            category_id: p.category_id ?? null,
            base_price: p.base_price,
            seo_title_en: p.seo_title_en ?? null,
            seo_title_ar: p.seo_title_ar ?? null,
            seo_description_en: p.seo_description_en ?? null,
            seo_description_ar: p.seo_description_ar ?? null,
            is_active: p.is_active,
         },
         p_variants: p.variants.map(toVariantRow),
         p_images: p.images.map((img, idx) => ({
            url: img.url,
            alt_text: img.alt_text || null,
            sort_order: idx,
         })),
      }
   );

   if (error || !productId) {
      throw mapProductDbError(error, "FAILED_TO_CREATE_PRODUCT");
   }

   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "CREATE_PRODUCT",
      entity_type: "product",
      entity_id: productId,
      metadata: { name: product.name_en, slug },
   });

   revalidatePath("/", "layout"); 
   return { id: productId, slug };
}
