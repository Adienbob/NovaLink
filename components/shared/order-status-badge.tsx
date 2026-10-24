import * as React from "react";
import { Badge } from "@/components/ui/badge";

export type OrderStatus =
   | "pending_confirmation"
   | "confirmed"
   | "ready_for_pickup"
   | "shipped"
   | "delivered"
   | "cancelled";

interface OrderStatusBadgeProps {
   status: OrderStatus;
   label?: string; // Localized text from next-intl (optional override)
   className?: string;
}

export function OrderStatusBadge({ status, label, className }: OrderStatusBadgeProps) {
   // Map database enum statuses directly to design token variants
   const variantMap: Record<OrderStatus, "default" | "secondary" | "warning" | "success" | "destructive" | "outline"> = {
      pending_confirmation: "warning",
      confirmed: "default",
      ready_for_pickup: "secondary",
      shipped: "default",
      delivered: "success",
      cancelled: "destructive",
   };

   // Fallback English labels if localized string is omitted
   const defaultLabels: Record<OrderStatus, string> = {
      pending_confirmation: "Pending Confirmation",
      confirmed: "Confirmed",
      ready_for_pickup: "Ready for Pickup",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
   };

   return (
      <Badge variant={variantMap[status] ?? "outline"} className={className}>
         {label || defaultLabels[status] || status}
      </Badge>
   );
}