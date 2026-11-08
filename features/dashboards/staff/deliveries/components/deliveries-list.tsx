"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
   DeliveryStatus,
   updateDeliveryStatus,
} from "../actions/deliveries-actions";

export interface DriverItem {
   id: string;
   full_name: string | null;
   email: string;
   phone: string | null;
}

export interface DeliveryRecordItem {
   id: string;
   order_id: string;
   driver_id: string;
   assigned_by: string;
   status: DeliveryStatus;
   failure_reason: string | null;
   notes: string | null;
   assigned_at: string;
   picked_up_at: string | null;
   completed_at: string | null;
   created_at: string;
   driver: { id: string; full_name: string | null; email: string; phone: string | null } | null;
   assigned_by_user: { id: string; full_name: string | null } | null;
   orders: {
      id: string;
      order_number: string;
      status: string;
      total_amount: number;
      shipping_address: string;
      customer_name: string;
      customer_phone: string;
   } | null;
}

interface DeliveriesListProps {
   deliveries: DeliveryRecordItem[];
   drivers: DriverItem[];
   currentUserRole: "admin" | "owner" | "delivery" | "viewer";
   currentUserId: string;
   onRefresh: () => void;
}

export function DeliveriesList({
   deliveries,
   drivers,
   currentUserRole,
   currentUserId,
   onRefresh,
}: DeliveriesListProps) {
   const t = useTranslations("StaffDeliveries");
   const [isPending, startTransition] = useTransition();
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   const [activeFailureId, setActiveFailureId] = useState<string | null>(null);
   const [failureReasonInput, setFailureReasonInput] = useState("");
   const [noteInput, setNoteInput] = useState("");

   const canManage = currentUserRole === "admin" || currentUserRole === "owner";

   const handleStatusUpdate = (
      deliveryId: string,
      newStatus: DeliveryStatus,
      options?: { failureReason?: string; notes?: string }
   ) => {
      setErrorMsg(null);
      startTransition(async () => {
         try {
            await updateDeliveryStatus(deliveryId, newStatus, options);
            setActiveFailureId(null);
            setFailureReasonInput("");
            setNoteInput("");
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || t("errors.updateStatus"));
         }
      });
   };

   return (
      <div className="space-y-4">
         {errorMsg && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
               {errorMsg}
            </div>
         )}

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deliveries.length === 0 ? (
               <div className="col-span-full rounded-lg border bg-card p-8 text-center text-muted-foreground">
                  {t("noDeliveries")}
               </div>
            ) : (
               deliveries.map((item) => {
                  const isAssignedToMe = item.driver_id === currentUserId;
                  const canUpdate =
                     canManage || (currentUserRole === "delivery" && isAssignedToMe);

                  return (
                     <div
                        key={item.id}
                        className="rounded-lg border bg-card p-5 shadow-sm flex flex-col justify-between space-y-4"
                     >
                        <div className="space-y-2">
                           <div className="flex items-center justify-between">
                              <span className="font-mono text-sm font-bold">
                                 #{item.orders?.order_number || t("orderFallback")}
                              </span>
                              <span
                                 className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    item.status === "delivered"
                                       ? "bg-green-100 text-green-800"
                                       : item.status === "picked_up"
                                       ? "bg-blue-100 text-blue-800"
                                       : item.status === "failed" || item.status === "cancelled"
                                       ? "bg-red-100 text-red-800"
                                       : "bg-yellow-100 text-yellow-800"
                                 }`}
                              >
                                 {item.status.replace(/_/g, " ")}
                              </span>
                           </div>

                           <div className="text-xs space-y-1 text-muted-foreground">
                              <div>
                                 <strong className="text-foreground">{t("driverLabel")}</strong>{" "}
                                 {item.driver?.full_name || item.driver?.email || t("unassigned")}
                              </div>
                              <div>
                                 <strong className="text-foreground">{t("customerLabel")}</strong>{" "}
                                 {item.orders?.customer_name} ({item.orders?.customer_phone})
                              </div>
                              <div>
                                 <strong className="text-foreground">{t("addressLabel")}</strong>{" "}
                                 {item.orders?.shipping_address}
                              </div>
                              {item.failure_reason && (
                                 <div className="rounded bg-destructive/10 p-2 text-destructive text-[11px] font-medium">
                                    {t("failureReasonLabel")} {item.failure_reason}
                                 </div>
                              )}
                              {item.notes && (
                                 <div className="rounded bg-muted p-2 italic text-[11px]">
                                    {t("notesLabel")} {item.notes}
                                 </div>
                              )}
                           </div>
                        </div>

                        {canUpdate && item.status !== "delivered" && item.status !== "cancelled" && (
                           <div className="space-y-2 pt-3 border-t">
                              <div className="flex flex-wrap gap-1.5">
                                 {item.status === "assigned" && (
                                    <button
                                       disabled={isPending}
                                       onClick={() =>
                                          handleStatusUpdate(item.id, "picked_up")
                                       }
                                       className="rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                       {t("markPickedUp")}
                                    </button>
                                 )}

                                 {item.status === "picked_up" && (
                                    <button
                                       disabled={isPending}
                                       onClick={() =>
                                          handleStatusUpdate(item.id, "delivered")
                                       }
                                       className="rounded bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                       {t("markDelivered")}
                                    </button>
                                 )}

                                 <button
                                    disabled={isPending}
                                    onClick={() =>
                                       setActiveFailureId(
                                          activeFailureId === item.id ? null : item.id
                                       )
                                    }
                                    className="rounded bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                                 >
                                    {t("markFailed")}
                                 </button>
                              </div>

                              {activeFailureId === item.id && (
                                 <div className="space-y-2 pt-2">
                                    <input
                                       type="text"
                                       required
                                       value={failureReasonInput}
                                       onChange={(e) =>
                                          setFailureReasonInput(e.target.value)
                                       }
                                       placeholder={t("failureReasonPlaceholder")}
                                       className="w-full rounded border bg-background p-2 text-xs outline-none"
                                    />
                                    <textarea
                                       value={noteInput}
                                       onChange={(e) => setNoteInput(e.target.value)}
                                       placeholder={t("notesPlaceholder")}
                                       className="w-full rounded border bg-background p-2 text-xs outline-none"
                                       rows={2}
                                    />
                                    <button
                                       disabled={isPending || !failureReasonInput.trim()}
                                       onClick={() =>
                                          handleStatusUpdate(item.id, "failed", {
                                             failureReason: failureReasonInput,
                                             notes: noteInput,
                                          })
                                       }
                                       className="w-full rounded bg-destructive py-1 text-xs font-medium text-destructive-foreground disabled:opacity-50"
                                    >
                                       {t("confirmFailure")}
                                    </button>
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  );
               })
            )}
         </div>
      </div>
   );
}