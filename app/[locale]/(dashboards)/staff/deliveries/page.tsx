import { revalidatePath } from "next/cache";
import { requireRole } from "@/app/lib/auth/require-role";
import {
   getDeliveries,
   getAvailableDrivers,
} from "@/features/dashboards/staff/deliveries/actions/deliveries-actions";
import { DeliveriesList } from "@/features/dashboards/staff/deliveries/components/deliveries-list";

export default async function StaffDeliveriesPage() {
   const currentUser = await requireRole(["admin", "owner", "delivery", "viewer"]);

   const [deliveries, drivers] = await Promise.all([
      getDeliveries(),
      getAvailableDrivers(),
   ]);

   async function handleRefresh() {
      "use server";
      revalidatePath("/staff/deliveries");
   }

   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">
               Deliveries & Logistics
            </h1>
            <p className="text-sm text-muted-foreground">
               Track dispatch lifecycle, log driver failure reasons, and view order fulfillment status.
            </p>
         </div>

         <DeliveriesList
            deliveries={deliveries as any}
            drivers={drivers}
            currentUserRole={currentUser.role as any}
            currentUserId={currentUser.id}
            onRefresh={handleRefresh}
         />
      </div>
   );
}