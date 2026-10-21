import { requireRole } from "@/app/lib/auth/require-role";
import { getActivityLogs } from "@/features/dashboards/staff/activity-logs/actions/activity-logs-actions";
import { ActivityLogsTable } from "@/features/dashboards/staff/activity-logs/components/activity-logs-table";

interface PageProps {
   searchParams: Promise<{ entityType?: string; action?: string; page?: string }>;
}

export default async function ActivityLogsPage({ searchParams }: PageProps) {
   // 1. Strict Authorization check - ONLY Owners and Admins can view full audit logs
   await requireRole(["admin", "owner"]);

   const params = await searchParams;
   const entityType = params.entityType || "all";
   const action = params.action || "";
   const page = parseInt(params.page || "1", 10);

   // 2. Fetch log data
   const { logs, totalCount } = await getActivityLogs({
      entityType,
      action,
      page,
   });

   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">
               System Audit Trail & Activity Logs
            </h1>
            <p className="text-sm text-muted-foreground">
               Centralized immutable log tracking all role modifications, inventory adjustments, order dispatch changes, and user management events.
            </p>
         </div>

         <ActivityLogsTable
            logs={logs as any}
            totalCount={totalCount}
            onFilterChange={async () => {
               "use server";
               // Handled via URL updates or client state router updates
            }}
         />
      </div>
   );
}