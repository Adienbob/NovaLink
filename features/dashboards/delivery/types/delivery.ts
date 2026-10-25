export const DELIVERY_STATUSES = [
   'assigned',
   'picked_up',
   'delivered',
   'failed',
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export function isDeliveryStatus(value: string): value is DeliveryStatus {
   return (DELIVERY_STATUSES as readonly string[]).includes(value);
}

export interface DeliveryItem {
   id: string;
   order_id: string;
   driver_id: string;
   status: DeliveryStatus;
   failure_reason?: string | null;
   notes?: string | null;
   assigned_at?: string | null;
   picked_up_at?: string | null;
   completed_at?: string | null;
   created_at: string;
   orders: {
      id: string;
      total: number;
      payment_method?: string;
      status: string;
      shipping_fee?: number;
      delivery_address_snapshot?: any; // JSON Snapshot
      notes?: string | null;
      users?: {
      full_name?: string | null;
      phone?: string | null;
      email?: string | null;
      } | null;
   } | null;
}