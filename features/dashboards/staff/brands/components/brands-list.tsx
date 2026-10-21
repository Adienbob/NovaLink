"use client";

import { useState, useTransition } from "react";
import { createBrand, deleteBrand, BrandPayload } from "../actions/brands-actions";

export interface BrandItem {
   id: string;
   name: string;
   slug: string;
   logo_url: string | null;
}

interface BrandsListProps {
   brands: BrandItem[];
   userRole: "admin" | "owner" | "viewer" | "delivery";
   onRefresh: () => void;
}

export function BrandsList({ brands, userRole, onRefresh }: BrandsListProps) {
   const [isPending, startTransition] = useTransition();
   const [name, setName] = useState("");
   const [logoUrl, setLogoUrl] = useState("");
   const [errorMsg, setErrorMsg] = useState<string | null>(null);
   const [deletingId, setDeletingId] = useState<string | null>(null);

   const canEdit = userRole === "admin" || userRole === "owner";

   const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!canEdit || !name.trim()) return;

      setErrorMsg(null);
      startTransition(async () => {
         try {
            const payload: BrandPayload = {
               name: name.trim(),
               logo_url: logoUrl.trim() || null,
            };
            await createBrand(payload);
            setName("");
            setLogoUrl("");
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || "Failed to create brand.");
         }
      });
   };

   const handleDelete = (brandId: string) => {
      if (!canEdit) return;
      if (!confirm("Are you sure you want to delete this brand?")) return;

      setDeletingId(brandId);
      setErrorMsg(null);

      startTransition(async () => {
         try {
            await deleteBrand(brandId);
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || "Failed to delete brand.");
         } finally {
            setDeletingId(null);
         }
      });
   };

   return (
      <div className="grid gap-6 md:grid-cols-3">
         {/* Creation Form (Admins & Owners only) */}
         {canEdit && (
            <div className="rounded-lg border bg-card p-5 shadow-sm h-fit">
               <h2 className="text-lg font-semibold tracking-tight mb-4">
                  Add Brand
               </h2>

               {errorMsg && (
                  <div className="mb-4 rounded bg-destructive/15 p-3 text-xs text-destructive">
                     {errorMsg}
                  </div>
               )}

               <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                     <label className="text-xs font-medium text-foreground">
                        Brand Name *
                     </label>
                     <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g. Nike, Apple"
                     />
                  </div>

                  <div>
                     <label className="text-xs font-medium text-foreground">
                        Logo URL (Optional)
                     </label>
                     <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder="https://example.com/logo.png"
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={isPending || !name.trim()}
                     className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                     {isPending ? "Saving..." : "Create Brand"}
                  </button>
               </form>
            </div>
         )}

         {/* Brands Data Table */}
         <div className={canEdit ? "md:col-span-2" : "md:col-span-3"}>
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                     <tr>
                        <th className="px-4 py-3">Logo</th>
                        <th className="px-4 py-3">Brand Name</th>
                        <th className="px-4 py-3">Slug</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y">
                     {brands.length === 0 ? (
                        <tr>
                           <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-muted-foreground"
                           >
                              No brands found.
                           </td>
                        </tr>
                     ) : (
                        brands.map((brand) => (
                           <tr key={brand.id} className="hover:bg-muted/30">
                              <td className="px-4 py-3">
                                 {brand.logo_url ? (
                                    <img
                                       src={brand.logo_url}
                                       alt={brand.name}
                                       className="h-8 w-8 object-contain rounded border bg-background"
                                    />
                                 ) : (
                                    <div className="h-8 w-8 rounded border bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
                                       {brand.name.slice(0, 2)}
                                    </div>
                                 )}
                              </td>
                              <td className="px-4 py-3 font-medium">
                                 {brand.name}
                              </td>
                              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                 {brand.slug}
                              </td>
                              <td className="px-4 py-3 text-right">
                                 {canEdit ? (
                                    <button
                                       onClick={() => handleDelete(brand.id)}
                                       disabled={isPending && deletingId === brand.id}
                                       className="text-xs font-medium text-destructive hover:underline disabled:opacity-50"
                                    >
                                       {deletingId === brand.id ? "Deleting..." : "Delete"}
                                    </button>
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
      </div>
   );
}