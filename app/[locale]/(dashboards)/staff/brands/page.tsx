import { revalidatePath } from "next/cache";
import { requireRole } from "@/app/lib/auth/require-role";
import { getBrands } from "@/features/dashboards/staff/brands/actions/brands-actions";
import { BrandsList } from "@/features/dashboards/staff/brands/components/brands-list";

export default async function StaffBrandsPage() {
   // 1. Role verification for access control
   const user = await requireRole(["admin", "owner", "viewer"]);

   // 2. Data fetching from backend
   const brands = await getBrands();

   async function handleRefresh() {
      "use server";
      revalidatePath("/staff/brands");
   }

   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">
               Brands Management
            </h1>
            <p className="text-sm text-muted-foreground">
               Manage manufacturer and supplier brands associated with catalog items.
            </p>
         </div>

         <BrandsList
            brands={brands}
            userRole={user.role as "admin" | "owner" | "viewer"}
            onRefresh={handleRefresh}
         />
      </div>
   );
}