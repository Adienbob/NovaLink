"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export type OrderStatus =
   | "pending_confirmation"
   | "confirmed"
   | "ready_for_pickup"
   | "shipped"
   | "delivered"
   | "cancelled"
   | "returned";

export interface AssignOrderPayload {
   orderId: string;
   driverId: string;
}

export interface GetOrdersFilters {
   page?: number;
   limit?: number;
   status?: OrderStatus;
}

/**
 * Fetches paginated staff orders
 */
export async function getStaffOrders({ page = 1, limit = 20, status }: GetOrdersFilters = {}) {
   await requireRole(["admin", "owner", "delivery", "viewer"]);

   const offset = (page - 1) * limit;

   let query = supabaseAdmin
      .from("orders")
      .select(
         `
         id,
         status,
         total,
         subtotal,
         shipping_fee,
         delivery_address_snapshot,
         payment_method,
         notes,
         created_at,
         user_id,
         users:user_id (
            id,
            full_name,
            email,
            phone
         )
      `,
         { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

   if (status) {
      query = query.eq("status", status);
   }

   const { data, count, error } = await query;

   if (error) {
      console.error("Error fetching staff orders:", error);
      throw new Error("FAILED_TO_FETCH_STAFF_ORDERS");
   }

   // Format data to flatten nested user & snapshot fields for UI consumption
   const formattedOrders = (data || []).map((order: any) => {
      const addressSnapshot = order.delivery_address_snapshot || {};
      const customer = order.users || {};

      const formattedAddress = typeof addressSnapshot === "string" 
         ? addressSnapshot 
         : [
              addressSnapshot.street,
              addressSnapshot.city,
              addressSnapshot.state,
              addressSnapshot.building
           ].filter(Boolean).join(", ") || "No address provided";

      return {
         id: order.id,
         status: order.status as OrderStatus,
         total: Number(order.total || 0),
         subtotal: Number(order.subtotal || 0),
         shipping_fee: Number(order.shipping_fee || 0),
         payment_method: order.payment_method,
         shipping_address: formattedAddress,
         customer_name: customer.full_name || addressSnapshot.recipient_name || "Guest Customer",
         customer_phone: customer.phone || addressSnapshot.phone || "N/A",
         customer_email: customer.email || "N/A",
         created_at: order.created_at,
      };
   });

   return {
      orders: formattedOrders,
      totalCount: count || 0,
   };
}

/**
 * Fetches staff users with delivery role for driver dropdown
 */
export async function getAvailableDrivers() {
   await requireRole(["admin", "owner"]);

   const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, full_name, email")
      .eq("role", "delivery")
      .order("full_name", { ascending: true });

   if (error) {
      console.error("Error fetching available drivers:", error);
      throw new Error("FAILED_TO_FETCH_DRIVERS");
   }

   return data || [];
}

/**
 * Assigns a driver to an order and transitions order status to ready_for_pickup
 */
export async function assignOrder({ orderId, driverId }: AssignOrderPayload) {
   const staffUser = await requireRole(["admin", "owner"]);



   // 1. Create delivery dispatch record
   const { data: delivery, error: deliveryErr } = await supabaseAdmin
      .from("deliveries")
      .insert({
         order_id: orderId,
         driver_id: driverId,
         assigned_by: staffUser.id,
         status: "assigned",
         assigned_at: new Date().toISOString(),
      })
      .select()
      .single();

   if (deliveryErr) {
      console.error("Error creating delivery record:", deliveryErr);
      throw new Error("FAILED_TO_ASSIGN_ORDER");
   }

   // 2. Sync parent order status to valid schema enum ('ready_for_pickup')
   const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .update({
         status: "ready_for_pickup" as OrderStatus,
         updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("status", "confirmed")
      .select()
      .single();

   if (orderErr) {
      console.error("Error updating order status:", orderErr);
      throw new Error("FAILED_TO_UPDATE_ORDER_STATUS");
   }

   // 3. Centralized Audit Log
   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "ASSIGN_ORDER_DRIVER",
      entity_type: "order",
      entity_id: orderId,
      metadata: {
         driver_id: driverId,
         delivery_id: delivery.id,
         assigned_by: staffUser.id,
      },
   });

   return { delivery, order };
}

/**
 * Updates order status with strict type safety matching DB constraint
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
   const staffUser = await requireRole(["admin", "owner"]);

   const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
         status,
         updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

   if (error) {
      console.error("Error updating order status:", error);
      throw new Error("FAILED_TO_UPDATE_ORDER");
   }

   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "UPDATE_ORDER_STATUS",
      entity_type: "order",
      entity_id: orderId,
      metadata: { new_status: status },
   });

   return data;
}