"use server"

import { supabaseAdmin } from "@/app/lib/supabase/server";
import { requireUser } from "@/app/lib/auth/require-user";
import { revalidatePath } from "next/cache";

export async function deleteAddress(id: string) {
   const user = await requireUser();
   
   // Verify ownership and delete in one secure query
   const { error, count } = await supabaseAdmin
      .from("addresses")
      .delete({ count: "exact" })
      .eq("id", id)
      .eq("user_id", user.id);
      
      if (error) {
         throw new Error(error.message);
      }
      
   if (count === 0) {
      throw new Error("Address not found");
   }

   revalidatePath("/account/addresses");
   return { success: true };
}