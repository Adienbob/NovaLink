"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

interface FailDeliveryInput {
   deliveryId: string;
   reason: string;
   notes?: string;
   locale?: string;
}

export async function failDeliveryAction({
   deliveryId,
   reason,
   notes,
   locale = "ar",
}: FailDeliveryInput) {
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

      // 1. تحديث الشحنة إلى failed وتحديد السبب
      const { error: updateDeliveryError } = await supabaseAdmin
         .from("deliveries")
         .update({
         status: "failed",
         failure_reason: reason,
         notes: notes || null,
         updated_at: now,
         })
         .eq("id", deliveryId);

      if (updateDeliveryError) {
         return { success: false, error: "FAILED_TO_UPDATE_DELIVERY" };
      }

      // 2. تسجيل الحدث في delivery_events
      await supabaseAdmin.from("delivery_events").insert({
         delivery_id: delivery.id,
         order_id: delivery.order_id,
         actor_id: currentUser.id,
         event_type: "delivery_failed",
         notes: `Reason: ${reason}${notes ? ` - ${notes}` : ""}`,
      });

      revalidatePath(`/${locale}/delivery`);
      return { success: true };
   } catch (err: any) {
      console.error("failDeliveryAction error:", err);
      return { success: false, error: err?.message || "INTERNAL_ERROR" };
   }
}