"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { Locale } from "@/app/lib/types/general-types";
import { localizeName } from "@/features/catalog/products/helpers/localize-name";
import { localizeProduct } from "@/features/catalog/products/helpers/localize-product";
import { generateSlug } from "./generate-slug";

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
   name_en: string;
   name_ar: string;
   description_en: string;
   description_ar: string;
   brand_id?: string | null;
   category_id?: string | null;
   base_price: number;
   seo_title_en?: string | null;
   seo_title_ar?: string | null;
   seo_description_en?: string | null;
   seo_description_ar?: string | null;
   is_active?: boolean;
   variants?: VariantPayload[];
   images?: { url: string; alt_text?: string; sort_order?: number }[];
}

export async function getProducts({
   page = 1,
   limit = 10,
   search,
   categoryId,
   brandId,
   locale,
}: {
   page?: number;
   limit?: number;
   search?: string;
   categoryId?: string;
   brandId?: string;
   locale: Locale;
} ) {
   await requireRole(["admin", "owner", "viewer"]);

   const offset = (page - 1) * limit;

   let query = supabaseAdmin
      .from("products")
      .select(
         `
         id,
         name_en,
         name_ar,
         slug,
         description_en,
         description_ar,
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
      query = query.or(
      `name_en.ilike.%${search.trim()}%,name_ar.ilike.%${search.trim()}%`
      );   
   }

   query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

   const { data, count, error } = await query;

   const products = data?.map(product => localizeProduct(product, locale))

   if (error) {
      console.error("Error fetching products:", error);
      throw new Error("FAILED_TO_FETCH_PRODUCTS");
   }

   return {
      products: products || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
   };
}

export async function createProduct(payload: ProductPayload) {
   const staffUser = await requireRole(["admin", "owner"]);

   const slug = generateSlug(payload.name_en);

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
         name_en: payload.name_en.trim(),
         name_ar: payload.name_ar.trim(),
         slug,
         description_en: payload.description_en,
         description_ar: payload.description_ar,
         brand_id: payload.brand_id || null,
         category_id: payload.category_id || null,
         base_price: payload.base_price,
         seo_title_en: payload.seo_title_en || null,
         seo_title_ar: payload.seo_title_ar || null,
         seo_description_en: payload.seo_description_en || null,
         seo_description_ar: payload.seo_description_ar || null,
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
      metadata: { name: product.name_en , slug: product.slug },
   });

   return product;
}

export async function updateProduct(productId: string, payload: ProductPayload) {
   const staffUser = await requireRole(["admin", "owner"]);

   // 1. Generate / validate slug
   const slug = generateSlug(payload.name_en);

   // Check slug uniqueness (exclude current product)
   const { data: existing } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("slug", slug)
      .neq("id", productId)
      .maybeSingle();

   if (existing) {
      throw new Error("PRODUCT_SLUG_EXISTS");
   }

   // 2. Update core product
   const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .update({
         name_en: payload.name_en.trim(),
         name_ar: payload.name_ar.trim(),
         slug,
         description_en: payload.description_en,
         description_ar: payload.description_ar,
         brand_id: payload.brand_id || null,
         category_id: payload.category_id || null,
         base_price: payload.base_price,
         seo_title_en: payload.seo_title_en || null,
         seo_title_ar: payload.seo_title_ar || null,
         seo_description_en: payload.seo_description_en || null,
         seo_description_ar: payload.seo_description_ar || null,
         is_active: payload.is_active ?? true,
         updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .select()
      .single();

   if (productError || !product) {
      console.error("Error updating product:", productError);
      throw new Error("FAILED_TO_UPDATE_PRODUCT");
   }

   // 3. Handle images – replace strategy
   if (payload.images !== undefined) {
      // First delete all existing images for this product
      const { error: deleteError } = await supabaseAdmin
         .from("product_images")
         .delete()
         .eq("product_id", productId);

      if (deleteError) {
         console.error("Error deleting old product images:", deleteError);
         throw new Error("FAILED_TO_UPDATE_IMAGES");
      }

      // Then insert the new list (if any)
      if (payload.images.length > 0) {
         const imageInserts = payload.images.map((img, idx) => ({
            product_id: productId,
            url: img.url.trim(),
            alt_text: img.alt_text || null,
            sort_order: img.sort_order ?? idx,
         }));

         const { error: imageError } = await supabaseAdmin
            .from("product_images")
            .insert(imageInserts);

         if (imageError) {
            console.error("Error inserting product images:", imageError);
            throw new Error("FAILED_TO_UPDATE_IMAGES");
         }
      }
   }

   // 4. Activity log
   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "UPDATE_PRODUCT",
      entity_type: "product",
      entity_id: product.id,
      metadata: { name: product.name_en, slug: product.slug },
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