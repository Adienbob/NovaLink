"use client";

import { useState, useTransition } from "react";
import {
   StaffRole,
   updateUserRole,
   softDeleteUser,
   createStaffUserRecord,
} from "../actions/users-actions";
import { RoleSelector } from "./role-selectors";

export interface StaffUserItem {
   id: string;
   clerk_id: string;
   email: string;
   phone: string | null;
   full_name: string | null;
   role: StaffRole;
   created_at: string;
   clerk_deleted_at: string | null;
}

interface StaffUsersTableProps {
   users: StaffUserItem[];
   currentUserId: string;
   currentUserRole: StaffRole;
   onRefresh: () => void;
}

export function StaffUsersTable({
   users,
   currentUserId,
   currentUserRole,
   onRefresh,
}: StaffUsersTableProps) {
   const [isPending, startTransition] = useTransition();
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   // Form State
   const [clerkId, setClerkId] = useState("");
   const [email, setEmail] = useState("");
   const [fullName, setFullName] = useState("");
   const [phone, setPhone] = useState("");
   const [selectedRole, setSelectedRole] = useState<StaffRole>("viewer");

   const canManage = currentUserRole === "admin" || currentUserRole === "owner";

   const handleRoleChange = (targetUserId: string, newRole: StaffRole) => {
      setErrorMsg(null);
      startTransition(async () => {
         try {
            await updateUserRole(targetUserId, newRole);
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || "Failed to update role.");
         }
      });
   };

   const handleSoftDelete = (targetUserId: string) => {
      if (!confirm("Are you sure you want to remove this staff user?")) return;

      setErrorMsg(null);
      startTransition(async () => {
         try {
            await softDeleteUser(targetUserId);
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || "Failed to remove staff user.");
         }
      });
   };

   const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim() || !fullName.trim() || !clerkId.trim()) return;

      setErrorMsg(null);
      startTransition(async () => {
         try {
            await createStaffUserRecord({
               clerk_id: clerkId.trim(),
               email: email.trim(),
               full_name: fullName.trim(),
               phone: phone.trim() || null,
               role: selectedRole,
            });
            setClerkId("");
            setEmail("");
            setFullName("");
            setPhone("");
            setSelectedRole("viewer");
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || "Failed to create staff user.");
         }
      });
   };

   return (
      <div className="grid gap-6 md:grid-cols-3">
         {canManage && (
            <div className="rounded-lg border bg-card p-5 shadow-sm h-fit">
               <h2 className="text-lg font-semibold tracking-tight mb-4">
                  Add Staff Member
               </h2>

               {errorMsg && (
                  <div className="mb-4 rounded-md bg-destructive/15 p-3 text-xs text-destructive">
                     {errorMsg}
                  </div>
               )}

               <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                     <label className="text-xs font-medium text-foreground">
                        Clerk User ID *
                     </label>
                     <input
                        type="text"
                        required
                        value={clerkId}
                        onChange={(e) => setClerkId(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
                        placeholder="user_2x..."
                     />
                  </div>

                  <div>
                     <label className="text-xs font-medium text-foreground">
                        Full Name *
                     </label>
                     <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder="John Doe"
                     />
                  </div>

                  <div>
                     <label className="text-xs font-medium text-foreground">
                        Email Address *
                     </label>
                     <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder="staff@company.com"
                     />
                  </div>

                  <div>
                     <label className="text-xs font-medium text-foreground">
                        Phone (Optional)
                     </label>
                     <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder="+123456789"
                     />
                  </div>

                  <div>
                     <label className="text-xs font-medium text-foreground">
                        Role
                     </label>
                     <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as StaffRole)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                     >
                        <option value="viewer">Viewer (Read-only)</option>
                        <option value="delivery">Delivery Staff</option>
                        <option value="admin">Admin</option>
                        {currentUserRole === "owner" && (
                           <option value="owner">Owner</option>
                        )}
                     </select>
                  </div>

                  <button
                     type="submit"
                     disabled={isPending || !email.trim() || !fullName.trim() || !clerkId.trim()}
                     className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                     {isPending ? "Saving..." : "Add Staff Member"}
                  </button>
               </form>
            </div>
         )}

         <div className={canManage ? "md:col-span-2" : "md:col-span-3"}>
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                     <tr>
                        <th className="px-4 py-3">Staff Member</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y">
                     {users.length === 0 ? (
                        <tr>
                           <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-muted-foreground"
                           >
                              No active staff members found.
                           </td>
                        </tr>
                     ) : (
                        users.map((user) => {
                           const isSelf = user.id === currentUserId;
                           const isOwnerRow = user.role === "owner";
                           const cannotEdit =
                              !canManage ||
                              isSelf ||
                              (isOwnerRow && currentUserRole !== "owner");

                           return (
                              <tr key={user.id} className="hover:bg-muted/30">
                                 <td className="px-4 py-3">
                                    <div className="font-medium">
                                       {user.full_name || "Unnamed Staff"}
                                       {isSelf && (
                                          <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                                             You
                                          </span>
                                       )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                       {user.email}
                                    </div>
                                    <div className="text-[10px] font-mono text-muted-foreground">
                                       {user.clerk_id}
                                    </div>
                                 </td>

                                 <td className="px-4 py-3 text-xs text-muted-foreground">
                                    {user.phone || "-"}
                                 </td>

                                 <td className="px-4 py-3">
                                    <RoleSelector
                                       currentRole={user.role}
                                       disabled={cannotEdit || isPending}
                                       onChangeRole={(newRole) =>
                                          handleRoleChange(user.id, newRole)
                                       }
                                    />
                                 </td>

                                 <td className="px-4 py-3 text-right">
                                    {cannotEdit ? (
                                       <span className="text-xs text-muted-foreground italic">
                                          Protected
                                       </span>
                                    ) : (
                                       <button
                                          onClick={() => handleSoftDelete(user.id)}
                                          disabled={isPending}
                                          className="text-xs font-medium text-destructive hover:underline disabled:opacity-50"
                                       >
                                          Remove
                                       </button>
                                    )}
                                 </td>
                              </tr>
                           );
                        })
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}