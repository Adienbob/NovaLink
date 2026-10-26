// features/storefront/actions/search-products.ts
"use server";

import { supabaseAdmin } from "@/app/lib/supabase/server";

const PRODUCT_SELECT = `
   id,
   name,
   slug,
   description,
   base_price,
   seo_title,
   seo_description,
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
` as const;

export async function searchProducts(query: string) {
   const normalizedQuery = query.trim();
   if (normalizedQuery.length < 2) return [];

   // 1) الـ fuzzy search بيحدد الـ ids والترتيب
   const { data: matches, error: rpcError } = await supabaseAdmin.rpc(
      "search_products_fuzzy",
      { search_query: normalizedQuery }
   );

   if (rpcError) {
      throw new Error(`Failed to search products: ${rpcError.message}`);
   }

   const ids = (matches ?? []).map((m) => m.id);
   if (ids.length === 0) return [];

   // 2) جيب الداتا الكاملة بنفس شكل Product
   const { data, error } = await supabaseAdmin
      .from("products")
      .select(PRODUCT_SELECT)
      .in("id", ids)
      .eq("is_active", true);

   if (error) {
      throw new Error(`Failed to load products: ${error.message}`);
   }

   // 3) رجّع الترتيب الأصلي بتاع الـ RPC (الأقرب أولاً)
   const order = new Map(ids.map((id, index) => [id, index]));

   return (data ?? [])
      .map((p) => ({
         ...p,
         variants: p.variants.filter((v) => v.is_active),
         images: [...p.images].sort((a, b) => a.sort_order - b.sort_order),
      }))
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}