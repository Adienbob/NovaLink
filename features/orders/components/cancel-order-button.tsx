"use client";

import { useState, useTransition } from "react";
import { cancelOrder } from "../actions/cancel-order";

interface CancelOrderButtonProps {
  orderId: string;
  locale: string;
}

export function CancelOrderButton({ orderId, locale }: CancelOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isAr = locale === "ar";

  const t = {
    cancelBtn: isAr ? "إلغاء الطلب" : "Cancel Order",
    confirmTitle: isAr ? "هل أنت تأكد من إلغاء الطلب؟" : "Are you sure you want to cancel this order?",
    confirmDesc: isAr
      ? "سيتم إلغاء الطلب فوراً ولا يمكن التراجع عن هذا الإجراء."
      : "This order will be cancelled immediately and this action cannot be undone.",
    confirmAction: isAr ? "نعم، إلغاء الطلب" : "Yes, Cancel Order",
    keepOrder: isAr ? "تراجع" : "Go Back",
    cancelling: isAr ? "جاري الإلغاء..." : "Cancelling...",
    genericError: isAr ? "حدث خطأ أثناء إلغاء الطلب. يرجى إعادة المحاولة." : "Failed to cancel the order. Please try again.",
  };

  const handleCancel = () => {
    setError(null);
    startTransition(async () => {
      const res = await cancelOrder(orderId);
      if (!res.success) {
        setError(t.genericError);
      } else {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 border border-red-300 text-red-600 rounded-md text-xs font-semibold hover:bg-red-50 transition-colors"
      >
        {t.cancelBtn}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className={`bg-white rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl ${
              isAr ? "text-right" : "text-left"
            }`}
            dir={isAr ? "rtl" : "ltr"}
          >
            <h3 className="text-lg font-bold text-gray-900">{t.confirmTitle}</h3>
            <p className="text-sm text-gray-600">{t.confirmDesc}</p>

            {error && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
              >
                {t.keepOrder}
              </button>
              <button
                disabled={isPending}
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isPending ? t.cancelling : t.confirmAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}