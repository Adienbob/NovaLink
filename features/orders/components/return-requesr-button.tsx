"use client";

import { useState, useTransition } from "react";
import { requestReturn } from "../actions/request-return";

interface ReturnRequestButtonProps {
  orderId: string;
  locale: string;
}

export function ReturnRequestButton({ orderId, locale }: ReturnRequestButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isAr = locale === "ar";

  const t = {
    returnBtn: isAr ? "طلب إرجاع" : "Request Return",
    title: isAr ? "طلب إرجاع الطلب" : "Request Order Return",
    desc: isAr
      ? "يرجى توضيح سبب الإرجاع لمراجعة الطلب من فريق خدمة العملاء."
      : "Please state the reason for return for customer service review.",
    reasonLabel: isAr ? "سبب الإرجاع:" : "Return Reason:",
    reasonPlaceholder: isAr
      ? "مثال: المنتج غير مطابق للمواصفات أو يوجد به عيب تصنيع..."
      : "e.g., Item defective or not as described...",
    submit: isAr ? "إرسال طلب الإرجاع" : "Submit Return Request",
    cancel: isAr ? "تراجع" : "Cancel",
    submitting: isAr ? "جاري الإرسال..." : "Submitting...",
    emptyReasonError: isAr ? "يرجى إدخال سبب الإرجاع." : "Please provide a reason.",
    genericError: isAr ? "حدث خطأ أثناء تقديم الطلب. حاول مجدداً." : "Failed to submit request. Try again.",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError(t.emptyReasonError);
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await requestReturn(orderId, reason);
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
        className="px-4 py-2 border border-orange-300 text-orange-700 rounded-md text-xs font-semibold hover:bg-orange-50 transition-colors"
      >
        {t.returnBtn}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleSubmit}
            className={`bg-white rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl ${
              isAr ? "text-right" : "text-left"
            }`}
            dir={isAr ? "rtl" : "ltr"}
          >
            <h3 className="text-lg font-bold text-gray-900">{t.title}</h3>
            <p className="text-sm text-gray-600">{t.desc}</p>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700">{t.reasonLabel}</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder={t.reasonPlaceholder}
                className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-medium rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {isPending ? t.submitting : t.submit}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}