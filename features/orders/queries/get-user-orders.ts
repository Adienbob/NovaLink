import { auth } from "@clerk/nextjs/server";
import { OrderSummary, OrderStatus } from "../types/order";
import { supabaseAdmin } from "@/app/lib/supabase/server";

interface RawOrderResponse {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: Array<{
    quantity: number;
    product_name: string;
    variant_name: string | null; 
  }>;
}

export type GetUserOrdersResult =
  | { success: true; data: OrderSummary[]; error?: undefined }
  | { success: false; data: []; error: "UNAUTHORIZED" | "USER_NOT_FOUND" | "FETCH_FAILED" };

export async function getUserOrders(): Promise<GetUserOrdersResult> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return { success: false, data: [], error: "UNAUTHORIZED" };
  }

  // 1. جلب الـ internal user_id
  const { data: userRecord } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", clerkUserId)
    .single();

  if (!userRecord?.id) {
    return { success: false, data: [], error: "USER_NOT_FOUND" };
  }

  // 2. جلب الطلبات الخاصة بالمستخدم مع تفاصيل عناصر الطلب
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      status,
      total,
      created_at,
      order_items (
        quantity,
        product_name,
        variant_name
      )
    `)
    .eq("user_id", userRecord.id)
    .order("created_at", { ascending: false });

  if (error || !orders) {
    console.error("Error fetching user orders:", error);
    return { success: false, data: [], error: "FETCH_FAILED" };
  }

  

  // 3. تحويل البيانات وتنسيقها للـ OrderSummary UI
  const formattedOrders: OrderSummary[] = orders.map((order: RawOrderResponse) => {
    const rawItems = (order.order_items as Array<{
      quantity: number;
      product_name: string;
      variant_name: string;
    }>) || [];

    const itemCount = rawItems.reduce((acc, item) => acc + item.quantity, 0);

    // معاينة لأول 3 منتجات فقط
    const itemsPreview = rawItems.slice(0, 3).map((item) => ({
      productName: item.product_name,
      variantName: item.variant_name,
      quantity: item.quantity,
    }));

    return {
      id: order.id,
      status: order.status as OrderStatus,
      total: Number(order.total),
      createdAt: order.created_at,
      itemCount,
      itemsPreview,
    };
  });

  return { success: true, data: formattedOrders };
}