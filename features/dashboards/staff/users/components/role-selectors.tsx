"use client";

import { StaffRole } from "../actions/users-actions";

interface RoleSelectorProps {
   currentRole: StaffRole;
   disabled?: boolean;
   onChangeRole: (newRole: StaffRole) => void;
}

const ROLES: { value: StaffRole; label: string }[] = [
   { value: "viewer", label: "Viewer" },
   { value: "delivery", label: "Delivery Staff" },
   { value: "admin", label: "Admin" },
   { value: "owner", label: "Owner" },
];

export function RoleSelector({
   currentRole,
   disabled = false,
   onChangeRole,
}: RoleSelectorProps) {
   return (
      <select
         value={currentRole}
         disabled={disabled}
         onChange={(e) => onChangeRole(e.target.value as StaffRole)}
         className="rounded-md border bg-background px-2 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      >
         {ROLES.map((role) => (
            <option key={role.value} value={role.value}>
               {role.label}
            </option>
         ))}
      </select>
   );
}