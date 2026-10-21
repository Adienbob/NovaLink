"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export interface CategoryPayload {
   name: string;
   parent_id?: string | null;
}

function generateSlug(text: string): string {
   return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
}

export async function getCategories() {
   // Read access allowed for all staff roles
   await requireRole(["admin", "owner", "viewer"]);

      const { data, error } = await supabaseAdmin
      .from("categories")
      .select(`
         id,
         name,
         slug,
         parent_id,
         parent:categories!parent_id(id, name, slug)
      `)
      .order("name", { ascending: true });
            
      if (error) {
         console.log(error)
         console.error("Error fetching categories:", error);
      throw new Error("FAILED_TO_FETCH_CATEGORIES");
   }

   return data || [];
}

export async function createCategory(payload: CategoryPayload) {
   // ONLY Admin & Owner can create categories
   const staffUser = await requireRole(["admin", "owner"]);

   const slug = generateSlug(payload.name);

   // Check if slug exists
   const { data: existing } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single();

   if (existing) {
      throw new Error("CATEGORY_SLUG_EXISTS");
   }

   const { data, error } = await supabaseAdmin
      .from("categories")
      .insert({
         name: payload.name,
         slug,
         parent_id: payload.parent_id || null,
      })
      .select()
      .single();

   if (error) {
      console.error("Error creating category:", error);
      throw new Error("FAILED_TO_CREATE_CATEGORY");
   }

   // Activity Log matching user_id schema
   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "CREATE_CATEGORY",
      entity_type: "category",
      entity_id: data.id,
      metadata: { name: data.name, slug: data.slug, parent_id: data.parent_id },
   });

   return data;
}

export async function deleteCategory(categoryId: string) {
   // ONLY Admin & Owner can delete categories
   const staffUser = await requireRole(["admin", "owner"]);

   const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", categoryId);

   if (error) {
      console.error("Error deleting category:", error);
      throw new Error("FAILED_TO_DELETE_CATEGORY");
   }

   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "DELETE_CATEGORY",
      entity_type: "category",
      entity_id: categoryId,
      metadata: {},
   });

   return true;
}