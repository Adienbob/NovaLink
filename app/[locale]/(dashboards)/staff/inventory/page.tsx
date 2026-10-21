import { revalidatePath } from "next/cache";
import { requireRole } from "@/app/lib/auth/require-role";
import {
   getInventoryVariants,
   getInventoryLogs,
} from "@/features/dashboards/staff/inventory/actions/inventory-actions";
import { InventoryTable } from "@/features/dashboards/staff/inventory/components/inventory-table";

export default async function StaffInventoryPage() {
   const currentUser = await requireRole(["admin", "owner", "viewer", "delivery"]);

   const [variants, logs] = await Promise.all([
      getInventoryVariants(),
      getInventoryLogs(),
   ]);

   async function handleRefresh() {
      "use server";
      revalidatePath("/staff/inventory");
   }

   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">
               Inventory Management & Audit Trail
            </h1>
            <p className="text-sm text-muted-foreground">
               Monitor stock levels, adjust warehouse quantities, and view full immutable adjustment logs.
            </p>
         </div>

         <InventoryTable
            variants={variants as any}
            logs={logs as any}
            currentUserRole={currentUser.role as any}
            onRefresh={handleRefresh}
         />
      </div>
   );
}