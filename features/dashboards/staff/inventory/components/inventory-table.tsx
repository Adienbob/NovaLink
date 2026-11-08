"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StockAdjustmentDialog } from "./stock-adjustment-dialog";

export interface InventoryVariantItem {
   id: string;
   product_id: string;
   sku: string;
   variant_name: string;
   attributes: Record<string, any>;
   price: number;
   stock_quantity: number;
   is_active: boolean;
   products: { id: string; name: string; slug: string } | null;
}

export interface InventoryLogItem {
   id: string;
   variant_id: string;
   user_id: string | null;
   change_quantity: number;
   previous_stock: number;
   new_stock: number;
   reason: string;
   notes: string | null;
   created_at: string;
   user: { id: string; full_name: string | null; email: string } | null;
   variant: { id: string; sku: string; variant_name: string } | null;
}

interface InventoryTableProps {
   variants: InventoryVariantItem[];
   logs: InventoryLogItem[];
   currentUserRole: "admin" | "owner" | "delivery" | "viewer";
   onRefresh: () => void;
}

export function InventoryTable({
   variants,
   logs,
   currentUserRole,
   onRefresh,
}: InventoryTableProps) {
   const t = useTranslations("StaffInventoryTable");

   const [activeTab, setActiveTab] = useState<"inventory" | "logs">("inventory");
   const [selectedVariant, setSelectedVariant] = useState<InventoryVariantItem | null>(null);

   const canManage = currentUserRole === "admin" || currentUserRole === "owner";

   return (
      <div className="space-y-4">
         <div className="flex border-b">
            <button
               onClick={() => setActiveTab("inventory")}
               className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "inventory"
                     ? "border-primary text-primary"
                     : "border-transparent text-muted-foreground hover:text-foreground"
               }`}
            >
               {t("stockLevels")} ({variants.length})
            </button>

            <button
               onClick={() => setActiveTab("logs")}
               className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "logs"
                     ? "border-primary text-primary"
                     : "border-transparent text-muted-foreground hover:text-foreground"
               }`}
            >
               {t("auditLogs")} ({logs.length})
            </button>
         </div>

         {activeTab === "inventory" ? (
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                     <tr>
                        <th className="px-4 py-3">{t("productVariant")}</th>
                        <th className="px-4 py-3">{t("sku")}</th>
                        <th className="px-4 py-3">{t("price")}</th>
                        <th className="px-4 py-3">{t("stockLevel")}</th>
                        <th className="px-4 py-3 text-right">{t("actions")}</th>
                     </tr>
                  </thead>

                  <tbody className="divide-y">
                     {variants.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                              {t("noInventory")}
                           </td>
                        </tr>
                     ) : (
                        variants.map((item) => {
                           const isLowStock = item.stock_quantity <= 5;
                           const isOutOfStock = item.stock_quantity === 0;

                           return (
                              <tr key={item.id} className="hover:bg-muted/30">
                                 <td className="px-4 py-3">
                                    <div className="font-medium">
                                       {item.products?.name || t("product")}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                       {item.variant_name}
                                    </div>
                                 </td>

                                 <td className="px-4 py-3 font-mono text-xs">
                                    {item.sku}
                                 </td>

                                 <td className="px-4 py-3 font-mono text-xs">
                                    ${Number(item.price).toFixed(2)}
                                 </td>

                                 <td className="px-4 py-3">
                                    <span
                                       className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                          isOutOfStock
                                             ? "bg-red-100 text-red-800"
                                             : isLowStock
                                             ? "bg-yellow-100 text-yellow-800"
                                             : "bg-green-100 text-green-800"
                                       }`}
                                    >
                                       {item.stock_quantity} {t("units")}
                                    </span>
                                 </td>

                                 <td className="px-4 py-3 text-right">
                                    {canManage ? (
                                       <button
                                          onClick={() => setSelectedVariant(item)}
                                          className="text-xs font-medium text-primary hover:underline"
                                       >
                                          {t("adjustStock")}
                                       </button>
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
         ) : (
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                     <tr>
                        <th className="px-4 py-3">{t("sku")}</th>
                        <th className="px-4 py-3">{t("change")}</th>
                        <th className="px-4 py-3">{t("previousToNew")}</th>
                        <th className="px-4 py-3">{t("reason")}</th>
                        <th className="px-4 py-3">{t("adjustedBy")}</th>
                        <th className="px-4 py-3">{t("date")}</th>
                     </tr>
                  </thead>

                  <tbody className="divide-y">
                     {logs.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                              {t("noLogs")}
                           </td>
                        </tr>
                     ) : (
                        logs.map((log) => (
                           <tr key={log.id} className="hover:bg-muted/30">
                              <td className="px-4 py-3 font-mono text-xs font-bold">
                                 {log.variant?.sku || "-"}
                              </td>

                              <td className="px-4 py-3 font-mono text-xs">
                                 <span
                                    className={
                                       log.change_quantity > 0
                                          ? "text-green-600 font-semibold"
                                          : "text-red-600 font-semibold"
                                    }
                                 >
                                    {log.change_quantity > 0
                                       ? `+${log.change_quantity}`
                                       : log.change_quantity}
                                 </span>
                              </td>

                              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                 {log.previous_stock} → {log.new_stock}
                              </td>

                              <td className="px-4 py-3">
                                 <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-semibold">
                                    {log.reason}
                                 </span>

                                 {log.notes && (
                                    <div className="text-[10px] text-muted-foreground italic mt-0.5">
                                       {log.notes}
                                    </div>
                                 )}
                              </td>

                              <td className="px-4 py-3 text-xs">
                                 {log.user?.full_name || log.user?.email || t("system")}
                              </td>

                              <td className="px-4 py-3 text-xs text-muted-foreground">
                                 {new Date(log.created_at).toLocaleString()}
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         )}

         {selectedVariant && (
            <StockAdjustmentDialog
               variant={selectedVariant}
               isOpen={!!selectedVariant}
               onClose={() => setSelectedVariant(null)}
               onSuccess={onRefresh}
            />
         )}
      </div>
   );
}