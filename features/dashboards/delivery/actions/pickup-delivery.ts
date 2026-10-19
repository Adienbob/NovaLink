"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/app/lib/auth/require-role"; // اضبط مسار الاستيراد حسب مشروعك
import { supabaseAdmin } from "@/app/lib/supabase/server";

interface PickUpDeliveryInput {
   deliveryId: string;
   notes?: string;
   locale?: string;
}

export async function pickUpDeliveryAction({
   deliveryId,
   notes,
   locale = "ar",
}: PickUpDeliveryInput) {
   try {
      // 1. التحقق من أن منفذ العملية موظف توصيل أو مسؤول
      const currentUser = await requireRole(["delivery", "admin", "owner"]);

      // 2. جلب الشحنة والتأكد من وجودها ومن أن المندوب هو المسند إليه (إذا كان دور المستخدم delivery)
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

      if (delivery.status !== "assigned") {
         return { success: false, error: "INVALID_DELIVERY_STATUS" };
      }

      const now = new Date().toISOString();

      // 3. تحديث حالة الشحنة في جدول deliveries
      const { error: updateDeliveryError } = await supabaseAdmin
         .from("deliveries")
         .update({
         status: "picked_up",
         picked_up_at: now,
         updated_at: now,
         })
         .eq("id", deliveryId);

      if (updateDeliveryError) {
         console.error("Error updating delivery status:", updateDeliveryError);
         return { success: false, error: "FAILED_TO_UPDATE_DELIVERY" };
      }

      // 4. تحديث حالة الطلب التجاري إلى shipped في جدول orders
      const { error: updateOrderError } = await supabaseAdmin
         .from("orders")
         .update({
         status: "shipped",
         updated_at: now,
         })
         .eq("id", delivery.order_id);

      if (updateOrderError) {
         console.error("Error updating order status to shipped:", updateOrderError);
         return { success: false, error: "FAILED_TO_UPDATE_ORDER" };
      }

      // 5. تسجيل الحدث في جدول delivery_events
      const { error: eventError } = await supabaseAdmin
         .from("delivery_events")
         .insert({
         delivery_id: delivery.id,
         order_id: delivery.order_id,
         actor_id: currentUser.id,
         event_type: "picked_up",
         notes: notes || "Order picked up from warehouse",
         });

      if (eventError) {
         console.error("Error inserting delivery event:", eventError);
      }

      // 6. تحديث كاش الصفحات المعنية
      revalidatePath(`/${locale}/delivery`);

      return { success: true };
   } catch (err: any) {
      console.error("pickUpDeliveryAction error:", err);
      return { success: false, error: err?.message || "INTERNAL_ERROR" };
   }
}