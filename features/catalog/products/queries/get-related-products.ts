"use server"

import { supabaseAdmin } from "@/app/lib/supabase/server";
import type { QueryData } from "@supabase/supabase-js";
import { parseSpecs } from "../helpers/parse-specs";
import { parseKeyFeatures } from "../helpers/parse-key-features";
import { Product } from "../types/product";


const RELATED_SELECT = `
   id, 
   name, 
   slug, 
   description, 
   base_price,
   seo_title, 
   seo_description, 
   key_features,
   specs,
   created_at,
   brand:brands ( id, name, slug, logo_url ),
   category:categories ( id, name, slug, parent_id ),
   variants:product_variants (
      id, product_id, sku, variant_name, price,
      base_price_usd, attributes, stock_quantity, is_active
   ),
   images:product_images (
      id, product_id, variant_id, url, alt_text, sort_order
   )
`;



const relatedQuery = supabaseAdmin.from("products").select(RELATED_SELECT);
type RelatedProduct = QueryData<typeof relatedQuery>[number];


// منتج صالح = فيه variant مفعّل ومخزونه أكبر من صفر
const filterValidStock = (list: Product[] | null): Product[] =>
   (list ?? []).filter((p) =>
      p.variants?.some((v) => v.is_active && v.stock_quantity > 0)
   );

export async function getRelatedProducts({
   currentProductId,
   categoryId,
   brandId,
   limit = 4,
}: {
   currentProductId: string;
   categoryId: string;
   brandId?: string;
   limit?: number;
}): Promise<Product[]> {
   let validBrandMatches: Product[] = [];

   // 1. Primary: same category & same brand
   if (brandId) {
      const { data, error } = await supabaseAdmin
         .from("products")
         .select(RELATED_SELECT)
         .eq("category_id", categoryId)
         .eq("brand_id", brandId)
         .eq("is_active", true)
         .neq("id", currentProductId);

      if (error) console.error("Related (brand) query failed:", error);

      validBrandMatches = filterValidStock(
         (data ?? []).map((product) => ({
            ...product,
            key_features: parseKeyFeatures(product.key_features),
            specs: parseSpecs(product.specs),
         }))
      );
      if (validBrandMatches.length >= limit) {
         return validBrandMatches.slice(0, limit);
      }
   }

   // 2. Fallback: same category (other brands) if we need more items
   const existingIds = [
      currentProductId,
      ...validBrandMatches.map((p) => p.id),
   ];

   let categoryQuery = supabaseAdmin
      .from("products")
      .select(RELATED_SELECT)
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .not("id", "in", `(${existingIds.join(",")})`);

   if (brandId) {
      categoryQuery = categoryQuery.neq("brand_id", brandId);
   }

   const { data, error } = await categoryQuery;

   const products: Product[] = (data ?? []).map((product) => ({
      ...product,
      key_features: parseKeyFeatures(product.key_features),
      specs: parseSpecs(product.specs),
   }));

   if (error) console.error("Related (category) query failed:", error);

   return [...validBrandMatches, ...filterValidStock(products)].slice(0, limit);
}