"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
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
   const t = useTranslations("StaffUsers");
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
            setErrorMsg(err.message || t("errors.updateRole"));
         }
      });
   };

   const handleSoftDelete = (targetUserId: string) => {
      if (!confirm(t("confirmRemove"))) return;

      setErrorMsg(null);
      startTransition(async () => {
         try {
            await softDeleteUser(targetUserId);
            onRefresh();
         } catch (err: any) {
            setErrorMsg(err.message || t("errors.remove"));
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
            setErrorMsg(err.message || t("errors.create"));
         }
      });
   };

   return (
      <div className="grid gap-6 md:grid-cols-3">
         {canManage && (
            <div className="rounded-lg border bg-card p-5 shadow-sm h-fit">
               <h2 className="text-lg font-semibold tracking-tight mb-4">
                  {t("addStaffTitle")}
               </h2>

               {errorMsg && (
                  <div className="mb-4 rounded-md bg-destructive/15 p-3 text-xs text-destructive">
                     {errorMsg}
                  </div>
               )}

               <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                     <label className="text-xs font-medium text-foreground">
                        {t("clerkIdLabel")}
                     </label>
                     <input
                        type="text"
                        required
                        value={clerkId}
                        onChange={(e) => setClerkId(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
                        placeholder={t("clerkIdPlaceholder")}
                     />
                  </div>

                  <div>
                     <label className="text-xs font-medium text-foreground">
                        {t("fullNameLabel")}
                     </label>
                     <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder={t("fullNamePlaceholder")}
                     />
                  </div>

                  <div>
                     <label className="text-xs font-medium text-foreground">
                        {t("emailLabel")}
                     </label>
                     <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder={t("emailPlaceholder")}
                     />
                  </div>

                  <div>
                     <label className="text-xs font-medium text-foreground">
                        {t("phoneLabel")}
                     </label>
                     <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder={t("phonePlaceholder")}
                     />
                  </div>

                  <div>
                     <label className="text-xs font-medium text-foreground">
                        {t("roleLabel")}
                     </label>
                     <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as StaffRole)}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                     >
                        <option value="viewer">{t("roles.viewer")}</option>
                        <option value="delivery">{t("roles.delivery")}</option>
                        <option value="admin">{t("roles.admin")}</option>
                        {currentUserRole === "owner" && (
                           <option value="owner">{t("roles.owner")}</option>
                        )}
                     </select>
                  </div>

                  <button
                     type="submit"
                     disabled={isPending || !email.trim() || !fullName.trim() || !clerkId.trim()}
                     className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                     {isPending ? t("saving") : t("addStaffButton")}
                  </button>
               </form>
            </div>
         )}

         <div className={canManage ? "md:col-span-2" : "md:col-span-3"}>
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                     <tr>
                        <th className="px-4 py-3">{t("tableHeaderMember")}</th>
                        <th className="px-4 py-3">{t("tableHeaderPhone")}</th>
                        <th className="px-4 py-3">{t("tableHeaderRole")}</th>
                        <th className="px-4 py-3 text-right">{t("tableHeaderActions")}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y">
                     {users.length === 0 ? (
                        <tr>
                           <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-muted-foreground"
                           >
                              {t("noStaff")}
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
                                             {t("youBadge")}
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
                                          {t("protected")}
                                       </span>
                                    ) : (
                                       <button
                                          onClick={() => handleSoftDelete(user.id)}
                                          disabled={isPending}
                                          className="text-xs font-medium text-destructive hover:underline disabled:opacity-50"
                                       >
                                          {t("remove")}
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