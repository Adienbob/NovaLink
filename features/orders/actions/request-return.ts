"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { z } from "zod";

const uuidSchema = z.string().uuid();
const reasonSchema = z
  .string()
  .trim()
  .min(10, "REASON_TOO_SHORT")
  .max(500, "REASON_TOO_LONG");

// عدد الأيام المسموح بها للإرجاع
const RETURN_WINDOW_DAYS = 14;

export async function requestReturn(
  orderId: string,
  reason: string,
  locale?: string
): Promise<{ success: boolean; error?: string }> {
  // 1. Validate Input
  const parsedOrderId = uuidSchema.safeParse(orderId);
  const parsedReason = reasonSchema.safeParse(reason);

  if (!parsedOrderId.success) {
    return { success: false, error: "INVALID_ORDER_ID" };
  }

  if (!parsedReason.success) {
    return { success: false, error: parsedReason.error.issues[0]?.message || "INVALID_REASON" };
  }

  // 2. Authenticate
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  // 3. Resolve Internal User
  const { data: userRecord } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", clerkUserId)
    .maybeSingle();

  if (!userRecord?.id) {
    return { success: false, error: "USER_NOT_FOUND" };
  }

  // 4. Calculate the earliest allowed delivery date
  const returnWindowDate = new Date();
  returnWindowDate.setDate(returnWindowDate.getDate() - RETURN_WINDOW_DAYS);
  const returnWindowISO = returnWindowDate.toISOString();

  // 5. Atomic Conditional Update
  // الشروط:
  // - ملكية المستخدم
  // - الحالة = delivered
  // - تاريخ التسليم خلال آخر 14 يوم
  const { data: updatedOrder, error: updateError } = await supabaseAdmin
    .from("orders")
    .update({
      status: "return_requested",
      notes: `[Return Reason]: ${parsedReason.data}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsedOrderId.data)
    .eq("user_id", userRecord.id)
    .eq("status", "delivered")
    .gte("updated_at", returnWindowISO) // ← فحص المدة الزمنية
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("Error requesting return:", updateError);
    return { success: false, error: "RETURN_FAILED" };
  }

  if (!updatedOrder) {
    return { success: false, error: "ORDER_NOT_ELIGIBLE_FOR_RETURN" };
  }

  // 6. Cache Revalidation
  if (locale) {
    revalidatePath(`/${locale}/account/orders`);
    revalidatePath(`/${locale}/account/orders/${parsedOrderId.data}`);
  } else {
    revalidatePath("/[locale]/account/orders", "page");
    revalidatePath(`/[locale]/account/orders/${parsedOrderId.data}`, "page");
  }

  return { success: true };
}