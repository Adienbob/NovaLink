"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

interface CompleteDeliveryInput {
   deliveryId: string;
   notes?: string;
   locale?: string;
}

export async function completeDeliveryAction({
   deliveryId,
   notes,
   locale = "ar",
}: CompleteDeliveryInput) {
   try {
      const currentUser = await requireRole(["delivery", "admin", "owner"]);

      const { data: delivery, error: fetchError } = await supabaseAdmin
         .from("deliveries")
         .select("id, order_id, driver_id, status")
         .eq("id", deliveryId)
         .single();

      if (fetchError || !delivery) {
         return { success: false, error: "DELIVERY_NOT_FOUND" };
      }

      if (currentUser.role === "delivery" && delivery.driver_id !== currentUser.id) {
         return { success: false, error: "UNAUTHORIZED_DELIVERY_ACCESS" };
      }

      if (delivery.status !== "picked_up") {
         return { success: false, error: "INVALID_DELIVERY_STATUS" };
      }

      const now = new Date().toISOString();

      // 1. تحديث حالة الشحنة إلى delivered
      const { error: updateDeliveryError } = await supabaseAdmin
         .from("deliveries")
         .update({
         status: "delivered",
         completed_at: now,
         updated_at: now,
         notes: notes || null,
         })
         .eq("id", deliveryId);

      if (updateDeliveryError) {
         return { success: false, error: "FAILED_TO_UPDATE_DELIVERY" };
      }

      // 2. تحديث حالة الطلب التجاري إلى delivered
      const { error: updateOrderError } = await supabaseAdmin
         .from("orders")
         .update({
         status: "delivered",
         updated_at: now,
         })
         .eq("id", delivery.order_id);

      if (updateOrderError) {
         return { success: false, error: "FAILED_TO_UPDATE_ORDER" };
      }

      // 3. إضافة الحدث في delivery_events
      await supabaseAdmin.from("delivery_events").insert({
         delivery_id: delivery.id,
         order_id: delivery.order_id,
         actor_id: currentUser.id,
         event_type: "delivered",
         notes: notes || "Order successfully delivered",
      });

      revalidatePath(`/${locale}/delivery`);
      return { success: true };
   } catch (err: any) {
      console.error("completeDeliveryAction error:", err);
      return { success: false, error: err?.message || "INTERNAL_ERROR" };
   }
}