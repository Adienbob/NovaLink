import { z } from "zod";

export const attributeSchema = z.object({
   key: z.string().trim(),
   value: z.string().trim(),
});

export const variantSchema = z.object({
   sku: z.string().trim().min(1, "SKU is required"),
   variant_name: z.string().trim().min(1, "Variant name is required"),
   attributes: z
      .array(attributeSchema)
      .refine(
         (attrs) => {
         const keys = attrs.map((a) => a.key.toLowerCase()).filter(Boolean);
         return new Set(keys).size === keys.length;
         },
         { message: "Attribute names must be unique" }
      ),
   base_price_usd: z.number().nonnegative().nullable(),
   price: z.number().positive("Price must be greater than 0"),
   stock_quantity: z.number().int().min(0, "Stock can't be negative"),
});

export type VariantValues = z.infer<typeof variantSchema>;