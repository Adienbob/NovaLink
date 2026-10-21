"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export type DeliveryStatus =
   | "assigned"
   | "picked_up"
   | "delivered"
   | "failed"
   | "cancelled";

export type OrderStatus =
   | "pending_confirmation"
   | "confirmed"
   | "ready_for_pickup"
   | "shipped"
   | "delivered"
   | "cancelled"
   | "returned";

interface DeliveryUpdatePayload {
   status: DeliveryStatus;
   updated_at: string;
   notes?: string | null;
   picked_up_at?: string | null;
   completed_at?: string | null;
   failure_reason?: string | null;
}

export async function getAvailableDrivers() {
   await requireRole(["admin", "owner", "delivery", "viewer"]);

   const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, full_name, email, phone")
      .eq("role", "delivery")
      .order("full_name", { ascending: true });

   if (error) {
      console.error("Error fetching drivers:", error);
      throw new Error("FAILED_TO_FETCH_DRIVERS");
   }

   return data || [];
}

export async function getDeliveries({
   status,
   driverId,
}: {
   status?: DeliveryStatus | "all";
   driverId?: string;
} = {}) {
   const currentUser = await requireRole(["admin", "owner", "delivery", "viewer"]);

   let query = supabaseAdmin
      .from("deliveries")
      .select(
         `
         id,
         order_id,
         driver_id,
         assigned_by,
         status,
         failure_reason,
         notes,
         assigned_at,
         picked_up_at,
         completed_at,
         created_at,
         updated_at,
         driver:users!deliveries_driver_id_fkey ( id, full_name, email, phone ),
         assigned_by_user:users!deliveries_assigned_by_fkey ( id, full_name ),
         orders (
            id,
            status,
            total,
            subtotal,
            shipping_fee,
            delivery_address_snapshot,
            created_at,
            user_id,
            users:user_id ( id, full_name, email, phone )
         )
      `
      )
      .order("created_at", { ascending: false });

   if (currentUser.role === "delivery") {
      query = query.eq("driver_id", currentUser.id);
   } else if (driverId && driverId !== "all") {
      query = query.eq("driver_id", driverId);
   }

   if (status && status !== "all") {
      query = query.eq("status", status);
   }

   const { data, error } = await query;

   if (error) {
      console.error("Error fetching deliveries:", error);
      throw new Error("FAILED_TO_FETCH_DELIVERIES");
   }

   return data || [];
}

export async function assignDeliveryDriver(orderId: string, driverId: string) {
   const staffUser = await requireRole(["admin", "owner"]);

   const { data, error } = await supabaseAdmin
      .from("deliveries")
      .insert({
         order_id: orderId,
         driver_id: driverId,
         assigned_by: staffUser.id,
         status: "assigned",
         assigned_at: new Date().toISOString(),
      } as any)
      .select()
      .single();

   if (error) {
      console.error("Error assigning delivery driver:", error);
      throw new Error("FAILED_TO_ASSIGN_DRIVER");
   }

   // Sync order status to 'ready_for_pickup' (valid enum under CHECK constraint)
   await supabaseAdmin
      .from("orders")
      .update({ status: "ready_for_pickup" as OrderStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId);

   // Audit Log Entry
   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "ASSIGN_DELIVERY_DRIVER",
      entity_type: "delivery",
      entity_id: data.id,
      metadata: {
         order_id: orderId,
         driver_id: driverId,
         assigned_by: staffUser.id,
      },
   } as any);

   return data;
}

export async function updateDeliveryStatus(
   deliveryId: string,
   newStatus: DeliveryStatus,
   options?: { failureReason?: string; notes?: string }
) {
   const staffUser = await requireRole(["admin", "owner", "delivery"]);
   const now = new Date().toISOString();

   const updatePayload: DeliveryUpdatePayload = {
      status: newStatus,
      updated_at: now,
   };

   if (options?.notes !== undefined) {
      updatePayload.notes = options.notes.trim() || null;
   }

   if (newStatus === "picked_up") {
      updatePayload.picked_up_at = now;
   } else if (newStatus === "delivered") {
      updatePayload.completed_at = now;
   } else if (newStatus === "failed") {
      updatePayload.failure_reason = options?.failureReason || null;
   }

   const { data: updatedDelivery, error } = await supabaseAdmin
      .from("deliveries")
      .update(updatePayload as any)
      .eq("id", deliveryId)
      .select("*, orders(id)")
      .single();

   if (error || !updatedDelivery) {
      console.error("Error updating delivery status:", error);
      throw new Error("FAILED_TO_UPDATE_DELIVERY_STATUS");
   }

   // Synchronize parent order status upon status progression using strict DB enums
   if (newStatus === "delivered" && updatedDelivery.orders?.id) {
      await supabaseAdmin
         .from("orders")
         .update({ status: "delivered" as OrderStatus, updated_at: now })
         .eq("id", updatedDelivery.orders.id);
   } else if (newStatus === "picked_up" && updatedDelivery.orders?.id) {
      await supabaseAdmin
         .from("orders")
         .update({ status: "shipped" as OrderStatus, updated_at: now })
         .eq("id", updatedDelivery.orders.id);
   }

   // Audit Log
   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "UPDATE_DELIVERY_STATUS",
      entity_type: "delivery",
      entity_id: deliveryId,
      metadata: {
         new_status: newStatus,
         failure_reason: options?.failureReason,
         notes: options?.notes,
      },
   } as any);

   return updatedDelivery;
}