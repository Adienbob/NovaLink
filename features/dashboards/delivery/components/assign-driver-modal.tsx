"use client";

import { useState, useTransition } from "react";
import { assignOrderAction } from "../../staff/actions/assign-order";

interface AssignDriverModalProps {
   orderId: string;
   drivers: Array<{ id: string; full_name: string }>;
   locale?: string;
   onClose: () => void;
}

export function AssignDriverModal({
   orderId,
   drivers,
   locale = "ar",
   onClose,
}: AssignDriverModalProps) {
   const [selectedDriverId, setSelectedDriverId] = useState("");
   const [notes, setNotes] = useState("");
   const [isPending, startTransition] = useTransition();
   const [error, setError] = useState<string | null>(null);

   const isAr = locale === "ar";

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedDriverId) return;

      setError(null);
      startTransition(async () => {
         const res = await assignOrderAction({
         orderId,
         driverId: selectedDriverId,
         notes,
         locale,
         });

         if (res.success) {
         onClose();
         } else {
         setError(res.error || "Failed to assign driver");
         }
      });
   };

   return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
         <div className="bg-background rounded-xl p-6 max-w-md w-full space-y-4 border shadow-lg text-foreground">
         <h3 className="font-bold text-lg">
            {isAr ? "إسناد الطلب لمندوب توصيل" : "Assign Driver to Order"}
         </h3>

         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label className="block text-xs font-semibold mb-1 text-muted-foreground">
               {isAr ? "اختر المندوب" : "Select Driver"}
               </label>
               <select
               value={selectedDriverId}
               onChange={(e) => setSelectedDriverId(e.target.value)}
               required
               className="w-full p-2.5 text-sm border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
               >
               <option value="">{isAr ? "-- اختر مندوباً --" : "-- Select Driver --"}</option>
               {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                     {driver.full_name}
                  </option>
               ))}
               </select>
            </div>

            <div>
               <label className="block text-xs font-semibold mb-1 text-muted-foreground">
               {isAr ? "ملاحظات الإسناد (اختياري)" : "Dispatch Notes (Optional)"}
               </label>
               <textarea
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               rows={2}
               className="w-full p-2.5 text-sm border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
               />
            </div>

            {error && (
               <p className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
               {error}
               </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
               <button
               type="button"
               onClick={onClose}
               className="px-4 py-2 text-sm border rounded-lg hover:bg-accent"
               >
               {isAr ? "إلغاء" : "Cancel"}
               </button>
               <button
               type="submit"
               disabled={isPending || !selectedDriverId}
               className="px-4 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
               >
               {isPending ? (isAr ? "جاري الإسناد..." : "Assigning...") : (isAr ? "تأكيد الإسناد" : "Assign Order")}
               </button>
            </div>
         </form>
         </div>
      </div>
   );
}