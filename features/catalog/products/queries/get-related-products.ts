"use server";

import { supabaseAdmin } from "@/app/lib/supabase/server";
import { localizeName } from "../helpers/localize-name";
import { ProductCardTypes } from "../types/product-card";
import { Locale } from "@/app/lib/types/general-types";

const RELATED_SELECT = `
   id, name_en, name_ar, slug,
   brand:brands ( name ),
   category:categories ( name ),
   variants:product_variants ( id, price, stock_quantity, is_active ),
   images:product_images ( url, alt_text, sort_order )
`;
const hasValidStock = (p: { variants: { is_active: boolean; stock_quantity: number }[] }) =>
  p.variants.some((v) => v.is_active && v.stock_quantity > 0);

export async function getRelatedProducts({
   currentProductId,
   categoryId,
   brandId,
   locale,   
   limit = 4,
}: {
   currentProductId: string;
   categoryId: string;
   brandId?: string;
   locale: Locale;
   limit?: number;
}) {
   let brandMatches: ProductCardTypes[] = [];  

  if (brandId) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select(RELATED_SELECT)
      .eq("category_id", categoryId)
      .eq("brand_id", brandId)
      .eq("is_active", true)
      .neq("id", currentProductId)
      .limit(limit * 3); 

    if (error) console.error("Related (brand) query failed:", error);

    brandMatches = (data ?? [])
      .filter(hasValidStock)
      .map((p) => localizeName(p, locale));

    if (brandMatches.length >= limit) return brandMatches.slice(0, limit);
  }

  const existingIds = [currentProductId, ...brandMatches.map((p) => p.id)];

  let query = supabaseAdmin
    .from("products")
    .select(RELATED_SELECT)
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .not("id", "in", `(${existingIds.join(",")})`)
    .limit(limit * 3);

  if (brandId) query = query.neq("brand_id", brandId);

  const { data, error } = await query;
  if (error) console.error("Related (category) query failed:", error);

  const rest = (data ?? []).filter(hasValidStock).map((p) => localizeName(p, locale));

  return [...brandMatches, ...rest].slice(0, limit);
}