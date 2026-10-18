"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { z } from "zod";

const uuidSchema = z.string().uuid();

export async function cancelOrder(
  orderId: string,
  locale?: string // 👈 إضافة الـ locale كمعامل اختياري أو إجباري
): Promise<{ success: boolean; error?: string }> {
  // 1. Validate UUID
  const parsed = uuidSchema.safeParse(orderId);
  if (!parsed.success) {
    return { success: false, error: "INVALID_ORDER_ID" };
  }

  // 2. Authenticate
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  // 3. Resolve internal user
  const { data: userRecord } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", clerkUserId)
    .maybeSingle();

  if (!userRecord?.id) {
    return { success: false, error: "USER_NOT_FOUND" };
  }

  // 4. Atomic Conditional Update (يمنع Race Condition)
  const { data: updatedOrder, error: updateError } = await supabaseAdmin
    .from("orders")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data)
    .eq("user_id", userRecord.id)
    .in("status", ["pending_confirmation", "confirmed"]) 
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("Error cancelling order:", updateError);
    return { success: false, error: "CANCEL_FAILED" };
  }

  if (!updatedOrder) {
    return { success: false, error: "ORDER_NOT_CANCELLABLE" };
  }

  // 5. Revalidate (التحديث المضمون)
  if (locale) {
    // تحديث مسار اللغة المحددة
    revalidatePath(`/${locale}/account/orders`);
    revalidatePath(`/${locale}/account/orders/${parsed.data}`);
  } else {
    // تحديث كافة مسارات الصفحة بغض النظر عن اللغة باستخدام نوع الصفحة 'page'
    revalidatePath("/[locale]/account/orders", "page");
    revalidatePath(`/[locale]/account/orders/${parsed.data}`, "page");
  }

  return { success: true };
}