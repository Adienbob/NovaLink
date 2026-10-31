"use server"

import { supabaseAdmin } from "@/app/lib/supabase/server";
import { requireUser } from "@/app/lib/auth/require-user";
import { revalidatePath } from "next/cache";
import { AddressFormData, addressSchema } from "../schema/address-schema";

export async function createAddress(data: AddressFormData) {
   const user = await requireUser();

   const parsed = addressSchema.safeParse(data);
   if (!parsed.success) {
      throw new Error(
         parsed.error.issues.map((i) => i.message).join(", ")
      );
   }

   const payload = parsed.data;

   const { data: newId, error } = await supabaseAdmin.rpc(
      "create_address_with_default",
      {
         p_user_id: user.id,
         p_payload: payload,
      }
   );

   if (error) {
      throw new Error(error.message);
   }

   revalidatePath("/account/addresses");
   return { success: true, id: newId as string };
}