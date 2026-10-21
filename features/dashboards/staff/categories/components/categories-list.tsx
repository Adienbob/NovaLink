// src/features/staff/categories/components/categories-list.tsx
"use client";

import { useState, useTransition } from "react";
import {
   createCategory,
   deleteCategory,
   CategoryPayload,
} from "../actions/categories-actions";

export interface CategoryItem {
   id: string;
   name: string;
   slug: string;
   parent_id: string | null;
   parent?: {
      id: string;
      name: string;
   } | null;
}

interface CategoriesListProps {
   categories: CategoryItem[];
   userRole: "admin" | "owner" | "viewer" | "delivery";
   onRefresh: () => void;
}

export function CategoriesList({
   categories,
   userRole,
   onRefresh,
}: CategoriesListProps) {
   const [isPending, startTransition] = useTransition();
   const [name, setName] = useState("");
   const [parentId, setParentId] = useState<string>("");
   const [errorMsg, setErrorMsg] = useState<string | null>(null);
   const [deletingId, setDeletingId] = useState<string | null>(null);

   const canEdit = userRole === "admin" || userRole === "owner";

   const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!canEdit || !name.trim()) return;

      setErrorMsg(null);
      startTransition(async () => {
         try {
            const payload: CategoryPayload = {
               name: name.trim(),
               parent_id: parentId !== "" ? parentId : null,
            };
            await createCategory(payload);
            setName("");
            setParentId("");
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || "Failed to create category.");
         }
      });
   };

   const handleDelete = (categoryId: string) => {
      if (!canEdit) return;
      if (!confirm("Are you sure you want to delete this category?")) return;

      setDeletingId(categoryId);
      setErrorMsg(null);

      startTransition(async () => {
         try {
            await deleteCategory(categoryId);
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || "Failed to delete category.");
         } finally {
            setDeletingId(null);
         }
      });
   };

   return (
      <div className="grid gap-6 md:grid-cols-3">
         {/* Form Section: Only accessible to Admin/Owner */}
         {canEdit && (
            <div className="rounded-lg border bg-card p-5 shadow-sm h-fit">
               <h2 className="text-lg font-semibold tracking-tight mb-4">
                  Add Category
               </h2>

               {errorMsg && (
                  <div className="mb-4 rounded bg-destructive/15 p-3 text-xs text-destructive">
                     {errorMsg}
                  </div>
               )}

               <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                     <label className="text-xs font-medium text-foreground">
                        Category Name *
                     </label>
                     <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g. Laptops"
                     />
                  </div>

                  <div>
                     <label className="text-xs font-medium text-foreground">
                        Parent Category (Optional)
                     </label>
                     <select
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                     >
                        <option value="">None (Top-Level Category)</option>
                        {categories.map((cat) => (
                           <option key={cat.id} value={cat.id}>
                              {cat.name}
                           </option>
                        ))}
                     </select>
                  </div>

                  <button
                     type="submit"
                     disabled={isPending || !name.trim()}
                     className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                     {isPending ? "Saving..." : "Create Category"}
                  </button>
               </form>
            </div>
         )}

         {/* Categories Table View */}
         <div className={canEdit ? "md:col-span-2" : "md:col-span-3"}>
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                     <tr>
                        <th className="px-4 py-3">Category Name</th>
                        <th className="px-4 py-3">Slug</th>
                        <th className="px-4 py-3">Parent Category</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y">
                     {categories.length === 0 ? (
                        <tr>
                           <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-muted-foreground"
                           >
                              No categories found.
                           </td>
                        </tr>
                     ) : (
                        categories.map((cat) => (
                           <tr key={cat.id} className="hover:bg-muted/30">
                              <td className="px-4 py-3 font-medium">
                                 {cat.name}
                              </td>
                              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                 {cat.slug}
                              </td>
                              <td className="px-4 py-3 text-xs">
                                 {cat.parent ? (
                                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                                       {cat.parent.name}
                                    </span>
                                 ) : (
                                    <span className="text-muted-foreground italic">
                                       Top-Level
                                    </span>
                                 )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                 {canEdit ? (
                                    <button
                                       onClick={() => handleDelete(cat.id)}
                                       disabled={isPending && deletingId === cat.id}
                                       className="text-xs font-medium text-destructive hover:underline disabled:opacity-50"
                                    >
                                       {deletingId === cat.id ? "Deleting..." : "Delete"}
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