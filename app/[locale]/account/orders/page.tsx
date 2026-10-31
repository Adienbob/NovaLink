import { StatusBadge } from "@/features/orders/components/status-badge";
import { getUserOrders } from "@/features/orders/queries/get-user-orders";
import { OrderSummary } from "@/features/orders/types/order";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AccountOrdersPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const { success, data: orders, error } = await getUserOrders();

  if (error === "UNAUTHORIZED") {
    redirect(`/${locale}/sign-in`);
  }

  const t = {
    title: isAr ? "طلباتي" : "My Orders",
    subtitle: isAr ? "عرض ومتابعة حالة مشترياتك السابقة" : "View and track your previous purchases",
    noOrdersTitle: isAr ? "لا توجد طلبات حتى الآن" : "No orders found yet",
    noOrdersDesc: isAr
      ? "لم تقم بإنشاء أي طلبات حتى الآن. ابدأ التسوق واستمتع بمنتجاتنا!"
      : "You haven't placed any orders yet. Start shopping and enjoy our catalog!",
    startShopping: isAr ? "ابدأ التسوق الآن" : "Start Shopping",
    orderId: isAr ? "رقم الطلب:" : "Order ID:",
    date: isAr ? "التاريخ:" : "Date:",
    items: isAr ? "المنتجات:" : "Items:",
    moreItems: isAr ? "عناصر أخرى" : "more items",
    total: isAr ? "الإجمالي:" : "Total:",
    currency: isAr ? "ج.م" : "EGP",
    viewDetails: isAr ? "عرض التفاصيل" : "View Details",
    errorText: isAr
      ? "حدث خطأ أثناء جلب الطلبات. يرجى المحاولة لاحقاً."
      : "An error occurred while loading orders. Please try again later.",
  };

  return (
    <div
      className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Page Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.subtitle}
        </p>
      </div>
    </div>

      </header>

    {/* Error State */}
    {!success ? ( <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive"> <span className="text-xl">⚠️</span> <p>{t.errorText}</p> </div>
    ) : orders.length === 0 ? (
    /* Empty State */ <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm"> <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-4xl">
    🛍️ </div>

      <h2 className="mt-6 text-xl font-bold text-card-foreground">
        {t.noOrdersTitle}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        {t.noOrdersDesc}
      </p>

      <Link
        href={`/${locale}`}
        className="mt-7 inline-flex items-center justify-center rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow-md"
      >
        {t.startShopping}
      </Link>
    </div>

    ) : (
    /* Orders List */ <div className="space-y-5">
    {orders.map((order: OrderSummary) => ( <article
          key={order.id}
          className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
        >
    {/* Order Header */} <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-muted/30 px-5 py-4 sm:px-6"> <div className="space-y-1.5"> <p className="text-xs font-medium text-muted-foreground">
    {t.orderId} </p>

              <p className="font-mono text-sm font-bold text-foreground">
                #{order.id}
              </p>

              <p className="text-xs text-muted-foreground">
                {t.date}{" "}
                {new Date(order.createdAt).toLocaleDateString(
                  isAr ? "ar-EG" : "en-US",
                  { dateStyle: "medium" }
                )}
              </p>
            </div>

            <StatusBadge status={order.status} locale={locale} />
          </div>

          {/* Order Items */}
          <div className="space-y-3 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.items}
              </h3>

              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {order.itemCount}
              </span>
            </div>

            <div className="space-y-3">
              {order.itemsPreview.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.variantName}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-lg bg-muted/60 px-2.5 py-1 text-xs font-semibold text-foreground">
                    × {item.quantity}
                  </span>
                </div>
              ))}

              {order.itemCount > 3 && (
                <p className="border-t border-dashed border-border pt-3 text-xs text-primary">
                  + {order.itemCount - 3} {t.moreItems}
                </p>
              )}
            </div>
          </div>

          {/* Order Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs text-muted-foreground">{t.total}</p>

              <p className="mt-1 text-lg font-bold text-foreground">
                {order.total.toFixed(2)}{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  {t.currency}
                </span>
              </p>
            </div>

            <Link
              href={`/${locale}/account/orders/${order.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              {t.viewDetails}
              <span aria-hidden="true">
                {isAr ? "←" : "→"}
              </span>
            </Link>
          </div>
        </article>
      ))}
    </div>

    )}

    </div>

  );
}


