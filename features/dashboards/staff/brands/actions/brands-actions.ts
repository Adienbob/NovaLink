"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export interface BrandPayload {
   name: string;
   logo_url?: string | null;
}

function generateSlug(text: string): string {
   return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
}

export async function getBrands() {
   // 1. Role Check - Read access for admin, owner, viewer
   await requireRole(["admin", "owner", "viewer"]);

   const { data, error } = await supabaseAdmin
      .from("brands")
      .select("id, name, slug, logo_url")
      .order("name", { ascending: true });

   if (error) {
      console.error("Error fetching brands:", error);
      throw new Error("FAILED_TO_FETCH_BRANDS");
   }

   return data || [];
}

export async function createBrand(payload: BrandPayload) {
   // 1. Role Check - ONLY Admin & Owner can create
   const staffUser = await requireRole(["admin", "owner"]);

   const slug = generateSlug(payload.name);

   // Check if slug exists
   const { data: existing } = await supabaseAdmin
      .from("brands")
      .select("id")
      .eq("slug", slug)
      .single();

   if (existing) {
      throw new Error("BRAND_SLUG_EXISTS");
   }

   // 2. Insert Brand
   const { data, error } = await supabaseAdmin
      .from("brands")
      .insert({
         name: payload.name.trim(),
         slug,
         logo_url: payload.logo_url?.trim() || null,
      })
      .select()
      .single();

   if (error) {
      console.error("Error creating brand:", error);
      throw new Error("FAILED_TO_CREATE_BRAND");
   }

   // 3. Centralized Activity Log Entry
   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "CREATE_BRAND",
      entity_type: "brand",
      entity_id: data.id,
      metadata: { name: data.name, slug: data.slug },
   });

   return data;
}

export async function deleteBrand(brandId: string) {
   // 1. Role Check - ONLY Admin & Owner can delete
   const staffUser = await requireRole(["admin", "owner"]);

   const { error } = await supabaseAdmin
      .from("brands")
      .delete()
      .eq("id", brandId);

   if (error) {
      console.error("Error deleting brand:", error);
      throw new Error("FAILED_TO_DELETE_BRAND");
   }

   // 2. Centralized Activity Log Entry
   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "DELETE_BRAND",
      entity_type: "brand",
      entity_id: brandId,
      metadata: {},
   });

   return true;
}