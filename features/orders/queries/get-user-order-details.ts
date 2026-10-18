import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { DeliveryAddressSnapshot, OrderDetails, OrderStatus } from "../types/order";

export async function getUserOrderDetails(orderId: string): Promise<OrderDetails | null> {
   // 1. التحقق من جلسة العميل في السيرفر عبر Clerk
   const { userId: clerkUserId } = await auth();

   if (!clerkUserId || !orderId) {
      return null;
   }

   console.log(clerkUserId)

   // 2. جلب ID المستخدم الداخلي المسجل بجدول users
   const { data: userRecord } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUserId)
      .single();

   if (!userRecord?.id) {
      return null;
   }

   // 3. شرط آمن مزدوج: مطابقة ID الطلب + التأكد أن الطلب ينتمي لنفس المستخدم صاحب الجلسة
   const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(`
         id,
         created_at,
         status,
         subtotal,
         shipping_fee,
         total,
         payment_method,
         delivery_address_snapshot,
         notes,
         order_items (
         id,
         product_name,
         variant_name,
         quantity,
         unit_price,
         line_total
         )
      `)
      .eq("id", orderId)
      .eq("user_id", userRecord.id)
      .single();

   if (error || !order) {
      return null;
   }

   const rawItems = (order.order_items as unknown as Array<{
      id: string;
      product_name: string;
      variant_name: string;
      quantity: number;
      unit_price: number;
      line_total: number;
   }>) || [];

   return {
      id: order.id,
      createdAt: order.created_at,
      status: order.status as OrderStatus,
      subtotal: Number(order.subtotal),
      shippingFee: Number(order.shipping_fee),
      total: Number(order.total),
      paymentMethod: order.payment_method || "COD",
      notes: order.notes,
      address: (order.delivery_address_snapshot as unknown) as DeliveryAddressSnapshot,      
      itemCount: rawItems.reduce((acc, item) => acc + item.quantity, 0),
      itemsPreview: [],
      items: rawItems.map((item) => ({
         id: item.id,
         productName: item.product_name,
         variantName: item.variant_name,
         quantity: item.quantity,
         unitPrice: Number(item.unit_price),
         lineTotal: Number(item.line_total),
      })),
   };
}