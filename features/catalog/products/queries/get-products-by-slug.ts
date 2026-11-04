import { supabaseAdmin } from "@/app/lib/supabase/server";
import { Product } from "../types/product";
import { localizeProduct } from "../helpers/localize-product";
import { Locale } from "@/app/lib/types/general-types";

export async function getProductBySlug(slug: string, locale: Locale): Promise<Product | null> {
   const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
         id,
         name_ar,
         name_en,
         slug,
         description_en,
         description_ar,
         base_price,
         seo_title_ar,
         seo_title_en,
         key_features_ar,
         key_features_en,
         specs_ar,
         specs_en,
         seo_description_en,
         seo_description_ar,
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
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('variants.is_active', true)
      .order('sort_order', {
         referencedTable: 'product_images',
         ascending: true,
      })
      .maybeSingle();

   if (error || !data) return null;

   return localizeProduct(data, locale);
}