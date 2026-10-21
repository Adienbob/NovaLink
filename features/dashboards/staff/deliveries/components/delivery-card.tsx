"use client";

import { useState } from "react";
import { DeliveryStatus } from "../actions/deliveries-actions";

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

interface DeliveryCardProps {
   item: DeliveryRecordItem;
   currentUserId: string;
   currentUserRole: "admin" | "owner" | "delivery" | "viewer";
   isPending: boolean;
   onStatusUpdate: (
      deliveryId: string,
      newStatus: DeliveryStatus,
      options?: { failureReason?: string; notes?: string }
   ) => void;
}

export function DeliveryCard({
   item,
   currentUserId,
   currentUserRole,
   isPending,
   onStatusUpdate,
}: DeliveryCardProps) {
   const [showFailureForm, setShowFailureForm] = useState(false);
   const [failureReasonInput, setFailureReasonInput] = useState("");
   const [noteInput, setNoteInput] = useState("");

   const canManage = currentUserRole === "admin" || currentUserRole === "owner";
   const isAssignedToMe = item.driver_id === currentUserId;
   const canUpdate =
      canManage || (currentUserRole === "delivery" && isAssignedToMe);

   const handleConfirmFailure = () => {
      if (!failureReasonInput.trim()) return;
      onStatusUpdate(item.id, "failed", {
         failureReason: failureReasonInput.trim(),
         notes: noteInput.trim() || undefined,
      });
      setShowFailureForm(false);
      setFailureReasonInput("");
      setNoteInput("");
   };

   return (
      <div className="rounded-lg border bg-card p-5 shadow-sm flex flex-col justify-between space-y-4">
         <div className="space-y-2">
            <div className="flex items-center justify-between">
               <span className="font-mono text-sm font-bold">
                  #{item.orders?.order_number || "ORDER"}
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

            <div className="text-xs space-y-1.5 text-muted-foreground">
               <div>
                  <strong className="text-foreground">Driver:</strong>{" "}
                  {item.driver?.full_name || item.driver?.email || "Unassigned"}
               </div>
               <div>
                  <strong className="text-foreground">Customer:</strong>{" "}
                  {item.orders?.customer_name} ({item.orders?.customer_phone})
               </div>
               <div>
                  <strong className="text-foreground">Address:</strong>{" "}
                  {item.orders?.shipping_address}
               </div>
               <div>
                  <strong className="text-foreground">Total:</strong> $
                  {Number(item.orders?.total_amount || 0).toFixed(2)}
               </div>

               {item.failure_reason && (
                  <div className="mt-2 rounded bg-destructive/10 p-2 text-destructive text-[11px] font-medium">
                     <strong>Failure Reason:</strong> {item.failure_reason}
                  </div>
               )}
               {item.notes && (
                  <div className="mt-1 rounded bg-muted p-2 italic text-[11px]">
                     <strong>Notes:</strong> {item.notes}
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
                        onClick={() => onStatusUpdate(item.id, "picked_up")}
                        className="rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                     >
                        Mark Picked Up
                     </button>
                  )}

                  {item.status === "picked_up" && (
                     <button
                        disabled={isPending}
                        onClick={() => onStatusUpdate(item.id, "delivered")}
                        className="rounded bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                     >
                        Mark Delivered
                     </button>
                  )}

                  <button
                     disabled={isPending}
                     onClick={() => setShowFailureForm(!showFailureForm)}
                     className="rounded bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                  >
                     {showFailureForm ? "Cancel" : "Mark Failed"}
                  </button>
               </div>

               {showFailureForm && (
                  <div className="space-y-2 pt-2">
                     <input
                        type="text"
                        required
                        value={failureReasonInput}
                        onChange={(e) => setFailureReasonInput(e.target.value)}
                        placeholder="Reason (e.g. customer unavailable)..."
                        className="w-full rounded border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-ring"
                     />
                     <textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Additional delivery notes (optional)..."
                        className="w-full rounded border bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-ring"
                        rows={2}
                     />
                     <button
                        disabled={isPending || !failureReasonInput.trim()}
                        onClick={handleConfirmFailure}
                        className="w-full rounded bg-destructive py-1 text-xs font-medium text-destructive-foreground disabled:opacity-50"
                     >
                        Confirm Delivery Failure
                     </button>
                  </div>
               )}
            </div>
         )}
      </div>
   );
}