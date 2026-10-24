import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderSuccessDetails } from "@/features/checkout/queries/get-order-success-details";
import { Button } from "@/components/ui/button";

interface OrderSuccessPageProps {
  params: Promise<{
    locale: string;
    orderId: string;
  }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { locale, orderId } = await params;
  const isAr = locale === "ar";

  const order = await getOrderSuccessDetails(orderId);

  if (!order) {
    notFound();
  }

  return (
    <main className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="rounded-lg border border-border bg-surface p-8 text-center space-y-6 shadow-sm">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-3xl">
          ✓
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {isAr ? "تم استلام طلبك بنجاح!" : "Order Placed Successfully!"}
          </h1>
          <p className="text-sm text-secondary">
            {isAr
              ? "شكراً لتسوقك معنا. سنقوم بتجهيز طلبك وشحنه في أقرب وقت."
              : "Thank you for shopping with us. We are preparing your order for shipment."}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="rounded-md border border-border bg-background p-4 space-y-3 text-start text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-secondary">{isAr ? "رقم الطلب:" : "Order ID:"}</span>
            <span className="font-mono font-bold text-foreground">{order.id}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-secondary">{isAr ? "إجمالي المبلغ:" : "Total Amount:"}</span>
            <span className="font-mono font-bold text-foreground">
              {Number(order.total).toFixed(2)} {isAr ? "ج.م" : "EGP"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">{isAr ? "طريقة الدفع:" : "Payment Method:"}</span>
            <span className="font-semibold text-foreground">
              {isAr ? "الدفع عند الاستلام (COD)" : "Cash on Delivery"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/${locale}/account/orders`}>
              {isAr ? "عرض كل طلباتي" : "View My Orders"}
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href={`/${locale}`}>
              {isAr ? "متابعة التسوق" : "Continue Shopping"}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}