import { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export async function POST(req: NextRequest) {
   const evt = await verifyWebhook(req);

   switch (evt.type) {
      case "user.created": {
         const email = evt.data.email_addresses[0]?.email_address;

         if (!email) {
            throw new Error("USER_EMAIL_REQUIRED");
         }

         const fullName =
         `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim();

         const role =
         (evt.data.public_metadata?.role as
            | "viewer"
            | "delivery"
            | "admin"
            | "owner"
            | undefined) ?? null;

         const { error } = await supabaseAdmin.from("users").insert({
         clerk_id: evt.data.id,
         email,
         full_name: fullName || null,
         role,
         });

         if (error) {
         throw new Error("USER_CREATE_FAILED");
         }

         break;
      }

      case "user.updated": {
         const email = evt.data.email_addresses[0]?.email_address;

         if (!email) {
            throw new Error("USER_EMAIL_REQUIRED");
         }

         const fullName = `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim();

         const { error } = await supabaseAdmin
         .from("users")
         .update({
            email,
            full_name: fullName || null,
         })
         .eq("clerk_id", evt.data.id);

         if (error) {
            throw new Error("USER_UPDATE_FAILED");
         }

         break;
      }

      case "user.deleted": {
         const { error } = await supabaseAdmin
         .from("users")
         .update({
            clerk_deleted_at: new Date().toISOString(),
         })
         .eq("clerk_id", evt.data.id);

         if (error) {
            throw new Error("USER_DELETE_SYNC_FAILED");
         }

         break;
      }

      default:
         break;
   }

   return new Response("Webhook received", { status: 200 });
}