"use client";

import { useState, useTransition } from "react";
import { AdjustmentReason, adjustStock } from "../actions/inventory-actions";

interface StockAdjustmentDialogProps {
   variant: {
      id: string;
      sku: string;
      variant_name: string;
      stock_quantity: number;
   };
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
}

const REASONS: { value: AdjustmentReason; label: string }[] = [
   { value: "RESTOCK", label: "Restock / Inbound Shipment" },
   { value: "DAMAGE", label: "Damaged Stock" },
   { value: "SHRINKAGE", label: "Shrinkage / Missing" },
   { value: "AUDIT_CORRECTION", label: "Audit Correction" },
   { value: "RETURN", label: "Customer Return" },
];

export function StockAdjustmentDialog({
   variant,
   isOpen,
   onClose,
   onSuccess,
}: StockAdjustmentDialogProps) {
   const [isPending, startTransition] = useTransition();
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract">("add");
   const [quantityInput, setQuantityInput] = useState<string>("1");
   const [reason, setReason] = useState<AdjustmentReason>("RESTOCK");
   const [notes, setNotes] = useState("");

   if (!isOpen) return null;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const qty = parseInt(quantityInput, 10);
      if (isNaN(qty) || qty <= 0) {
         setErrorMsg("Please enter a valid positive number.");
         return;
      }

      const changeQuantity = adjustmentType === "add" ? qty : -qty;

      setErrorMsg(null);
      startTransition(async () => {
         try {
            await adjustStock({
               variantId: variant.id,
               changeQuantity,
               reason,
               notes,
            });
            onSuccess();
            onClose();
         } catch (err: any) {
            setErrorMsg(err.message || "Failed to adjust stock.");
         }
      });
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
         <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
               <div>
                  <h3 className="text-lg font-semibold tracking-tight">Adjust Stock</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                     {variant.sku} — {variant.variant_name}
                  </p>
               </div>
               <button
                  onClick={onClose}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
               >
                  ✕
               </button>
            </div>

            {errorMsg && (
               <div className="rounded-md bg-destructive/15 p-3 text-xs text-destructive">
                  {errorMsg}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                     Current Stock
                  </label>
                  <div className="text-2xl font-bold font-mono">
                     {variant.stock_quantity}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-2">
                  <button
                     type="button"
                     onClick={() => setAdjustmentType("add")}
                     className={`rounded-md py-2 text-xs font-medium border transition-colors ${
                        adjustmentType === "add"
                           ? "bg-primary text-primary-foreground border-primary"
                           : "bg-background text-foreground"
                     }`}
                  >
                     + Add Stock
                  </button>
                  <button
                     type="button"
                     onClick={() => setAdjustmentType("subtract")}
                     className={`rounded-md py-2 text-xs font-medium border transition-colors ${
                        adjustmentType === "subtract"
                           ? "bg-destructive text-destructive-foreground border-destructive"
                           : "bg-background text-foreground"
                     }`}
                  >
                     - Reduce Stock
                  </button>
               </div>

               <div>
                  <label className="text-xs font-medium text-foreground">Quantity *</label>
                  <input
                     type="number"
                     min="1"
                     required
                     value={quantityInput}
                     onChange={(e) => setQuantityInput(e.target.value)}
                     className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
                  />
               </div>

               <div>
                  <label className="text-xs font-medium text-foreground">Reason *</label>
                  <select
                     value={reason}
                     onChange={(e) => setReason(e.target.value as AdjustmentReason)}
                     className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                     {REASONS.map((r) => (
                        <option key={r.value} value={r.value}>
                           {r.label}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="text-xs font-medium text-foreground">Notes (Optional)</label>
                  <textarea
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                     placeholder="e.g. Received shipment PO-9982..."
                     className="mt-1 w-full rounded-md border bg-background p-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                     rows={2}
                  />
               </div>

               <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                     type="button"
                     onClick={onClose}
                     className="rounded-md border px-4 py-2 text-xs font-medium hover:bg-muted"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     disabled={isPending}
                     className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                  >
                     {isPending ? "Saving..." : "Confirm Adjustment"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}