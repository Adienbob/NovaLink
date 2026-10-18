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
      className={`max-w-4xl mx-auto p-4 sm:p-6 space-y-6 ${isAr ? "text-right" : "text-left"}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </div>

      {!success ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center text-sm">
          {t.errorText}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border rounded-lg p-10 text-center space-y-4 shadow-sm">
          <div className="text-4xl">🛍️</div>
          <h2 className="text-lg font-bold text-gray-800">{t.noOrdersTitle}</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">{t.noOrdersDesc}</p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {t.startShopping}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: OrderSummary) => (
            <div
              key={order.id}
              className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3 text-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">
                    {t.orderId} <span className="font-mono">{order.id}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.date}{" "}
                    {new Date(order.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
                <StatusBadge status={order.status} locale={locale} />
              </div>

              {/* Items Preview */}
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium text-xs text-gray-500">{t.items}</p>
                {order.itemsPreview.map((item, idx) => (
                  <p key={idx} className="text-gray-800">
                    • {item.productName} ({item.variantName}) × {item.quantity}
                  </p>
                ))}
                {order.itemCount > 3 && (
                  <p className="text-xs text-gray-500 italic">
                    + {order.itemCount - 3} {t.moreItems}
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-center border-t pt-3 text-sm">
                <div>
                  <span className="text-gray-600">{t.total} </span>
                  <span className="font-bold text-gray-900">
                    {order.total.toFixed(2)} {t.currency}
                  </span>
                </div>
                <Link
                  href={`/${locale}/account/orders/${order.id}`}
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-md text-xs font-semibold transition-colors"
                >
                  {t.viewDetails}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


