import { revalidatePath } from "next/cache";
import { useTranslations } from "next-intl";
import { requireRole } from "@/app/lib/auth/require-role";
import {
   getDeliveries,
   getAvailableDrivers,
} from "@/features/dashboards/staff/deliveries/actions/deliveries-actions";
import { DeliveriesList } from "@/features/dashboards/staff/deliveries/components/deliveries-list";

export default async function StaffDeliveriesPage() {
   const t = useTranslations("StaffDeliveriesPage");
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
               {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">
               {t("subtitle")}
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