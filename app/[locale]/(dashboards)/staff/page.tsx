import { OverviewCards } from "@/features/dashboards/staff/overview/components/overview-cards";
import { getOverviewStats } from "@/features/dashboards/staff/overview/actions/get-overview-stats";

export default async function StaffOverviewPage() {
   const stats = await getOverviewStats();

   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">
               System Overview
            </h1>
            <p className="text-sm text-muted-foreground">
               Real-time operational metrics across orders, inventory, and field
               operations.
            </p>
         </div>

         <OverviewCards stats={stats} />
      </div>
   );
}