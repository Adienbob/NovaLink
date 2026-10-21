"use client";

import { useState, useTransition } from "react";
import { ReturnStatus, updateReturnStatus } from "../actions/returns-actions";

interface ReturnItem {
   id: string;
   order_id: string;
   reason: string;
   status: ReturnStatus;
   refund_amount: number | null;
   created_at: string;
   orders: {
      id: string;
      total: number;
      users: {
         full_name: string | null;
         email: string | null;
         phone: string | null;
      } | null;
   } | null;
}

interface ReturnsTableProps {
   returns: ReturnItem[];
   userRole: "admin" | "owner" | "viewer";
   onRefresh: () => void;
}

const STATUS_ACTIONS: { label: string; value: ReturnStatus }[] = [
   { label: "Pending", value: "pending" },
   { label: "Approved", value: "approved" },
   { label: "Rejected", value: "rejected" },
   { label: "Refunded", value: "refunded" },
];

export function ReturnsTable({ returns, userRole, onRefresh }: ReturnsTableProps) {
   const [isPending, startTransition] = useTransition();
   const [updatingId, setUpdatingId] = useState<string | null>(null);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   const canEdit = userRole === "admin" || userRole === "owner";

   const handleStatusChange = (returnId: string, newStatus: ReturnStatus) => {
      if (!canEdit) return;

      setUpdatingId(returnId);
      setErrorMsg(null);

      startTransition(async () => {
         try {
            await updateReturnStatus(returnId, newStatus);
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || "Failed to update return status.");
         } finally {
            setUpdatingId(null);
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

         <div className="rounded-md border bg-card">
            <table className="w-full text-left text-sm">
               <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                     <th className="px-4 py-3">Return ID</th>
                     <th className="px-4 py-3">Order ID</th>
                     <th className="px-4 py-3">Customer</th>
                     <th className="px-4 py-3">Reason</th>
                     <th className="px-4 py-3">Refund Amount</th>
                     <th className="px-4 py-3">Status</th>
                     <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {returns.length === 0 ? (
                     <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                           No return requests found.
                        </td>
                     </tr>
                  ) : (
                     returns.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30">
                           <td className="px-4 py-3 font-mono text-xs font-medium">
                              #{item.id.slice(0, 8)}
                           </td>
                           <td className="px-4 py-3 font-mono text-xs">
                              #{item.order_id.slice(0, 8)}
                           </td>
                           <td className="px-4 py-3">
                              <div className="font-medium">
                                 {item.orders?.users?.full_name || "Guest Customer"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                 {item.orders?.users?.phone || item.orders?.users?.email || "N/A"}
                              </div>
                           </td>
                           <td className="px-4 py-3 max-w-xs truncate text-xs">
                              {item.reason}
                           </td>
                           <td className="px-4 py-3 font-semibold">
                              ${item.refund_amount ? Number(item.refund_amount).toFixed(2) : "0.00"}
                           </td>
                           <td className="px-4 py-3">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                                 item.status === "approved"
                                    ? "bg-blue-100 text-blue-800"
                                    : item.status === "refunded"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}>
                                 {item.status}
                              </span>
                           </td>
                           <td className="px-4 py-3 text-right">
                              {canEdit ? (
                                 <select
                                    disabled={(isPending && updatingId === item.id) || item.status === "refunded" || item.status === "rejected"}
                                    value={item.status}
                                    onChange={(e) =>
                                       handleStatusChange(
                                          item.id,
                                          e.target.value as ReturnStatus
                                       )
                                    }
                                    className="h-8 rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                                 >
                                    {STATUS_ACTIONS.map((opt) => (
                                       <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                       </option>
                                    ))}
                                 </select>
                              ) : (
                                 <span className="text-xs text-muted-foreground italic">
                                    View only
                                 </span>
                              )}
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}