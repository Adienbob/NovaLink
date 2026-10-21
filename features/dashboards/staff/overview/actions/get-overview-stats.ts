"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export interface OverviewStats {
   totalOrders: number;
   deliveredOrders: number;
   failedDeliveries: number;
   totalRevenue: number;
   lowStockCount: number;
   pendingReturnsCount: number;
}

export async function getOverviewStats(): Promise<OverviewStats> {
   // 1. Backend Role Verification using your requireRole function
   await requireRole(["admin", "owner", "viewer"]);

   // 2. Parallelized aggregate & table queries using supabaseAdmin
   const [
      ordersRes,
      deliveredRes,
      failedDeliveriesRes,
      revenueRes,
      lowStockRes,
      pendingReturnsRes,
   ] = await Promise.all([
      // Total Orders count
      supabaseAdmin
         .from("orders")
         .select("id", { count: "exact", head: true }),

      // Delivered Orders count
      supabaseAdmin
         .from("orders")
         .select("id", { count: "exact", head: true })
         .eq("status", "delivered"),

      // Failed Deliveries count
      supabaseAdmin
         .from("deliveries")
         .select("id", { count: "exact", head: true })
         .eq("status", "failed"),

      // Total Revenue sum from delivered orders
      supabaseAdmin
         .from("orders")
         .select("total")
         .eq("status", "delivered"),

      // Low Stock items count (variants with quantity <= 5)
      supabaseAdmin
         .from("product_variants")
         .select("id", { count: "exact", head: true })
         .lte("stock_quantity", 5),

      // Pending Returns count
      supabaseAdmin
         .from("returns")
         .select("id", { count: "exact", head: true })
         .eq("status", "pending"),
   ]);

   if (
      ordersRes.error ||
      deliveredRes.error ||
      failedDeliveriesRes.error ||
      revenueRes.error ||
      lowStockRes.error ||
      pendingReturnsRes.error
   ) {
      console.error("Error fetching overview stats:", {
         ordersError: ordersRes.error,
         deliveredError: deliveredRes.error,
         failedError: failedDeliveriesRes.error,
         revenueError: revenueRes.error,
         lowStockError: lowStockRes.error,
         returnsError: pendingReturnsRes.error,
      });
   }

   const totalRevenue =
      revenueRes.data?.reduce(
         (acc, order) => acc + (Number(order.total) || 0),
         0
      ) || 0;

   return {
      totalOrders: ordersRes.count || 0,
      deliveredOrders: deliveredRes.count || 0,
      failedDeliveries: failedDeliveriesRes.count || 0,
      totalRevenue,
      lowStockCount: lowStockRes.count || 0,
      pendingReturnsCount: pendingReturnsRes.count || 0,
   };
}