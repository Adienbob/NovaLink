import { z } from "zod";

export const productSearchSchema = z
   .object({
      q: z
         .string()
         .trim()
         .max(100, "Search query must not exceed 100 characters")
         .optional()
         .default(""),

      category: z.string().trim().optional(),

      brand: z.string().trim().optional(),

      minPrice: z.coerce
         .number()
         .finite()
         .min(0, "Minimum price cannot be negative")
         .optional(),

      maxPrice: z.coerce
         .number()
         .finite()
         .min(0, "Maximum price cannot be negative")
         .optional(),

      sort: z
         .enum(["relevance", "price_asc", "price_desc", "newest"])
         .default("relevance"),

      page: z.coerce
         .number()
         .int()
         .min(1)
         .max(10000)
         .default(1),
   })
   .refine(
      (data) =>
         data.minPrice === undefined ||
         data.maxPrice === undefined ||
         data.minPrice <= data.maxPrice,
      {
         message: "Minimum price cannot exceed maximum price",
         path: ["minPrice"],
      },
   );

export type ProductSearchParams = z.infer<typeof productSearchSchema>;