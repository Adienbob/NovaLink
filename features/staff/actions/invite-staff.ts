"use server";

import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { requireRole } from "@/app/lib/auth/require-role";

const inviteStaffSchema = z.object({
   email: z.email(),
   role: z.enum(["viewer", "delivery", "admin"]),
});

type InviteStaffInput = z.infer<typeof inviteStaffSchema>;

export async function inviteStaff(input: InviteStaffInput) {
   const result = inviteStaffSchema.safeParse(input);

   if (!result.success) {
      throw new Error("INVALID_INVITATION_DATA");
   }

   const { email, role } = result.data;

   const user = await requireRole(["owner", "admin"]);

   if (user.role === "admin" && role === "admin") {
      throw new Error("FORBIDDEN");
   }

   const client = await clerkClient();

   const invitation = await client.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: {
         role,
      },
   });

   return {
      id: invitation.id,
      status: "invitation_created",
   };
}