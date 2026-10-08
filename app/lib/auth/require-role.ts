import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/app/lib/supabase/server";

type StaffRole = "viewer" | "delivery" | "admin" | "owner";

export async function requireRole(
   requiredRole: StaffRole | StaffRole[]
   ) {
   const { userId } = await auth();

   if (!userId) {
      throw new Error("UNAUTHORIZED");
   }

   const roles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

   const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, clerk_id, role")
      .eq("clerk_id", userId)
      .single();

   if (error || !user) {
      throw new Error("FORBIDDEN");
   }

   if (!user.role || !roles.includes(user.role as StaffRole)) {
      throw new Error("FORBIDDEN");
   }

   return user;
}