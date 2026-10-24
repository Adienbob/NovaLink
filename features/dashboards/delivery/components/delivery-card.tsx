// features/dashboards/delivery/components/delivery-card.tsx
import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 1. مطابقة الواجهة بدقة مع استعلام Supabase
export interface DeliveryItem {
   id: string;
   order_id: string;
   driver_id: string;
   status: "assigned" | "picked_up" | "delivered" | "failed";
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

interface DeliveryCardProps {
   delivery: DeliveryItem;
   locale: string;
   onUpdateStatus?: (deliveryId: string, newStatus: string) => void;
   isLoading?: boolean;
}

export function DeliveryCard({
  delivery,
  locale,
  onUpdateStatus,
  isLoading = false,
}: DeliveryCardProps) {
  const isAr = locale === "ar";
  const order = delivery.orders;
  const user = order?.users;

  // 2. معالجة العنوان المأخوذ من snapshot بأمان
  const addressText = React.useMemo(() => {
    const snap = order?.delivery_address_snapshot;
    if (!snap) return isAr ? "غير محدد" : "N/A";
    if (typeof snap === "string") return snap;
    // إذا كان المكون عبارة عن كائن يحتوي تفاصيل المدينة والشارع
    const parts = [snap.city, snap.street, snap.details, snap.address_line].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : JSON.stringify(snap);
  }, [order?.delivery_address_snapshot, isAr]);

  // 3. خريطة الألوان والشارات المعتمدة في نظام التصميم
  const statusBadgeVariant = {
    assigned: "warning" as const,
    picked_up: "default" as const,
    delivered: "success" as const,
    failed: "destructive" as const,
  }[delivery.status] || "outline";

  return (
    <Card className="w-full border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-sm transition-all hover:shadow-md">
      {/* رأس البطاقة */}
      <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-[var(--border)]/50">
        <div className="flex flex-col">
          <CardTitle className="text-sm font-bold">
            {isAr ? "طلب" : "Order"} #{order?.id ? order.id.slice(0, 8) : delivery.order_id.slice(0, 8)}
          </CardTitle>
          {order?.payment_method && (
            <span className="text-[10px] text-[var(--secondary)] uppercase font-semibold mt-0.5">
              {order.payment_method}
            </span>
          )}
        </div>
        <Badge variant={statusBadgeVariant} className="capitalize text-[11px]">
          {delivery.status.replace("_", " ")}
        </Badge>
      </CardHeader>

      {/* محتوى التفاصيل */}
      <CardContent className="p-4 space-y-3 text-xs">
        {/* العميل */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[var(--secondary)] text-[11px] font-medium">
            {isAr ? "العميل" : "Customer"}
          </span>
          <span className="font-semibold text-[var(--foreground)] text-sm">
            {user?.full_name || (isAr ? "عميل غير مسمى" : "Unnamed Customer")}
          </span>
        </div>

        {/* رقم الهاتف والإتصال المباشر */}
        {user?.phone && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[var(--secondary)] text-[11px] font-medium">
              {isAr ? "رقم التواصل" : "Contact Phone"}
            </span>
            <a
              href={`tel:${user.phone}`}
              className="text-[var(--primary)] hover:underline font-mono font-bold text-sm text-start dir-ltr w-fit"
            >
              {user.phone}
            </a>
          </div>
        )}

        {/* عنوان التوصيل */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[var(--secondary)] text-[11px] font-medium">
            {isAr ? "عنوان التسليم" : "Delivery Address"}
          </span>
          <p className="text-[var(--foreground)] leading-relaxed">{addressText}</p>
        </div>

        {/* المبلغ الإجمالي */}
        {order?.total !== undefined && (
          <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center text-xs">
            <span className="text-[var(--secondary)]">{isAr ? "المبلغ الكلي" : "Total Amount"}</span>
            <span className="font-bold text-sm text-[var(--foreground)] font-mono">
              {order.total} SAR
            </span>
          </div>
        )}
      </CardContent>

      {/* أزرار الإجراءات والتحكم بالإنهاء */}
      {onUpdateStatus && delivery.status !== "delivered" && delivery.status !== "failed" && (
        <CardFooter className="p-4 pt-0 gap-2">
          {delivery.status === "assigned" && (
            <Button
              size="sm"
              className="w-full h-10 text-xs font-semibold"
              onClick={() => onUpdateStatus(delivery.id, "picked_up")}
              isLoading={isLoading}
            >
              {isAr ? "تأكيد استلام الشحنة" : "Mark as Picked Up"}
            </Button>
          )}

          {delivery.status === "picked_up" && (
            <Button
              size="sm"
              className="w-full h-10 text-xs font-semibold bg-[var(--success)] hover:opacity-90 text-white"
              onClick={() => onUpdateStatus(delivery.id, "delivered")}
              isLoading={isLoading}
            >
              {isAr ? "تأكيد التسليم للعميل" : "Complete Delivery"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}