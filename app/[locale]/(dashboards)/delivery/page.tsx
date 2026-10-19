import { DeliveryCard } from "@/features/dashboards/delivery/components/delivery-card";
import { getDriverDeliveries } from "@/features/dashboards/delivery/queries/get-driver-deliveries";

interface DeliveryPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function DeliveryDashboardPage({ params }: DeliveryPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  
  // 1. جلب شحنات المندوب
  const deliveries = await getDriverDeliveries();

  // 2. تصنيف الشحنات حسب الحالات الأربع
  const mustPick = deliveries.filter((d) => d.status === "assigned");
  const pickedUp = deliveries.filter((d) => d.status === "picked_up");
  const delivered = deliveries.filter((d) => d.status === "delivered");
  const failed = deliveries.filter((d) => d.status === "failed");

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {isAr ? "لوحة مهام التوصيل" : "Delivery Dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isAr
            ? "متابعة وإدارة الشحنات اليومية والتحديث الميداني للحالات"
            : "Manage daily orders, pickup statuses, and delivery confirmations"}
        </p>
      </div>

      {/* Grid for the 4 Delivery Operational States */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Column 1: Must Pick */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-amber-500/10 text-amber-600 dark:text-amber-400 p-3 rounded-lg border border-amber-500/20">
            <h2 className="font-bold text-sm">
              {isAr ? "بانتظار الاستلام" : "Must Pick"}
            </h2>
            <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-mono font-bold">
              {mustPick.length}
            </span>
          </div>
          <div className="space-y-3">
            {mustPick.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                {isAr ? "لا توجد طلبات جديدة للإسناد" : "No orders awaiting pickup"}
              </p>
            ) : (
              mustPick.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} locale={locale} />
              ))
            )}
          </div>
        </div>

        {/* Column 2: Picked Up */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-blue-500/10 text-blue-600 dark:text-blue-400 p-3 rounded-lg border border-blue-500/20">
            <h2 className="font-bold text-sm">
              {isAr ? "جاري التوصيل" : "Picked Up"}
            </h2>
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-mono font-bold">
              {pickedUp.length}
            </span>
          </div>
          <div className="space-y-3">
            {pickedUp.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                {isAr ? "لا توجد شحنات قيد التوصيل حالياً" : "No active deliveries in transit"}
              </p>
            ) : (
              pickedUp.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} locale={locale} />
              ))
            )}
          </div>
        </div>

        {/* Column 3: Delivered */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg border border-emerald-500/20">
            <h2 className="font-bold text-sm">
              {isAr ? "تم التسليم" : "Delivered"}
            </h2>
            <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-mono font-bold">
              {delivered.length}
            </span>
          </div>
          <div className="space-y-3">
            {delivered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                {isAr ? "لا توجد شحنات مكتملة" : "No delivered orders yet"}
              </p>
            ) : (
              delivered.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} locale={locale} />
              ))
            )}
          </div>
        </div>

        {/* Column 4: Failed / Refused */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-rose-500/10 text-rose-600 dark:text-rose-400 p-3 rounded-lg border border-rose-500/20">
            <h2 className="font-bold text-sm">
              {isAr ? "تعذر التسليم" : "Failed / Refused"}
            </h2>
            <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-mono font-bold">
              {failed.length}
            </span>
          </div>
          <div className="space-y-3">
            {failed.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                {isAr ? "لا توجد شحنات مرتجعة أو فاشلة" : "No failed delivery attempts"}
              </p>
            ) : (
              failed.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} locale={locale} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}