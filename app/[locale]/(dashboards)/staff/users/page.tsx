import { revalidatePath } from "next/cache";
import { requireRole } from "@/app/lib/auth/require-role";
import {
   getStaffUsers,
   StaffRole,
} from "@/features/dashboards/staff/users/actions/users-actions";
import { StaffUsersTable } from "@/features/dashboards/staff/users/components/staff-users-table";

export default async function StaffUsersPage() {
   // 1. Server Authorization check
   const currentUser = await requireRole(["admin", "owner", "viewer", "delivery"]);

   // 2. Fetch active staff users
   const users = await getStaffUsers();

   async function handleRefresh() {
      "use server";
      revalidatePath("/staff/users");
   }

   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">
               Staff Directory & Permissions
            </h1>
            <p className="text-sm text-muted-foreground">
               Manage staff users, assign custom roles (`public.staff_role`), and synchronize Clerk user IDs.
            </p>
         </div>

         <StaffUsersTable
            users={users as any}
            currentUserId={currentUser.id}
            currentUserRole={currentUser.role as StaffRole}
            onRefresh={handleRefresh}
         />
      </div>
   );
}