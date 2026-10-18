export type OrderStatus = "pending_confirmation" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned" | "return_requested";
export interface OrderItem {
   id: string;
   productName: string;
   variantName: string;
   quantity: number;
   unitPrice: number;
   lineTotal: number;
}

export interface DeliveryAddressSnapshot {
   recipientName: string;
   phone: string;
   street: string;
   area: string;
   city: string;
   building?: string;
   floor?: string;
   apartment?: string;
   landmark?: string;
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  itemCount: number;
  itemsPreview: Array<{
    productName: string;
    variantName: string;
    quantity: number;
  }>;
  // جعل الخصائص الفرعية اختيارية بأقواس الاستفهام (?)
  subtotal?: number;
  shippingFee?: number;
  paymentMethod?: string;
}

export interface OrderDetails extends OrderSummary {
   address: DeliveryAddressSnapshot;
   notes: string | null;
   items: OrderItem[];
}