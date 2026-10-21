"use client";

import { useState, useTransition } from "react";
import { deleteProduct } from "../actions/products-actions";

export interface ProductItem {
   id: string;
   name: string;
   slug: string;
   base_price: number;
   is_active: boolean;
   created_at: string;
   categories: { id: string; name: string } | null;
   brands: { id: string; name: string } | null;
   product_variants: {
      id: string;
      sku: string;
      variant_name: string;
      price: number;
      stock_quantity: number;
      is_active: boolean;
   }[];
   product_images: {
      id: string;
      url: string;
      alt_text: string | null;
      sort_order: number;
   }[];
}

interface ProductsTableProps {
   products: ProductItem[];
   userRole: "admin" | "owner" | "viewer" | "delivery";
   onRefresh: () => void;
}

export function ProductsTable({
   products,
   userRole,
   onRefresh,
}: ProductsTableProps) {
   const [isPending, startTransition] = useTransition();
   const [deletingId, setDeletingId] = useState<string | null>(null);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   const canEdit = userRole === "admin" || userRole === "owner";

   const handleDelete = (productId: string) => {
      if (!canEdit) return;
      if (!confirm("Are you sure? This will delete all variants and images.")) return;

      setDeletingId(productId);
      setErrorMsg(null);

      startTransition(async () => {
         try {
            await deleteProduct(productId);
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || "Failed to delete product.");
         } finally {
            setDeletingId(null);
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

         <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
               <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                     <th className="px-4 py-3">Image</th>
                     <th className="px-4 py-3">Product Name</th>
                     <th className="px-4 py-3">Category</th>
                     <th className="px-4 py-3">Brand</th>
                     <th className="px-4 py-3">Base Price</th>
                     <th className="px-4 py-3">Variants</th>
                     <th className="px-4 py-3">Status</th>
                     <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {products.length === 0 ? (
                     <tr>
                        <td
                           colSpan={8}
                           className="px-4 py-8 text-center text-muted-foreground"
                        >
                           No products found.
                        </td>
                     </tr>
                  ) : (
                     products.map((p) => {
                        const mainImage = p.product_images?.[0]?.url;
                        const totalStock = p.product_variants?.reduce(
                           (acc, v) => acc + v.stock_quantity,
                           0
                        );

                        return (
                           <tr key={p.id} className="hover:bg-muted/30">
                              <td className="px-4 py-3">
                                 {mainImage ? (
                                    <img
                                       src={mainImage}
                                       alt={p.name}
                                       className="h-10 w-10 object-cover rounded border bg-background"
                                    />
                                 ) : (
                                    <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                       NO IMG
                                    </div>
                                 )}
                              </td>
                              <td className="px-4 py-3">
                                 <div className="font-medium">{p.name}</div>
                                 <div className="text-xs font-mono text-muted-foreground">
                                    {p.slug}
                                 </div>
                              </td>
                              <td className="px-4 py-3 text-xs">
                                 {p.categories?.name || "-"}
                              </td>
                              <td className="px-4 py-3 text-xs">
                                 {p.brands?.name || "-"}
                              </td>
                              <td className="px-4 py-3 font-semibold">
                                 ${Number(p.base_price).toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-xs">
                                 <div>{p.product_variants?.length || 0} variant(s)</div>
                                 <div className="text-muted-foreground">
                                    Stock: {totalStock ?? 0}
                                 </div>
                              </td>
                              <td className="px-4 py-3">
                                 <span
                                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                       p.is_active
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                 >
                                    {p.is_active ? "Active" : "Draft"}
                                 </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                 {canEdit ? (
                                    <button
                                       onClick={() => handleDelete(p.id)}
                                       disabled={isPending && deletingId === p.id}
                                       className="text-xs font-medium text-destructive hover:underline disabled:opacity-50"
                                    >
                                       {deletingId === p.id ? "Deleting..." : "Delete"}
                                    </button>
                                 ) : (
                                    <span className="text-xs text-muted-foreground italic">
                                       View only
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