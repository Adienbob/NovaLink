import { OrderStatus } from "../types/order";

const statusConfig: Record<
   OrderStatus,
   { ar: string; en: string; class: string }
> = {
   pending_confirmation: {
      ar: "في انتظار التأكيد",
      en: "Pending Confirmation",
      class: "bg-amber-50 text-amber-800 border-amber-200",
   },
   confirmed: {
      ar: "تم التأكيد",
      en: "Confirmed",
      class: "bg-emerald-50 text-emerald-800 border-emerald-200",
   },
   processing: {
      ar: "جاري التجهيز",
      en: "Processing",
      class: "bg-blue-50 text-blue-800 border-blue-200",
   },
   shipped: {
      ar: "تم الشحن",
      en: "Shipped",
      class: "bg-purple-50 text-purple-800 border-purple-200",
   },
   delivered: {
      ar: "تم التوصيل",
      en: "Delivered",
      class: "bg-green-50 text-green-800 border-green-200",
   },
   cancelled: {
      ar: "ملغي",
      en: "Cancelled",
      class: "bg-red-50 text-red-800 border-red-200",
   },
   return_requested: {
      ar: "طلب إرجاع",
      en: "Return Requested",
      class: "bg-orange-50 text-orange-800 border-orange-200",
   },
   returned: {
      ar: "تم الإرجاع",
      en: "Returned",
      class: "bg-gray-100 text-gray-800 border-gray-300",
   },
};

interface StatusBadgeProps {
   status: OrderStatus;
   locale: string;
}

export function StatusBadge({ status, locale }: StatusBadgeProps) {
   const config = statusConfig[status] || statusConfig.pending_confirmation;
   const isAr = locale === "ar";

   return (
      <span
         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${config.class}`}
      >
         {isAr ? config.ar : config.en}
      </span>
   );
}