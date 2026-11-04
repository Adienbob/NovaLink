// features/catalog/products/schema/product-schema.ts
import { z } from "zod";

export const productSchema = z.object({
   // Required bilingual content
   name_en: z
      .string()
      .min(1, "English product name is required")
      .max(200, "English name is too long"),
   name_ar: z
      .string()
      .min(1, "Arabic product name is required")
      .max(200, "Arabic name is too long"),

   slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
         /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
         "Slug must be lowercase letters, numbers and hyphens only"
      ),

   description_en: z
      .string()
      .min(1, "English description is required"),
   description_ar: z
      .string()
      .min(1, "Arabic description is required"),

   // Relations
   brand_id: z.string().uuid().nullable().optional(),
   category_id: z.string().uuid().nullable().optional(),

   // Price
   base_price: z
      .number({ error: "Price must be a number" })
      .positive("Price must be greater than 0"),

   // Optional SEO
   seo_title_en: z.string().max(70).nullable().optional(),
   seo_title_ar: z.string().max(70).nullable().optional(),
   seo_description_en: z.string().max(160).nullable().optional(),
   seo_description_ar: z.string().max(160).nullable().optional(),

   // Other
   is_active: z.boolean().default(true),
   specs_en: z.array(z.object({ key: z.string(), value: z.string() })).default([]),   
   specs_ar: z.array(z.object({ key: z.string(), value: z.string() })).default([]),   
   key_features_ar: z.array(z.unknown()).nullable().optional(),
   key_features_en: z.array(z.unknown()).nullable().optional(),
});

export const variantSchema = z.object({
   sku: z.string().trim().min(1, "SKU is required"),
   variant_name: z.string().trim().min(1, "Variant name is required"),
   attributes: z.record(z.string(), z.string()),
   base_price_usd: z.number().nonnegative().nullable(),
   price: z.number().positive("Price must be greater than 0"),
   stock_quantity: z.number().int().min(0, "Stock can't be negative"),
   is_active: z.boolean(),
});

export const imageSchema = z.object({
   url: z.string().url("Invalid image URL"),
   alt_text: z.string().nullable(),
   sort_order: z.number().int(),
});

export const productCreateSchema = productSchema.extend({
   variants: z.array(variantSchema).min(1, "Add at least one variant"),
   images: z.array(imageSchema).min(1, "Add at least one image"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductCreateValues = z.infer<typeof productCreateSchema>;