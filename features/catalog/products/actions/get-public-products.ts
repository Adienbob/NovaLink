"use server";

import { supabaseAdmin } from "@/app/lib/supabase/server";
import type { ProductCardTypes } from "@/features/catalog/products/types/product-card";
import { localizeName } from "../helpers/localize-name";

const LIST_SELECT = `
   id, name_en, name_ar, slug,
   category:categories ( name ),
   brand:brands ( name ),
   variants:product_variants ( id, price, stock_quantity, is_active ),
   images:product_images ( url, alt_text, sort_order )
`;

export async function getPublicProducts({ page = 1, limit = 12, search, categoryId, brandId, locale,
}: {
   page?: number;
   limit?: number;
   search?: string;
   categoryId?: string;
   brandId?: string;
   locale: "ar" | "en";
}) {
   const safeLimit = Math.min(Math.max(limit, 1), 48);
   const safePage = Math.max(page, 1);
   const offset = (safePage - 1) * safeLimit;

   let query = supabaseAdmin
      .from("products")
      .select(LIST_SELECT, { count: "exact" })
      .eq("is_active", true);

   if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
   }

   if (brandId && brandId !== "all") {
      query = query.eq("brand_id", brandId);
   }

   if (search && search.trim() !== "") {
      const term = search.trim().replace(/[%_,()]/g, "");
      if (term) {
         query = query.or(`name_en.ilike.%${term}%,name_ar.ilike.%${term}%`);
      }
   }

   const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + safeLimit - 1);

   if (error) {
      console.error("Error fetching public products:", error);
      throw new Error("FAILED_TO_FETCH_PRODUCTS");
   }

   const products: ProductCardTypes[] = (data ?? []).map((p) =>
      localizeName(p, locale)
   );

   return {
      data: products,
      totalCount: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / safeLimit),
      currentPage: safePage,
   };
}