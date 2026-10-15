// The role of this file is to GET all the products related to the choosen category

import { supabaseAdmin } from "@/app/lib/supabase/server";
import type { Product } from "@/features/catalog/products/types/product";

export async function getProductsByCategory(
   categorySlug: string,
): Promise<Product[]> {

   const { data: category, error: categoryError } = await supabaseAdmin
   .from("categories")
   .select("id, slug, name")
   .eq("slug", categorySlug)
   .maybeSingle();

if (categoryError || !category) {
   return [];
}


   const { data, error } = await supabaseAdmin
      .from("products")
      .select(`
         id,
         name,
         slug,
         description,
         base_price,
         seo_title,
         seo_description,
         created_at,
         brand:brands (
            id,
            name,
            slug,
            logo_url
         ),
         category:categories!products_category_id_fkey (
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
         images:product_images (
            id,
            variant_id,
            url,
            alt_text,
            sort_order,
            product_id
         )
      `)
      .eq("category_id", category.id)
      .eq("is_active", true)
      .eq("variants.is_active", true)
      .order("sort_order", {
         referencedTable: "product_images",
         ascending: true,
      });

   if (error) {
      throw new Error(
         `Failed to fetch category products: ${error.message}`,
      );
   }

   return (data ?? []) as unknown as Product[];
}