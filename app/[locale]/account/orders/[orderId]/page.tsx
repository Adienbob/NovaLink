import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserOrderDetails } from "@/features/orders/queries/get-user-order-details";
import { StatusBadge } from "@/features/orders/components/status-badge";
import { CancelOrderButton } from "@/features/orders/components/cancel-order-button";
import { OrderItem } from "@/features/orders/types/order";
import { ReturnRequestButton } from "@/features/orders/components/return-requesr-button";

interface PageProps {
  params: Promise<{
    locale: string;
    orderId: string;
  }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { locale, orderId } = await params;
  const isAr = locale === "ar";

  
  const order = await getUserOrderDetails(orderId);
  
  if (!order) {
    notFound();
  }

  // الشروط الخاصة بإظهار الإجراءات المتاحة للطلب
  const isCancellable = ["pending_confirmation", "confirmed"].includes(order.status);
  const isReturnable = order.status === "delivered";

  const t = {
    backToOrders: isAr ? "← العودة إلى جميع الطلبات" : "← Back to all orders",
    orderTitle: isAr ? "تفاصيل الطلب" : "Order Details",
    deliveryDetails: isAr ? "عنوان وتفاصيل التوصيل" : "Delivery Details",
    recipient: isAr ? "اسم المستلم:" : "Recipient:",
    phone: isAr ? "رقم الهاتف:" : "Phone:",
    address: isAr ? "العنوان:" : "Address:",
    buildingDetails: isAr ? "تفاصيل المبنى:" : "Building Details:",
    building: isAr ? "مبنى" : "Building",
    floor: isAr ? "دور" : "Floor",
    apartment: isAr ? "شقة" : "Apt",
    landmark: isAr ? "علامة مميزة:" : "Landmark:",
    notes: isAr ? "ملاحظات التوصيل:" : "Notes:",
    orderItems: isAr ? "منتجات الطلب" : "Order Items",
    variant: isAr ? "النوع:" : "Variant:",
    subtotal: isAr ? "المجموع الفرعي:" : "Subtotal:",
    shippingFee: isAr ? "مصاريف الشحن:" : "Shipping Fee:",
    total: isAr ? "الإجمالي:" : "Total:",
    paymentMethod: isAr ? "طريقة الدفع:" : "Payment Method:",
    cod: isAr ? "الدفع عند الاستلام (COD)" : "Cash on Delivery (COD)",
    currency: isAr ? "ج.م" : "EGP",
  };

  return (
    <div
      className={`max-w-3xl mx-auto p-4 sm:p-6 space-y-6 ${isAr ? "text-right" : "text-left"}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <Link
        href={`/${locale}/account/orders`}
        className="text-xs font-semibold text-gray-600 hover:text-black transition-colors"
      >
        {t.backToOrders}
      </Link>

      <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t.orderTitle}</h1>
          <p className="text-xs text-gray-500 font-mono mt-0.5">{order.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} locale={locale} />
          {isCancellable && (
            <CancelOrderButton orderId={order.id} locale={locale} />
          )}
          {isReturnable && (
            <ReturnRequestButton orderId={order.id} locale={locale} />
          )}
        </div>
      </div>

      {/* Delivery Details Snapshot */}
      <div className="bg-white border p-5 rounded-lg space-y-2 shadow-sm text-sm text-gray-700">
        <h2 className="font-bold border-b pb-2 text-gray-900">{t.deliveryDetails}</h2>
        <p>
          <strong>{t.recipient}</strong> {order.address.recipientName}
        </p>
        <p>
          <strong>{t.phone}</strong> {order.address.phone}
        </p>
        <p>
          <strong>{t.address}</strong> {order.address.street}، {order.address.area}، {order.address.city}
        </p>
        {(order.address.building || order.address.floor || order.address.apartment) && (
          <p>
            <strong>{t.buildingDetails}</strong> {t.building} {order.address.building || "-"}، {t.floor}{" "}
            {order.address.floor || "-"}، {t.apartment} {order.address.apartment || "-"}
          </p>
        )}
        {order.address.landmark && (
          <p>
            <strong>{t.landmark}</strong> {order.address.landmark}
          </p>
        )}
        {order.notes && (
          <p>
            <strong>{t.notes}</strong> {order.notes}
          </p>
        )}
      </div>

      {/* Items Table */}
      <div className="bg-white border p-5 rounded-lg space-y-4 shadow-sm text-sm">
        <h2 className="font-bold border-b pb-2 text-gray-900">{t.orderItems}</h2>
        <div className="divide-y">
          {order.items.map((item: OrderItem) => (
            <div key={item.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{item.productName}</p>
                <p className="text-xs text-gray-500">
                  {t.variant} {item.variantName} × {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                {item.lineTotal.toFixed(2)} {t.currency}
              </p>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="border-t pt-4 space-y-2 text-sm bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between text-gray-600">
            <span>{t.subtotal}</span>
            <span>{order.subtotal?.toFixed(2)} {t.currency}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>{t.shippingFee}</span>
            <span>{order.shippingFee?.toFixed(2)} {t.currency}</span>
          </div>
          <hr />
          <div className="flex justify-between text-base font-bold text-gray-900">
            <span>{t.total}</span>
            <span>{order.total.toFixed(2)} {t.currency}</span>
          </div>
          <div className="text-xs text-gray-500 pt-1">
            {t.paymentMethod} <strong>{t.cod}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}