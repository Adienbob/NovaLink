"use client";

import { FormEvent, useState } from "react";
import { inviteStaff } from "@/features/staff/actions/invite-staff";

type StaffRole = "viewer" | "delivery" | "admin";

export function InviteStaffForm() {
   const [email, setEmail] = useState("");
   const [role, setRole] = useState<StaffRole>("viewer");
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState("");

   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();

      setLoading(true);
      setMessage("");

      try {
         const result = await inviteStaff({
         email,
         role,
         });

         setMessage(`Invitation created: ${result.id}`);
         setEmail("");
      } catch (error) {
         if (error instanceof Error) {
         setMessage(error.message);
         } else {
         setMessage("Something went wrong.");
         }
      } finally {
         setLoading(false);
      }
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
            <label htmlFor="email">Email</label>

            <input
               id="email"
               type="email"
               value={email}
               onChange={(event) => setEmail(event.target.value)}
               required
               className="block w-full border p-2"
               placeholder="staff@example.com"
            />
         </div>

         <div>
            <label htmlFor="role">Role</label>

            <select
               id="role"
               value={role}
               onChange={(event) => setRole(event.target.value as StaffRole)}
               className="block w-full border p-2"
            >
               <option value="viewer">Viewer</option>
               <option value="delivery">Delivery</option>
               <option value="admin">Admin</option>
            </select>
         </div>

         <button
            type="submit"
            disabled={loading}
            className="border px-4 py-2"
         >
            {loading ? "Sending..." : "Send invitation"}
         </button>

         {message && (
            <p role="status">
               {message}
            </p>
         )}
      </form>
   );
}