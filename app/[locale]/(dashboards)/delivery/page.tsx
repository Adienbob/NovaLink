import { DeliveryCard } from "@/features/dashboards/delivery/components/delivery-card";
import { getDriverDeliveries } from "@/features/dashboards/delivery/queries/get-driver-deliveries";
import { Badge } from "@/components/ui/badge";

interface DeliveryPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function DeliveryDashboardPage({ params }: DeliveryPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  // 1. جلب شحنات المندوب (الحفاظ على الاستعلام الحالي)
  const deliveries = await getDriverDeliveries();

  // 2. تصنيف الشحنات حسب الحالات الأربع
  const mustPick = deliveries.filter((d) => d.status === "assigned");
  const pickedUp = deliveries.filter((d) => d.status === "picked_up");
  const delivered = deliveries.filter((d) => d.status === "delivered");
  const failed = deliveries.filter((d) => d.status === "failed");

  // تعريف إعدادات الأعمدة للتكرار المنظم
  const columns = [
    {
      id: "must_pick",
      title: isAr ? "بانتظار الاستلام" : "Must Pick",
      count: mustPick.length,
      items: mustPick,
      emptyText: isAr ? "لا توجد طلبات جديدة للإسناد" : "No orders awaiting pickup",
      headerBg: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
      badgeVariant: "warning" as const,
    },
    {
      id: "picked_up",
      title: isAr ? "جاري التوصيل" : "Picked Up",
      count: pickedUp.length,
      items: pickedUp,
      emptyText: isAr ? "لا توجد شحنات قيد التوصيل حالياً" : "No active deliveries in transit",
      headerBg: "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20",
      badgeVariant: "default" as const,
    },
    {
      id: "delivered",
      title: isAr ? "تم التسليم" : "Delivered",
      count: delivered.length,
      items: delivered,
      emptyText: isAr ? "لا توجد شحنات مكتملة" : "No delivered orders yet",
      headerBg: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
      badgeVariant: "success" as const,
    },
    {
      id: "failed",
      title: isAr ? "تعذر التسليم" : "Failed / Refused",
      count: failed.length,
      items: failed,
      emptyText: isAr ? "لا توجد شحنات مرتجعة أو فاشلة" : "No failed delivery attempts",
      headerBg: "bg-[var(--destructive)]/10 text-[var(--destructive)] border-[var(--destructive)]/20",
      badgeVariant: "destructive" as const,
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Header Section */}
      <div className="border-b border-[var(--border)] pb-4 space-y-1">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)]">
          {isAr ? "لوحة مهام التوصيل" : "Delivery Dashboard"}
        </h1>
        <p className="text-xs md:text-sm text-[var(--secondary)]">
          {isAr
            ? "متابعة وإدارة الشحنات اليومية والتحديث الميداني للحالات"
            : "Manage daily orders, pickup statuses, and delivery confirmations"}
        </p>
      </div>

      {/* Responsive Operational Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {columns.map((col) => (
          <div key={col.id} className="space-y-3">
            {/* Column Header */}
            <div
              className={`flex items-center justify-between p-3 rounded-lg border font-medium text-sm transition-colors ${col.headerBg}`}
            >
              <h2 className="font-semibold text-sm">{col.title}</h2>
              <Badge variant={col.badgeVariant} className="font-mono text-xs">
                {col.count}
              </Badge>
            </div>

            {/* Delivery Task Cards List */}
            <div className="space-y-3">
              {col.items.length === 0 ? (
                <div className="flex items-center justify-center py-8 px-4 border border-dashed border-[var(--border)] rounded-lg bg-[var(--surface)] text-center">
                  <p className="text-xs text-[var(--secondary)]">{col.emptyText}</p>
                </div>
              ) : (
                col.items.map((delivery) => (
                  <DeliveryCard key={delivery.id} delivery={delivery} locale={locale} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}