"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { DeliveryItem, isDeliveryStatus } from "../types/delivery";


export async function getDriverDeliveries(): Promise<DeliveryItem[]> {
   // 1. Enforce authentication and role permissions
   const currentUser = await requireRole(["delivery", "admin", "owner"]);

   // 2. Fetch all delivery records assigned to the current driver along with order details and user/address info
   const { data: deliveries, error } = await supabaseAdmin
      .from("deliveries")
      .select(`
         id,
         order_id,
         driver_id,
         status,
         failure_reason,
         notes,
         assigned_at,
         picked_up_at,
         completed_at,
         created_at,
         orders (
         id,
         total,
         payment_method,
         status,
         shipping_fee,
         delivery_address_snapshot,
         notes,
         users (
            full_name,
            phone,
            email
         )
         )
      `)
      .eq("driver_id", currentUser.id)
      .in("status", ["assigned", "picked_up", "delivered", "failed"])
      .order("created_at", { ascending: false });

   if (error) {
      console.error("Error fetching driver deliveries:", error);
      return [];
   }

   return (deliveries ?? []).flatMap((d) =>
      isDeliveryStatus(d.status) ? [{ ...d, status: d.status }] : []
   );
}