"use server";

import { requireUser } from "@/app/lib/auth/require-user";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { checkoutInputSchema, type CheckoutInput } from "../schemas/checkout-schema";

type CreateOrderResult =
   | { success: true; order_id: string; is_retry: boolean }
   | {
         success: false;
         code: string;
         message: string;
         variant_id?: string;
         new_price?: number;
      };

export async function createOrder(rawInput: CheckoutInput) {
   try {
      // 1. Authenticate user & get Supabase UUID
      const user = await requireUser();

      // 2. Validate input against Zod schema
      const parsed = checkoutInputSchema.safeParse(rawInput);
      if (!parsed.success) {
         return {
         success: false as const,
         code: "INVALID_INPUT",
         message: "برجاء التأكد من صحة البيانات المدخلة.",
         errors: parsed.error.flatten().fieldErrors,
         };
      }

      const input = parsed.data;

      // 3. Format items array for PostgreSQL JSONB parameter
      const formattedItems = input.items.map((item) => ({
         variant_id: item.variantId,
         quantity: item.quantity,
         expected_price: item.expectedPrice,
      }));

      // 4. Call Stored Procedure in PostgreSQL (Atomic Transaction)
      const { data, error } = await supabaseAdmin.rpc(
         "create_order_transaction",
         {
         p_user_id: user.id,
         p_idempotency_key: input.idempotencyKey,
         p_governorate_id: input.governorateId,
         p_city: input.city,
         p_area: input.area,
         p_street: input.street,
         p_building: input.building ?? null,
         p_floor: input.floor ?? null,
         p_apartment: input.apartment ?? null,
         p_landmark: input.landmark ?? null,
         p_recipient_name: input.recipientName,
         p_phone: input.phone,
         p_notes: input.notes ?? null,
         p_items: formattedItems,
         }
      );

      if (error) {
         console.error("RPC Error during create_order_transaction:", error);
         return {
         success: false as const,
         code: "SERVER_ERROR",
         message: "حدث خطأ غير متوقع أثناء حفظ الطلب. برجاء المحاولة لاحقاً.",
         };
      }
      
      const result = data as CreateOrderResult | null;
      
      // 5. Handle Stored Procedure Failures (Price change, Out of stock, etc.)
      if (!result) {
         return {
            success: false as const,
            code: "EMPTY_RESPONSE",
            message: "لم يتم استلام رد من الخادم. برجاء المحاولة لاحقاً.",
         };
      }

      // 5. Handle Stored Procedure Failures (Price change, Out of stock, etc.)
      if (!result.success) {
         return {
            success: false as const,
            code: result.code,
            message: result.message,
            variantId: result.variant_id,
            newPrice: result.new_price,
         };
      }

      // 6. من هنا result = النوع الناجح، فمسح الـ cart بيحصل عند النجاح بس
      const { error: clearCartError } = await supabaseAdmin
         .from("cart_items")
         .delete()
         .eq("user_id", user.id);

      if (clearCartError) {
         console.warn("Order was created successfully, but clearing DB cart failed:", clearCartError);
      }

      return {
         success: true as const,
         orderId: result.order_id,
         isRetry: result.is_retry,
      };
      
   } catch (err: any) {
      if (err.message === "UNAUTHORIZED" || err.message === "USER_NOT_FOUND") {
         return {
         success: false as const,
         code: "UNAUTHORIZED",
         message: "برجاء تسجيل الدخول أولاً لتأكيد الطلب.",
         };
      }

      console.error("Unexpected error in createOrder action:", err);
      return {
         success: false as const,
         code: "UNKNOWN_ERROR",
         message: "حدث خطأ أثناء معالجة الطلب.",
      };
   }
}