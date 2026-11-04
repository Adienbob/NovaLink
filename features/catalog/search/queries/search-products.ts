"use server";

import { supabaseAdmin } from "@/app/lib/supabase/server";
import type { ProductCardTypes } from "@/features/catalog/products/types/product-card";
import { localizeName } from "../../products/helpers/localize-name";
import { Locale } from "@/app/lib/types/general-types";

const SEARCH_SELECT = `
   id, name_en, name_ar, slug,
   brand:brands ( name ),
   category:categories ( name ),
   variants:product_variants ( id, price, stock_quantity, is_active ),
   images:product_images ( url, alt_text, sort_order )
`;

export async function searchProducts(
   query: string,
   locale: Locale = "en"
): Promise<ProductCardTypes[]> {
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

   // 2) جيب بيانات الكروت
   const { data, error } = await supabaseAdmin
      .from("products")
      .select(SEARCH_SELECT)
      .in("id", ids)
      .eq("is_active", true);

   if (error) {
      throw new Error(`Failed to load products: ${error.message}`);
   }

   // 3) رجّع الترتيب الأصلي بتاع الـ RPC (الأقرب أولاً)
   const order = new Map(ids.map((id, index) => [id, index]));

   return (data ?? [])
      .map((p) => localizeName(p, locale))
      .map((p) => ({
         ...p,
         variants: p.variants.filter((v) => v.is_active),
         images: [...p.images].sort((a, b) => a.sort_order - b.sort_order),
      }))
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}