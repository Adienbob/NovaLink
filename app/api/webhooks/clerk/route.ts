import { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { supabaseAdmin } from "@/app/lib/supabase/server";

const STAFF_ROLES = ["viewer", "delivery", "admin", "owner"] as const;

export async function POST(req: NextRequest) {
   const evt = await verifyWebhook(req);

   if (evt.type === "user.created") {
      const user = evt.data;

      const primaryEmail =
         user.email_addresses.find(
         (email) => email.id === user.primary_email_address_id
         )?.email_address ?? null;

      const primaryPhone =
         user.phone_numbers.find(
         (phone) => phone.id === user.primary_phone_number_id
         )?.phone_number ?? null;

      const fullName =
         [user.first_name, user.last_name].filter(Boolean).join(" ") || null;

      const metadataRole = user.public_metadata?.role;

      const role = STAFF_ROLES.includes(
         metadataRole as (typeof STAFF_ROLES)[number]
      )
         ? (metadataRole as (typeof STAFF_ROLES)[number])
         : null;

      if (!primaryEmail) {
         return new Response("User email is required", { status: 400 });
      }

      const { error } = await supabaseAdmin
         .from("users")
         .upsert(
         {
            clerk_id: user.id,
            email: primaryEmail,
            phone: primaryPhone,
            full_name: fullName,
            role,
         },
         {
            onConflict: "clerk_id",
         }
         );

      if (error) {
         console.error("Failed to create Supabase user:", error);

         return new Response("Failed to create user", { status: 500 });
      }
   }

   if (evt.type === "user.updated") {
      const user = evt.data;

      const primaryEmail =
         user.email_addresses.find(
            (email) => email.id === user.primary_email_address_id
         )?.email_address ?? null;

      const fullName =
         [user.first_name, user.last_name].filter(Boolean).join(" ") || null;

      if (!primaryEmail) {
         return new Response("User email is required", { status: 400 });
      }

      const { error } = await supabaseAdmin
         .from("users")
         .update({
            email: primaryEmail,
            full_name: fullName,
         })
         .eq("clerk_id", user.id);

      if (error) {
         console.error("Failed to update Supabase user:", error);

         return new Response("Failed to update user", { status: 500 });
      }
   }

   return new Response("Webhook received", { status: 200 });
}