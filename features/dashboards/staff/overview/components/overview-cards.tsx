import { OverviewStats } from "../actions/get-overview-stats";
import { useTranslations } from "next-intl"; // Or getTranslations if server component

interface OverviewCardsProps {
   stats: OverviewStats;
}

export function OverviewCards({ stats }: OverviewCardsProps) {
   const t = useTranslations("StaffOverview");

   const cards = [
      {
         title: t("totalRevenueTitle"),
         value: `$${stats.totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
         })}`,
         description: t("totalRevenueDesc"),
      },
      {
         title: t("totalOrdersTitle"),
         value: stats.totalOrders.toLocaleString(),
         description: t("totalOrdersDesc"),
      },
      {
         title: t("deliveredOrdersTitle"),
         value: stats.deliveredOrders.toLocaleString(),
         description: t("deliveredOrdersDesc"),
      },
      {
         title: t("failedDeliveriesTitle"),
         value: stats.failedDeliveries.toLocaleString(),
         description: t("failedDeliveriesDesc"),
         alert: stats.failedDeliveries > 0,
      },
      {
         title: t("lowStockTitle"),
         value: stats.lowStockCount.toLocaleString(),
         description: t("lowStockDesc"),
         alert: stats.lowStockCount > 0,
      },
      {
         title: t("pendingReturnsTitle"),
         value: stats.pendingReturnsCount.toLocaleString(),
         description: t("pendingReturnsDesc"),
         alert: stats.pendingReturnsCount > 0,
      },
   ];

   return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
         {cards.map((card) => (
            <div
               key={card.title}
               className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm"
            >
               <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
               </p>
               <p
                  className={`mt-2 text-3xl font-bold ${
                     card.alert ? "text-destructive" : ""
                  }`}
               >
                  {card.value}
               </p>
               <p className="mt-1 text-xs text-muted-foreground">
                  {card.description}
               </p>
            </div>
         ))}
      </div>
   );
}