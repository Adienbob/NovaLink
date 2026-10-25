"use server";

import { supabaseAdmin } from "@/app/lib/supabase/server";

export async function getPublicProducts({
   page = 1,
   limit = 12,
   search,
   categoryId,
   brandId,
}: {
   page?: number;
   limit?: number;
   search?: string;
   categoryId?: string;
   brandId?: string;
} = {}) {
   const safeLimit = Math.min(Math.max(limit, 1), 48); // سقف أعلى للحماية
   const safePage = Math.max(page, 1);
   const offset = (safePage - 1) * safeLimit;

   let query = supabaseAdmin
      .from("products")
      .select(
         `
         id,
         name,
         slug,
         description,
         base_price,
         seo_title,
         seo_description,
         created_at,
         categories ( id, name ),
         brands ( id, name ),
         product_variants (
            id, sku, variant_name, price, base_price_usd,
            attributes, stock_quantity, is_active
         ),
         product_images ( id, url, alt_text, sort_order, variant_id )
      `,
         { count: "exact" }
      )
      .eq("is_active", true); // المنتجات المفعّلة فقط

   if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
   }

   if (brandId && brandId !== "all") {
      query = query.eq("brand_id", brandId);
   }

   if (search && search.trim() !== "") {
      // تنظيف الحروف الخاصة بـ ilike/or عشان متكسرش الـ pattern
      const term = search.trim().replace(/[%_,()]/g, "");
      if (term) query = query.ilike("name", `%${term}%`);
   }

   const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + safeLimit - 1);

   if (error) {
      console.error("Error fetching public products:", error);
      throw new Error("FAILED_TO_FETCH_PRODUCTS");
   }

   // إخفاء الـ variants المعطّلة من الواجهة العامة
   const products = (data ?? []).map((p) => ({
      ...p,
      product_variants: p.product_variants.filter((v) => v.is_active),
   }));

   return {
      products,
      totalCount: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / safeLimit),
      currentPage: safePage,
   };
}