// actions/add-variant.ts
"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { addVariantSchema, type AddVariantValues } from "../schema/product-schemas";
import { requireRole } from "@/app/lib/auth/require-role";
import { toVariantRow } from "../helpers/to-variant-row";
import { mapProductDbError } from "../helpers/map-db-error";

export async function addVariant(payload: AddVariantValues) {
   const staffUser = await requireRole(["admin", "owner"]);

   const parsed = addVariantSchema.safeParse(payload);
   if (!parsed.success) throw new Error("INVALID_VARIANT_DATA");

   const { productId, variant, images } = parsed.data;

   const { data: variantId, error } = await supabaseAdmin.rpc(
      "add_variant_with_images",
      {
         p_product_id: productId,
         p_variant: toVariantRow(variant),
         p_images: images.map((img, idx) => ({
            url: img.url,
            alt_text: img.alt_text || null,
            sort_order: idx, 
         })),
      }
   );

   if (error || !variantId) {
      throw mapProductDbError(error, "FAILED_TO_ADD_VARIANT");
   }

   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "ADD_VARIANT",
      entity_type: "product_variant",
      entity_id: variantId,
      metadata: { product_id: productId, sku: variant.sku },
   });

   revalidatePath("/", "layout");
   return { id: variantId };
}