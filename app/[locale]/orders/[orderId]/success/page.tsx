import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderSuccessDetails } from "@/features/checkout/queries/get-order-success-details";

interface PageProps {
  params: Promise<{
    orderId: string;
    locale: string;
  }>;
}

export default async function OrderSuccessPage({ params }: PageProps) {
  const { orderId, locale } = await params;
  const order = await getOrderSuccessDetails(orderId);

  if (!order) {
    notFound();
  }

  const isAr = locale === "ar";

  // Dict بسيط للترجمة الحالية دون التعارض مع i18n framework الخاص بالمشروع
  const t = {
    title: isAr ? "تم استلام طلبك بنجاح!" : "Order Placed Successfully!",
    orderNumberLabel: isAr
      ? "شكراً لتسوقك معنا. رقم الطلب الخاص بك هو:"
      : "Thank you for shopping with us. Your order ID is:",
    deliveryDetailsHeader: isAr ? "تفاصيل العنوان والتوصيل" : "Delivery Details",
    recipientName: isAr ? "اسم المستلم:" : "Recipient Name:",
    phone: isAr ? "رقم الهاتف:" : "Phone Number:",
    address: isAr ? "العنوان:" : "Address:",
    buildingDetails: isAr ? "تفاصيل المبنى:" : "Building Details:",
    building: isAr ? "مبنى" : "Building",
    floor: isAr ? "دور" : "Floor",
    apartment: isAr ? "شقة" : "Apt",
    landmark: isAr ? "علامة مميزة:" : "Landmark:",
    notes: isAr ? "ملاحظات التوصيل:" : "Delivery Notes:",
    orderItemsHeader: isAr ? "عناصر الطلب" : "Order Items",
    variant: isAr ? "النوع:" : "Variant:",
    subtotal: isAr ? "المجموع الفرعي:" : "Subtotal:",
    shippingFee: isAr ? "مصاريف الشحن:" : "Shipping Fee:",
    total: isAr ? "الإجمالي:" : "Total:",
    paymentMethod: isAr ? "طريقة الدفع:" : "Payment Method:",
    cod: isAr ? "الدفع عند الاستلام (COD)" : "Cash on Delivery (COD)",
    currency: isAr ? "ج.م" : "EGP",
    backHome: isAr ? "العودة للرئيسية" : "Back to Home",
  };

  return (
    <div
      className={`max-w-3xl mx-auto p-6 space-y-8 ${isAr ? "text-right" : "text-left"}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Header Banner */}
      <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center space-y-2">
        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-green-800">{t.title}</h1>
        <p className="text-sm text-green-700">
          {t.orderNumberLabel}{" "}
          <span className="font-mono font-bold select-all">{order.id}</span>
        </p>
      </div>

      {/* Delivery Snapshot Summary */}
      <div className="border p-5 rounded-lg space-y-3 bg-white shadow-sm">
        <h2 className="text-lg font-bold border-b pb-2">{t.deliveryDetailsHeader}</h2>
        <div className="text-sm text-gray-700 space-y-1.5">
          <p>
            <strong>{t.recipientName}</strong> {order.address.recipientName}
          </p>
          <p>
            <strong>{t.phone}</strong> {order.address.phone}
          </p>
          <p>
            <strong>{t.address}</strong> {order.address.street}، {order.address.area}، {order.address.city}
          </p>
          {(order.address.building || order.address.floor || order.address.apartment) && (
            <p>
              <strong>{t.buildingDetails}</strong> {t.building} {order.address.building || "-"}، {t.floor} {order.address.floor || "-"}، {t.apartment} {order.address.apartment || "-"}
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
      </div>

      {/* Order Items Table */}
      <div className="border p-5 rounded-lg space-y-4 bg-white shadow-sm">
        <h2 className="text-lg font-bold border-b pb-2">{t.orderItemsHeader}</h2>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center text-sm">
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

        {/* Pricing Summary */}
        <div className="border-t pt-4 space-y-2 text-sm bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between text-gray-600">
            <span>{t.subtotal}</span>
            <span>
              {order.subtotal.toFixed(2)} {t.currency}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>{t.shippingFee}</span>
            <span>
              {order.shippingFee.toFixed(2)} {t.currency}
            </span>
          </div>
          <hr />
          <div className="flex justify-between text-base font-bold text-gray-900">
            <span>{t.total}</span>
            <span>
              {order.total.toFixed(2)} {t.currency}
            </span>
          </div>
          <div className="text-xs text-gray-500 pt-1">
            {t.paymentMethod} <strong>{t.cod}</strong>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="flex gap-4 justify-center">
        <Link
          href={`/${locale}`}
          className="bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {t.backHome}
        </Link>
      </div>
    </div>
  );
}