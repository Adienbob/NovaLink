import { requireRole } from "@/app/lib/auth/require-role";
import { getAvailableDrivers } from "@/features/dashboards/staff/deliveries/actions/deliveries-actions";
import { getStaffOrders } from "@/features/dashboards/staff/orders/actions/orders-actions";
import { OrdersTable } from "@/features/dashboards/staff/orders/components/orders-table";
import { getStaffUsers } from "@/features/dashboards/staff/users/actions/users-actions";

export default async function StaffOrdersPage() {
   // Verify user & retrieve role for conditional UI rendering
   const user = await requireRole(["admin", "owner", "viewer"]);
   const { orders } = await getStaffOrders({ page: 1, limit: 20 });
   const drivers = await getAvailableDrivers()
   
   return (
      <div className="space-y-6 p-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>
               <p className="text-sm text-muted-foreground">
                  View, filter, and update customer order fulfillment statuses.
               </p>
            </div>
         </div>

         <OrdersTable
            drivers={drivers}
            orders={orders as any}
            currentUserRole={user.role as "admin" | "owner" | "viewer"}
            onRefresh={async () => {
               "use server";
               // Triggers page re-validation
            }}
         />
      </div>
   );
}