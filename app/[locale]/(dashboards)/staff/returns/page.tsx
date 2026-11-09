
import { requireRole } from "@/app/lib/auth/require-role";
import { getStaffReturns } from "@/features/dashboards/staff/returns/actions/returns-actions";
import { ReturnsTable } from "@/features/dashboards/staff/returns/components/returns-table";
import { getTranslations } from "next-intl/server";

export default async function StaffReturnsPage() {
   const user = await requireRole(["admin", "owner", "viewer"]);
   const { returns } = await getStaffReturns({ page: 1, limit: 20 });
   const t = await getTranslations("StaffReturnsHeader");

   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">
               {t("subtitle")}
            </p>
         </div>

         <ReturnsTable
            returns={returns as any}
            userRole={user.role as "admin" | "owner" | "viewer"}
            onRefresh={async () => {
               "use server";
            }}
         />
      </div>
   );
}