import { revalidatePath } from "next/cache";
import { requireRole } from "@/app/lib/auth/require-role";
import { ProductsTable } from "@/features/dashboards/staff/products/components/products-table";
import { getProducts } from "@/features/dashboards/staff/products/actions/products-actions";

export default async function StaffProductsPage() {
   const user = await requireRole(["admin", "owner", "viewer"]);
   const { products } = await getProducts({ page: 1, limit: 20 });

   async function handleRefresh() {
      "use server";
      revalidatePath("/staff/products");
   }

   return (
      <div className="space-y-6 p-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold tracking-tight">Products Catalog</h1>
               <p className="text-sm text-muted-foreground">
                  Manage inventory, multi-variant pricing, stock levels, and media galleries.
               </p>
            </div>
         </div>

         <ProductsTable
            products={products as any}
            userRole={user.role as "admin" | "owner" | "viewer"}
            onRefresh={handleRefresh}
         />
      </div>
   );
}