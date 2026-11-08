import { OverviewCards } from "@/features/dashboards/staff/overview/components/overview-cards";
import { getOverviewStats } from "@/features/dashboards/staff/overview/actions/get-overview-stats";
import { getTranslations } from "next-intl/server";

export default async function StaffOverviewPage() {
   const t = await getTranslations("StaffOverview");
   const stats = await getOverviewStats();

   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">
               {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">
               {t("description")}
            </p>
         </div>

         <OverviewCards stats={stats} />
      </div>
   );
}