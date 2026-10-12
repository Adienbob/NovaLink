import { auth } from "@clerk/nextjs/server";

import { supabaseAdmin } from "@/app/lib/supabase/server";

export async function requireUser() {
   const { userId } = await auth();

   if (!userId) {
      throw new Error("UNAUTHORIZED");
   }

   const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, clerk_id, role")
      .eq("clerk_id", userId)
      .single();

   if (error || !user) {
      throw new Error("USER_NOT_FOUND");
   }

   return user;
}