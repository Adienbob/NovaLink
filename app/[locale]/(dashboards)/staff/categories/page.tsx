// src/app/[locale]/(dashboards)/staff/categories/page.tsx
import { revalidatePath } from "next/cache";
import { requireRole } from "@/app/lib/auth/require-role";
import { getCategories } from "@/features/dashboards/staff/categories/actions/categories-actions";
import { CategoriesList } from "@/features/dashboards/staff/categories/components/categories-list";

export default async function StaffCategoriesPage() {
   // 1. Enforce Server-Side Authorization (admin, owner, viewer)
   const user = await requireRole(["admin", "owner", "viewer"]);

   // 2. Fetch categories hierarchy from server
   const categories = await getCategories();

   // 3. Server action handler to trigger cache revalidation
   async function handleRefresh() {
      "use server";
      revalidatePath("/staff/categories");
   }

   return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
         <div className="border-b border-border pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
               Categories Management
            </h1>
            <p className="text-sm text-secondary mt-1">
               Organize product hierarchy with top-level and nested subcategories.
            </p>
         </div>

         <CategoriesList
            categories={categories as any}
            userRole={user.role as "admin" | "owner" | "viewer"}
            onRefresh={handleRefresh}
         />
      </div>
   );
}