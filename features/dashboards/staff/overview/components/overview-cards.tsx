import { OverviewStats } from "../actions/get-overview-stats";

interface OverviewCardsProps {
   stats: OverviewStats;
}

export function OverviewCards({ stats }: OverviewCardsProps) {
   const cards = [
      {
         title: "Total Revenue",
         value: `$${stats.totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
         })}`,
         description: "Lifetime revenue from completed orders",
      },
      {
         title: "Total Orders",
         value: stats.totalOrders.toLocaleString(),
         description: "Total orders processed",
      },
      {
         title: "Delivered Orders",
         value: stats.deliveredOrders.toLocaleString(),
         description: "Successfully fulfilled orders",
      },
      {
         title: "Failed Deliveries",
         value: stats.failedDeliveries.toLocaleString(),
         description: "Deliveries marked as failed",
         alert: stats.failedDeliveries > 0,
      },
      {
         title: "Low Stock Items",
         value: stats.lowStockCount.toLocaleString(),
         description: "Variants with 5 or fewer items",
         alert: stats.lowStockCount > 0,
      },
      {
         title: "Pending Returns",
         value: stats.pendingReturnsCount.toLocaleString(),
         description: "Return requests awaiting approval",
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