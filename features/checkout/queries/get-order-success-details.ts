import { requireUser } from "@/app/lib/auth/require-user";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export interface OrderSuccessDetails {
   id: string;
   status: string;
   paymentMethod: string;
   subtotal: number;
   shippingFee: number;
   total: number;
   notes: string | null;
   createdAt: string;
   address: {
      recipientName: string;
      phone: string;
      city: string;
      area: string;
      street: string;
      building?: string;
      floor?: string;
      apartment?: string;
      landmark?: string;
   };
   items: Array<{
      id: string;
      productName: string;
      variantName: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
   }>;
}

export async function getOrderSuccessDetails(orderId: string): Promise<OrderSuccessDetails | null> {
   try {
      const user = await requireUser();

      // Fetch order with user verification
      const { data: order, error: orderError } = await supabaseAdmin
         .from("orders")
         .select(`
         id,
         status,
         payment_method,
         subtotal,
         shipping_fee,
         total,
         notes,
         created_at,
         delivery_address_snapshot,
         order_items (
            id,
            product_name,
            variant_name,
            unit_price,
            quantity,
            line_total
         )
         `)
         .eq("id", orderId)
         .eq("user_id", user.id)
         .single();

      if (orderError || !order) {
         return null;
      }

      const snapshot = order.delivery_address_snapshot as any;

      return {
         id: order.id,
         status: order.status,
         paymentMethod: order.payment_method,
         subtotal: Number(order.subtotal),
         shippingFee: Number(order.shipping_fee),
         total: Number(order.total),
         notes: order.notes,
         createdAt: order.created_at,
         address: {
         recipientName: snapshot?.recipient_name || "",
         phone: snapshot?.phone || "",
         city: snapshot?.city || "",
         area: snapshot?.area || "",
         street: snapshot?.street || "",
         building: snapshot?.building || undefined,
         floor: snapshot?.floor || undefined,
         apartment: snapshot?.apartment || undefined,
         landmark: snapshot?.landmark || undefined,
         },
         items: (order.order_items || []).map((item: any) => ({
         id: item.id,
         productName: item.product_name,
         variantName: item.variant_name,
         unitPrice: Number(item.unit_price),
         quantity: item.quantity,
         lineTotal: Number(item.line_total),
         })),
      };
   } catch (err) {
      console.error("Error fetching order success details:", err);
      return null;
   }
}