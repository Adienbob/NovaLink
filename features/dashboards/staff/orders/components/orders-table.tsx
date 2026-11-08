"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { assignOrder, updateOrderStatus } from "../actions/orders-actions";

export type OrderStatus =
   | "pending_confirmation"
   | "confirmed"
   | "ready_for_pickup"
   | "shipped"
   | "delivered"
   | "cancelled"
   | "returned";

export interface DriverOption {
   id: string;
   full_name: string | null;
   email: string;
}

export interface OrderItem {
   id: string;
   status: OrderStatus;
   total: number;
   shipping_address: string;
   customer_name: string;
   customer_phone: string;
   customer_email: string;
   created_at: string;
}

interface OrdersTableProps {
   orders: OrderItem[];
   drivers?: DriverOption[];
   currentUserRole: "admin" | "owner" | "viewer";
   onRefresh: () => void;
}

export function OrdersTable({
   orders,
   drivers = [],
   currentUserRole,
   onRefresh,
}: OrdersTableProps) {
   const t = useTranslations("StaffOrders");
   const [isPending, startTransition] = useTransition();
   const [errorMsg, setErrorMsg] = useState<string | null>(null);
   const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
   const [selectedDriverId, setSelectedDriverId] = useState<string>("");

   const canManage = currentUserRole === "admin" || currentUserRole === "owner";

   const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
      { value: "pending_confirmation", label: t("statuses.pendingConfirmation") },
      { value: "confirmed", label: t("statuses.confirmed") },
      { value: "ready_for_pickup", label: t("statuses.readyForPickup") },
      { value: "shipped", label: t("statuses.shipped") },
      { value: "delivered", label: t("statuses.delivered") },
      { value: "returned", label: t("statuses.returned") },
      { value: "cancelled", label: t("statuses.cancelled") },
   ];

   const handleAssignDriver = (orderId: string) => {
      if (!selectedDriverId) return;

      setErrorMsg(null);
      startTransition(async () => {
         try {
            await assignOrder({
               orderId,
               driverId: selectedDriverId,
            });
            setAssigningOrderId(null);
            setSelectedDriverId("");
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || t("errors.assignDriver"));
         }
      });
   };

   const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
      setErrorMsg(null);
      startTransition(async () => {
         try {
            await updateOrderStatus(orderId, newStatus);
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || t("errors.updateStatus"));
         }
      });
   };

   const getBadgeColor = (status: OrderStatus) => {
      switch (status) {
         case "delivered":
            return "bg-green-100 text-green-800 border-green-200";
         case "shipped":
         case "ready_for_pickup":
         case "confirmed":
            return "bg-blue-100 text-blue-800 border-blue-200";
         case "returned":
            return "bg-purple-100 text-purple-800 border-purple-200";
         case "cancelled":
            return "bg-red-100 text-red-800 border-red-200";
         case "pending_confirmation":
         default:
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
      }
   };

   const getStatusLabel = (status: OrderStatus) => {
      switch (status) {
         case "pending_confirmation": return t("statuses.pendingConfirmation");
         case "confirmed": return t("statuses.confirmed");
         case "ready_for_pickup": return t("statuses.readyForPickup");
         case "shipped": return t("statuses.shipped");
         case "delivered": return t("statuses.delivered");
         case "returned": return t("statuses.returned");
         case "cancelled": return t("statuses.cancelled");
         default: return status
      }
   };

   return (
      <div className="space-y-4">
         {errorMsg && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
               {errorMsg}
            </div>
         )}

         <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
               <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                     <th className="px-4 py-3">{t("tableHeaderOrderNumber")}</th>
                     <th className="px-4 py-3">{t("tableHeaderCustomer")}</th>
                     <th className="px-4 py-3">{t("tableHeaderShippingAddress")}</th>
                     <th className="px-4 py-3">{t("tableHeaderTotalAmount")}</th>
                     <th className="px-4 py-3">{t("tableHeaderStatus")}</th>
                     <th className="px-4 py-3 text-right">{t("tableHeaderActions")}</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {orders.length === 0 ? (
                     <tr>
                        <td
                           colSpan={6}
                           className="px-4 py-8 text-center text-muted-foreground"
                        >
                           {t("noActiveOrders")}
                        </td>
                     </tr>
                  ) : (
                     orders.map((order) => {
                        const isAssigningThis = assigningOrderId === order.id;

                        return (
                           <tr key={order.id} className="hover:bg-muted/30">
                              <td className="px-4 py-3 font-mono font-bold text-xs uppercase">
                                 #{order.id.slice(0, 8)}
                              </td>

                              <td className="px-4 py-3">
                                 <div className="font-medium text-xs">
                                    {order.customer_name}
                                 </div>
                                 <div className="text-[11px] text-muted-foreground">
                                    {order.customer_phone}
                                 </div>
                              </td>

                              <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                                 {order.shipping_address}
                              </td>

                              <td className="px-4 py-3 font-mono text-xs">
                                 ${order.total.toFixed(2)}
                              </td>
                              
                              <td className="px-4 py-3">
                                 <span
                                    className={`inline-flex text-center items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getBadgeColor(
                                       order.status
                                    )}`}
                                 >
                                    {getStatusLabel(order.status)}
                                 </span>
                              </td>

                              <td className="px-4 py-3 text-right">
                                 {canManage ? (
                                    <div className="flex items-center justify-end gap-2">
                                       {isAssigningThis ? (
                                          <div className="flex items-center gap-1.5">
                                             <select
                                                value={selectedDriverId}
                                                onChange={(e) =>
                                                   setSelectedDriverId(e.target.value)
                                                }
                                                className="rounded border bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
                                             >
                                                <option value="">
                                                   {drivers.length === 0
                                                      ? t("noDriversAvailable")
                                                      : t("selectDriver")}
                                                </option>
                                                {drivers.map((d) => (
                                                   <option key={d.id} value={d.id}>
                                                      {d.full_name || d.email}
                                                   </option>
                                                ))}
                                             </select>
                                             <button
                                                disabled={isPending || !selectedDriverId}
                                                onClick={() => handleAssignDriver(order.id)}
                                                className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground disabled:opacity-50"
                                             >
                                                {t("confirm")}
                                             </button>
                                             <button
                                                onClick={() => setAssigningOrderId(null)}
                                                className="text-xs text-muted-foreground hover:underline"
                                             >
                                                {t("cancel")}
                                             </button>
                                          </div>
                                       ) : (
                                          <>
                                             <button
                                                disabled={isPending}
                                                onClick={() => {
                                                   setAssigningOrderId(order.id);
                                                   setSelectedDriverId("");
                                                }}
                                                className="text-xs font-medium text-primary hover:underline"
                                             >
                                                {t("assignDriver")}
                                             </button>
                                             <span className="text-muted-foreground">|</span>
                                             <select
                                                disabled={isPending}
                                                value={order.status}
                                                onChange={(e) =>
                                                   handleStatusChange(
                                                      order.id,
                                                      e.target.value as OrderStatus
                                                   )
                                                }
                                                className="rounded border bg-background px-1.5 py-0.5 text-xs outline-none focus:ring-1 focus:ring-ring"
                                             >
                                                {ORDER_STATUS_OPTIONS.map((opt) => (
                                                   <option key={opt.value} value={opt.value}>
                                                      {opt.label}
                                                   </option>
                                                ))}
                                             </select>
                                          </>
                                       )}
                                    </div>
                                 ) : (
                                    <span className="text-xs text-muted-foreground italic">
                                       {t("readOnly")}
                                    </span>
                                 )}
                              </td>
                           </tr>
                        );
                     })
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}