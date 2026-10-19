"use client";

import { useState, useTransition } from "react";
import { pickUpDeliveryAction } from "../actions/pickup-delivery";
import { completeDeliveryAction } from "../actions/complete-delivery";
import { failDeliveryAction } from "../actions/fail-delivery";

interface DeliveryCardProps {
   delivery: any;
   locale: string;
}

export function DeliveryCard({ delivery, locale }: DeliveryCardProps) {
   const [isPending, startTransition] = useTransition();
   const [showFailModal, setShowFailModal] = useState(false);
   const [failureReason, setFailureReason] = useState("");
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   const order = delivery.orders;
   const isAr = locale === "ar";

   // 1. إجراء استلام الشحنة من المستودع
   const handlePickup = () => {
      setErrorMessage(null);
      startTransition(async () => {
         const res = await pickUpDeliveryAction({ deliveryId: delivery.id, locale });
         if (!res.success) {
         setErrorMessage(res.error || "Failed to pick up order");
         }
      });
   };

   // 2. إجراء إتمام التسليم للعميل
   const handleComplete = () => {
      setErrorMessage(null);
      startTransition(async () => {
         const res = await completeDeliveryAction({ deliveryId: delivery.id, locale });
         if (!res.success) {
         setErrorMessage(res.error || "Failed to complete delivery");
         }
      });
   };

   // 3. إجراء تسجيل فشل التوصيل
   const handleFail = (e: React.FormEvent) => {
      e.preventDefault();
      if (!failureReason.trim()) return;

      setErrorMessage(null);
      startTransition(async () => {
         const res = await failDeliveryAction({
         deliveryId: delivery.id,
         reason: failureReason,
         locale,
         });
         if (!res.success) {
         setErrorMessage(res.error || "Failed to record delivery failure");
         } else {
         setShowFailModal(false);
         }
      });
   };

   const address = order?.delivery_address_snapshot;

   return (
      <div className="border rounded-xl p-5 bg-card shadow-sm space-y-4 text-card-foreground">
         {/* Header: Order ID & Total */}
         <div className="flex justify-between items-start border-b pb-3">
         <div>
            <span className="font-mono text-xs text-muted-foreground block">
               {isAr ? "رقم الطلب" : "Order ID"}
            </span>
            <span className="font-bold font-mono text-base">#{order?.id?.slice(0, 8)}</span>
         </div>
         <div className="text-end">
            <span className="font-bold text-lg text-primary">{order?.total} EGP</span>
            <span className="block text-xs text-muted-foreground uppercase">
               {order?.payment_method}
            </span>
         </div>
         </div>

         {/* Customer & Address Details */}
         <div className="space-y-1 text-sm">
         <p className="font-semibold">{order?.users?.full_name || (isAr ? "عميل غير مسمى" : "Customer")}</p>
         <p className="text-muted-foreground text-xs">{order?.users?.phone || (isAr ? "بدون رقم هاتف" : "No phone")}</p>
         {address && (
            <div className="mt-2 text-xs bg-muted/50 p-2 rounded border">
               <p className="font-medium text-foreground">{address.street || address.address_line1}</p>
               <p className="text-muted-foreground">{address.city}, {address.governorate || address.state}</p>
            </div>
         )}
         </div>

         {/* Error Feedback */}
         {errorMessage && (
         <div className="p-2 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded">
            {errorMessage}
         </div>
         )}

         {/* Dynamic Action Buttons based on Status */}
         <div className="pt-2">
         {delivery.status === "assigned" && (
            <button
               onClick={handlePickup}
               disabled={isPending}
               className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
            >
               {isPending ? (isAr ? "جاري الاستلام..." : "Picking up...") : (isAr ? "استلام الشحنة من الفرع" : "Pick Up Order")}
            </button>
         )}

         {delivery.status === "picked_up" && (
            <div className="grid grid-cols-2 gap-2">
               <button
               onClick={handleComplete}
               disabled={isPending}
               className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
               >
               {isPending ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "تم التسليم" : "Delivered")}
               </button>
               <button
               onClick={() => setShowFailModal(true)}
               disabled={isPending}
               className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
               >
               {isAr ? "فشل التسليم" : "Failed"}
               </button>
            </div>
         )}

         {delivery.status === "delivered" && (
            <span className="inline-block w-full text-center py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-xs font-semibold">
               {isAr ? "تم التسليم بنجاح" : "Delivered Successfully"}
            </span>
         )}

         {delivery.status === "failed" && (
            <div className="text-xs bg-rose-50 dark:bg-rose-950/50 p-2 rounded border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
               <span className="font-bold">{isAr ? "سبب الفشل: " : "Reason: "}</span>
               {delivery.failure_reason || (isAr ? "غير محدد" : "Unspecified")}
            </div>
         )}
         </div>

         {/* Failure Reason Modal */}
         {showFailModal && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl p-5 max-w-sm w-full space-y-4 border shadow-lg">
               <h3 className="font-bold text-base">
               {isAr ? "تسجيل سبب عدم التوصيل" : "Record Delivery Failure"}
               </h3>
               <form onSubmit={handleFail} className="space-y-3">
               <textarea
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  placeholder={isAr ? "مثال: العميل لم يرد، العنوان غير صحيح..." : "e.g. Customer unreachable, incorrect address..."}
                  required
                  className="w-full p-2.5 text-sm border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
               />
               <div className="flex justify-end gap-2">
                  <button
                     type="button"
                     onClick={() => setShowFailModal(false)}
                     className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent"
                  >
                     {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                     type="submit"
                     disabled={isPending}
                     className="px-3 py-1.5 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50"
                  >
                     {isPending ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "تأكيد" : "Confirm")}
                  </button>
               </div>
               </form>
            </div>
         </div>
         )}
      </div>
   );
}