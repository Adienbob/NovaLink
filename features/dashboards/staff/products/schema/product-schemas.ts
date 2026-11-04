import { z } from "zod";
import { variantSchema } from "./variant-schema";
import { imageSchema } from "./images-shema";
import { productSchema } from "@/features/catalog/products/schema/product-schema";
const uniqueSkus = (variants: { sku: string }[]) => {
   const skus = variants.map((v) => v.sku.toLowerCase());
   return new Set(skus).size === skus.length;
};

// 1) منتج + variants + صور
export const productCreateSchema = productSchema.extend({
   variants: z
      .array(variantSchema)
      .min(1, "Add at least one variant")
      .refine(uniqueSkus, { message: "Duplicate SKU in this product" }),
   images: z.array(imageSchema).min(1, "Add at least one image"),
});

// 2) variant لمنتج موجود (+ صور اختيارية)
export const addVariantSchema = z.object({
   productId: z.string().uuid(),
   variant: variantSchema,
   images: z.array(imageSchema).default([]),
});

// 3) صور لمنتج، أو لـ variant معين فيه
export const addImagesSchema = z.object({
   productId: z.string().uuid(),
   variantId: z.string().uuid().nullable().default(null),
   images: z.array(imageSchema).min(1, "Add at least one image"),
});

export type ProductCreateValues = z.infer<typeof productCreateSchema>;
export type AddVariantValues = z.infer<typeof addVariantSchema>;
export type AddImagesValues = z.infer<typeof addImagesSchema>;