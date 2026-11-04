// actions/add-images.ts
"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { addImagesSchema, type AddImagesValues } from "../schema/product-schemas";
import { requireRole } from "@/app/lib/auth/require-role";

export async function addImages(payload: AddImagesValues) {
   const staffUser = await requireRole(["admin", "owner"]);

   const parsed = addImagesSchema.safeParse(payload);
   if (!parsed.success) throw new Error("INVALID_IMAGES_DATA");

   const { productId, variantId, images } = parsed.data;

   const { data: product } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("id", productId)
      .maybeSingle();
   if (!product) throw new Error("PRODUCT_NOT_FOUND");

   // الـ variant لازم يتبع نفس المنتج
   if (variantId) {
      const { data: variant } = await supabaseAdmin
         .from("product_variants")
         .select("id")
         .eq("id", variantId)
         .eq("product_id", productId)
         .maybeSingle();
      if (!variant) throw new Error("VARIANT_NOT_FOUND");
   }

   // الصور الجديدة بتتضاف بعد آخر ترتيب موجود
   const { data: last } = await supabaseAdmin
      .from("product_images")
      .select("sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

   const start = (last?.sort_order ?? -1) + 1;

   const { error } = await supabaseAdmin.from("product_images").insert(
      images.map((img, idx) => ({
         product_id: productId,
         variant_id: variantId,
         url: img.url,
         alt_text: img.alt_text || null,
         sort_order: start + idx,
      }))
   );

   if (error) {
      console.error("Error adding images:", error);
      throw new Error("FAILED_TO_ADD_IMAGES");
   }

   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "ADD_PRODUCT_IMAGES",
      entity_type: "product",
      entity_id: productId,
      metadata: { variant_id: variantId, count: images.length },
   });

   revalidatePath("/", "layout");
}