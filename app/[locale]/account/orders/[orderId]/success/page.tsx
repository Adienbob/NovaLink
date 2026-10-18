import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserOrderDetails } from "@/features/orders/queries/get-user-order-details";

interface PageProps {
  params: Promise<{
    locale: string;
    orderId: string;
  }>;
}

export default async function OrderSuccessPage({ params }: PageProps) {
  const { locale, orderId } = await params;
  const isAr = locale === "ar";

  const order = await getUserOrderDetails(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="bg-card border rounded-2xl p-6 sm:p-10 text-center shadow-sm space-y-6">
        
        {/* Success Icon (Check) */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full animate-in zoom-in-50 duration-300">
          <svg
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {isAr ? "تم إرسال طلبك بنجاح!" : "Order Placed Successfully!"}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {isAr
              ? "شكراً لتسوقك معنا. سنبدأ بتجهيز طلبك وسيتم التواصل معك عند الشحن."
              : "Thank you for shopping with us. We are processing your order and will notify you once shipped."}
          </p>
        </div>

        {/* Order Quick Summary Box */}
        <div className="bg-muted/50 rounded-xl p-4 text-start space-y-3 border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {isAr ? "رقم الطلب:" : "Order ID:"}
            </span>
            <span className="font-mono font-semibold text-xs sm:text-sm">
              #{order.id}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {isAr ? "حالة الطلب:" : "Status:"}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {isAr ? "قيد الانتظار" : "Pending"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <span className="font-medium">
              {isAr ? "الإجمالي:" : "Total Amount:"}
            </span>
            <span className="font-bold text-base">
              {order.total} {isAr ? "ج.م" : "EGP"}
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href={`/${locale}/account/orders/${order.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            {/* Package Icon */}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>{isAr ? "عرض تفاصيل الطلب" : "View Order Details"}</span>
          </Link>

          <Link
            href={`/${locale}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border font-medium rounded-xl hover:bg-muted transition-colors text-sm"
          >
            <span>{isAr ? "متابعة التسوق" : "Continue Shopping"}</span>
            {/* Arrow Icon based on locale */}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isAr ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              )}
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}