import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
   const evt = await verifyWebhook(req);

   console.log(evt.type);

   return new Response("Webhook received", { status: 200 });
}