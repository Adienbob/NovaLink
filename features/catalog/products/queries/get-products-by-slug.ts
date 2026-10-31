import { supabaseAdmin } from "@/app/lib/supabase/server";
import { Product } from "../types/product";
import { Json } from "@/app/lib/supabase/database";
import { parseSpecs } from "../helpers/parse-specs";
import { parseKeyFeatures } from "../helpers/parse-key-features";

export async function getProductBySlug(slug: string): Promise<Product | null> {
   const { data, error } = await supabaseAdmin
      .from("products")
      .select(`
         id,
         name,
         slug,
         description,
         base_price,
         seo_title,
         key_features,
         specs,
         seo_description,
         created_at,
         brand:brands (
         id,
         name,
         slug,
         logo_url
         ),
         category:categories (
         id,
         name,
         slug,
         parent_id
         ),
         variants:product_variants!inner (
         id,
         sku,
         variant_name,
         attributes,
         base_price_usd,
         price,
         stock_quantity,
         is_active,
         product_id
         ),
         images:product_images!inner (
         id,
         variant_id,
         url,
         alt_text,
         sort_order,
         product_id
         )
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .eq("variants.is_active", true)
      .order("sort_order", {
         referencedTable: "product_images",
         ascending: true,
      })
      .maybeSingle();

      

      const product = data
         ? {
               ...data,
               key_features: parseKeyFeatures(data.key_features),
               specs: parseSpecs(data.specs),
            }
         : null;

   if (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
   }
   return product;
}

