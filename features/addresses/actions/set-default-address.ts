"use server"
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { requireUser } from "@/app/lib/auth/require-user";
import { revalidatePath } from "next/cache";

export async function setDefaultAddress(id: string) {
   const user = await requireUser();

   const { error } = await supabaseAdmin.rpc("set_default_address", {
      p_user_id: user.id,
      p_address_id: id,
   });

   if (error) {
      throw new Error(error.message);
   }

   revalidatePath("/account/addresses");
   return { success: true };
}