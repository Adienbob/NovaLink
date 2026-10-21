"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export type AdjustmentReason =
   | "RESTOCK"
   | "DAMAGE"
   | "SHRINKAGE"
   | "AUDIT_CORRECTION"
   | "RETURN";

export interface AdjustStockPayload {
   variantId: string;
   changeQuantity: number; // positive to add stock, negative to reduce
   reason: AdjustmentReason;
   notes?: string;
}

export async function getInventoryVariants(searchQuery?: string) {
   await requireRole(["admin", "owner", "viewer", "delivery"]);

   let query = supabaseAdmin
      .from("product_variants")
      .select(
         `
         id,
         product_id,
         sku,
         variant_name,
         attributes,
         price,
         stock_quantity,
         is_active,
         products (
            id,
            name,
            slug,
            category_id,
            brand_id
         )
      `
      )
      .order("stock_quantity", { ascending: true });

   if (searchQuery && searchQuery.trim() !== "") {
      const term = `%${searchQuery.trim()}%`;
      query = query.or(`sku.ilike.${term},variant_name.ilike.${term}`);
   }

   const { data, error } = await query;

   if (error) {
      console.error("Error fetching inventory variants:", error);
      throw new Error("FAILED_TO_FETCH_INVENTORY");
   }

   return data || [];
}

export async function getInventoryLogs(variantId?: string) {
   await requireRole(["admin", "owner", "viewer", "delivery"]);

   let query = supabaseAdmin
      .from("inventory_logs")
      .select(
         `
         id,
         variant_id,
         user_id,
         change_quantity,
         previous_stock,
         new_stock,
         reason,
         notes,
         created_at,
         user:users!inventory_logs_user_id_fkey ( id, full_name, email ),
         variant:product_variants!inventory_logs_variant_id_fkey ( id, sku, variant_name )
      `
      )
      .order("created_at", { ascending: false })
      .limit(50);

   if (variantId) {
      query = query.eq("variant_id", variantId);
   }

   const { data, error } = await query;

   if (error) {
      console.error("Error fetching inventory logs:", error);
      throw new Error("FAILED_TO_FETCH_INVENTORY_LOGS");
   }

   return data || [];
}

export async function adjustStock(payload: AdjustStockPayload) {
   const staffUser = await requireRole(["admin", "owner"]);

   // 1. Fetch current stock
   const { data: variant, error: fetchErr } = await supabaseAdmin
      .from("product_variants")
      .select("id, stock_quantity, sku")
      .eq("id", payload.variantId)
      .single();

   if (fetchErr || !variant) {
      throw new Error("VARIANT_NOT_FOUND");
   }

   const previousStock = variant.stock_quantity;
   const newStock = previousStock + payload.changeQuantity;

   if (newStock < 0) {
      throw new Error("INSUFFICIENT_STOCK_QUANTITY");
   }

   // 2. Update stock quantity in product_variants
   const { data: updatedVariant, error: updateErr } = await supabaseAdmin
      .from("product_variants")
      .update({ stock_quantity: newStock })
      .eq("id", payload.variantId)
      .select()
      .single();

   if (updateErr) {
      console.error("Error updating variant stock:", updateErr);
      throw new Error("FAILED_TO_UPDATE_STOCK");
   }

   // 3. Insert immutable log into inventory_logs table
   const { error: logErr } = await supabaseAdmin.from("inventory_logs").insert({
      variant_id: payload.variantId,
      user_id: staffUser.id,
      change_quantity: payload.changeQuantity,
      previous_stock: previousStock,
      new_stock: newStock,
      reason: payload.reason,
      notes: payload.notes?.trim() || null,
   });

   if (logErr) {
      console.error("Error inserting inventory log:", logErr);
   }

   // 4. Record entry in system activity_logs
   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "ADJUST_STOCK",
      entity_type: "product_variant",
      entity_id: payload.variantId,
      metadata: {
         sku: variant.sku,
         change_quantity: payload.changeQuantity,
         previous_stock: previousStock,
         new_stock: newStock,
         reason: payload.reason,
      },
   });

   return updatedVariant;
}