"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export interface VariantPayload {
   sku: string;
   variant_name: string;
   attributes?: Record<string, any>;
   base_price_usd?: number | null;
   price: number;
   stock_quantity: number;
   is_active?: boolean;
}

export interface ProductPayload {
   name: string;
   description: string;
   brand_id?: string | null;
   category_id?: string | null;
   base_price: number;
   seo_title?: string | null;
   seo_description?: string | null;
   is_active?: boolean;
   variants?: VariantPayload[];
   images?: { url: string; alt_text?: string; sort_order?: number }[];
}

function generateSlug(text: string): string {
   return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
}

export async function getProducts({
   page = 1,
   limit = 10,
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
   await requireRole(["admin", "owner", "viewer"]);

   const offset = (page - 1) * limit;

   let query = supabaseAdmin
      .from("products")
      .select(
         `
         id,
         name,
         slug,
         description,
         base_price,
         is_active,
         created_at,
         categories ( id, name ),
         brands ( id, name ),
         product_variants ( id, sku, variant_name, price, stock_quantity, is_active ),
         product_images ( id, url, alt_text, sort_order )
      `,
         { count: "exact" }
      );

   if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
   }

   if (brandId && brandId !== "all") {
      query = query.eq("brand_id", brandId);
   }

   if (search && search.trim() !== "") {
      query = query.ilike("name", `%${search.trim()}%`);
   }

   query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

   const { data, count, error } = await query;

   if (error) {
      console.error("Error fetching products:", error);
      throw new Error("FAILED_TO_FETCH_PRODUCTS");
   }

   return {
      products: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
   };
}

export async function createProduct(payload: ProductPayload) {
   const staffUser = await requireRole(["admin", "owner"]);

   const slug = generateSlug(payload.name);

   // Check slug collision
   const { data: existing } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single();

   if (existing) {
      throw new Error("PRODUCT_SLUG_EXISTS");
   }

   // 1. Insert Core Product
   const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .insert({
         name: payload.name.trim(),
         slug,
         description: payload.description,
         brand_id: payload.brand_id || null,
         category_id: payload.category_id || null,
         base_price: payload.base_price,
         seo_title: payload.seo_title || null,
         seo_description: payload.seo_description || null,
         is_active: payload.is_active ?? true,
      })
      .select()
      .single();

   if (productError || !product) {
      console.error("Error creating product:", productError);
      throw new Error("FAILED_TO_CREATE_PRODUCT");
   }

   // 2. Insert Variants if provided
   if (payload.variants && payload.variants.length > 0) {
      const variantInserts = payload.variants.map((v) => ({
         product_id: product.id,
         sku: v.sku.trim(),
         variant_name: v.variant_name.trim(),
         attributes: v.attributes || {},
         base_price_usd: v.base_price_usd ?? null,
         price: v.price,
         stock_quantity: v.stock_quantity,
         is_active: v.is_active ?? true,
      }));

      const { error: variantError } = await supabaseAdmin
         .from("product_variants")
         .insert(variantInserts);

      if (variantError) {
         console.error("Error creating product variants:", variantError);
         throw new Error("FAILED_TO_CREATE_VARIANTS");
      }
   }

   // 3. Insert Images if provided
   if (payload.images && payload.images.length > 0) {
      const imageInserts = payload.images.map((img, idx) => ({
         product_id: product.id,
         url: img.url.trim(),
         alt_text: img.alt_text || null,
         sort_order: img.sort_order ?? idx,
      }));

      const { error: imageError } = await supabaseAdmin
         .from("product_images")
         .insert(imageInserts);

      if (imageError) {
         console.error("Error inserting product images:", imageError);
      }
   }

   // 4. Activity Log Entry
   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "CREATE_PRODUCT",
      entity_type: "product",
      entity_id: product.id,
      metadata: { name: product.name, slug: product.slug },
   });

   return product;
}

export async function deleteProduct(productId: string) {
   const staffUser = await requireRole(["admin", "owner"]);

   const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId);

   if (error) {
      console.error("Error deleting product:", error);
      throw new Error("FAILED_TO_DELETE_PRODUCT");
   }

   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "DELETE_PRODUCT",
      entity_type: "product",
      entity_id: productId,
      metadata: {},
   });

   return true;
}