"use client";

import { useState, useTransition } from "react";
import {
   createCategory,
   deleteCategory,
   type CategoryPayload,
} from "../actions/categories-actions";
import { Button } from "@/components/ui/button";

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
      <div className="grid gap-6 md:grid-cols-3 items-start">
         {/* Form Section: Only accessible to Admin/Owner */}
         {canEdit && (
         <div className="rounded-lg border border-border bg-surface p-5 shadow-sm h-fit space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border pb-3">
               Add Category
            </h2>

            {errorMsg && (
               <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
               {errorMsg}
               </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
               <div className="space-y-1.5">
               <label className="text-xs font-semibold text-foreground">
                  Category Name <span className="text-destructive">*</span>
               </label>
               <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="e.g. Laptops"
               />
               </div>

               <div className="space-y-1.5">
               <label className="text-xs font-semibold text-foreground">
                  Parent Category <span className="text-xs text-secondary font-normal">(Optional)</span>
               </label>
               <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
               >
                  <option value="">None (Top-Level Category)</option>
                  {categories.map((cat) => (
                     <option key={cat.id} value={cat.id}>
                     {cat.name}
                     </option>
                  ))}
               </select>
               </div>

               <Button
               type="submit"
               disabled={isPending || !name.trim()}
               className="w-full h-10 font-semibold text-sm mt-2"
               >
               {isPending ? "Saving..." : "Create Category"}
               </Button>
            </form>
         </div>
         )}

         {/* Categories Table View */}
         <div className={canEdit ? "md:col-span-2" : "md:col-span-3" }>
            <div className="rounded-lg border border-border bg-surface shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-secondary">
                     <tr>
                        <th className="px-4 py-3.5">Category Name</th>
                        <th className="px-4 py-3.5">Slug</th>
                        <th className="px-4 py-3.5">Parent Category</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {categories.length === 0 ? (
                        <tr>
                        <td
                           colSpan={4}
                           className="px-4 py-12 text-center text-secondary text-sm"
                        >
                           No categories found.
                        </td>
                        </tr>
                     ) : (
                        categories.map((cat) => (
                        <tr
                           key={cat.id}
                           className="transition-colors hover:bg-muted/30 text-foreground"
                        >
                           <td className="px-4 py-3 font-semibold text-foreground">
                              {cat.name}
                           </td>
                           <td className="px-4 py-3 font-mono text-xs text-secondary">
                              {cat.slug}
                           </td>
                           <td className="px-4 py-3 text-xs">
                              {cat.parent ? (
                              <span className="inline-flex items-center rounded-md border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                                 {cat.parent.name}
                              </span>
                              ) : (
                              <span className="text-secondary italic">
                                 Top-Level
                              </span>
                              )}
                           </td>
                           <td className="px-4 py-3 text-right">
                              {canEdit ? (
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => handleDelete(cat.id)}
                                 disabled={isPending && deletingId === cat.id}
                                 className="h-8 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                 {deletingId === cat.id ? "Deleting..." : "Delete"}
                              </Button>
                              ) : (
                              <span className="text-xs text-secondary italic">
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
      </div>
   );
}