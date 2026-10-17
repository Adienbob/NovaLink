"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { createOrder } from "../actions/create-order";
import { type DeliveryAddressInput } from "../schemas/checkout-schema";

const DRAFT_STORAGE_KEY = "zain_checkout_draft";

export interface CartItemSummary {
   variantId: string;
   productName: string;
   variantName: string;
   quantity: number;
   price: number;
}

export interface GovernorateOption {
   id: string;
   nameAr: string;
   nameEn: string;
   shippingFee: number;
}

interface CheckoutFormProps {
   governorates: GovernorateOption[];
   cartItems: CartItemSummary[];
   locale?: string;
}

export function CheckoutForm({ governorates, cartItems, locale = "ar" }: CheckoutFormProps) {
   const router = useRouter();
   const { isLoaded, isSignedIn } = useUser();
   const { redirectToSignIn } = useClerk();
   const [isPending, startTransition] = useTransition();
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   // 1. Idempotency & Address Form State
   const [idempotencyKey, setIdempotencyKey] = useState<string>("");
   const [addressData, setAddressData] = useState<DeliveryAddressInput & { notes?: string }>({
      recipientName: "",
      phone: "",
      governorateId: governorates[0]?.id || "",
      city: "",
      area: "",
      street: "",
      building: "",
      floor: "",
      apartment: "",
      landmark: "",
      notes: "",
   });

   // 2. Hydrate Draft from localStorage on mount
   useEffect(() => {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
         try {
         const parsed = JSON.parse(savedDraft);
         if (parsed.addressData) setAddressData(parsed.addressData);
         if (parsed.idempotencyKey) setIdempotencyKey(parsed.idempotencyKey);
         else setIdempotencyKey(crypto.randomUUID());
         } catch {
         setIdempotencyKey(crypto.randomUUID());
         }
      } else {
         setIdempotencyKey(crypto.randomUUID());
      }
   }, []);

   // 3. Sync changes to LocalStorage
   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;
      const updated = { ...addressData, [name]: value };
      setAddressData(updated);
      localStorage.setItem(
         DRAFT_STORAGE_KEY,
         JSON.stringify({ addressData: updated, idempotencyKey })
      );
   };

   // 4. Totals Calculation
   const selectedGov = governorates.find((g) => g.id === addressData.governorateId);
   const shippingFee = selectedGov ? selectedGov.shippingFee : 35;
   const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
   const total = subtotal + shippingFee;

   // 5. Submit Handler
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage(null);

      // Guest Redirection: Save draft and force authentication
      if (isLoaded && !isSignedIn) {
         localStorage.setItem(
         DRAFT_STORAGE_KEY,
         JSON.stringify({ addressData, idempotencyKey })
         );
         redirectToSignIn({ redirectUrl: window.location.href });
         return;
      }

      startTransition(async () => {
         const activeKey = idempotencyKey || crypto.randomUUID();

         const result = await createOrder({
         ...addressData,
         idempotencyKey: activeKey,
         items: cartItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            expectedPrice: item.price,
         })),
         });

         if (!result.success) {
         // Regenerate Idempotency Key on price/stock validation failures
         if (result.code === "PRICE_CHANGED" || result.code === "OUT_OF_STOCK") {
            const newKey = crypto.randomUUID();
            setIdempotencyKey(newKey);
            localStorage.setItem(
               DRAFT_STORAGE_KEY,
               JSON.stringify({ addressData, idempotencyKey: newKey })
            );
         }
         setErrorMessage(result.message || "حدث خطأ أثناء حفظ الطلب.");
         return;
         }

         // Success: Clear LocalStorage draft and redirect to confirmation
         localStorage.removeItem(DRAFT_STORAGE_KEY);
         router.push(`/${locale}/orders/${result.orderId}/success`);
      });
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4">
         {errorMessage && (
         <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm font-medium">
            {errorMessage}
         </div>
         )}

         {/* Address Information */}
         <div className="space-y-4 border p-5 rounded-lg bg-white shadow-sm">
         <h3 className="text-lg font-semibold border-b pb-2">بيانات الشحن والعنوان</h3>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستلم *</label>
               <input
               type="text"
               name="recipientName"
               value={addressData.recipientName}
               onChange={handleInputChange}
               required
               className="w-full border p-2 rounded-md focus:ring-2 focus:ring-black outline-none"
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
               <input
               type="tel"
               name="phone"
               value={addressData.phone}
               onChange={handleInputChange}
               required
               placeholder="01012345678"
               className="w-full border p-2 rounded-md focus:ring-2 focus:ring-black outline-none"
               />
            </div>
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المحافظة *</label>
            <select
               name="governorateId"
               value={addressData.governorateId}
               onChange={handleInputChange}
               className="w-full border p-2 rounded-md bg-white focus:ring-2 focus:ring-black outline-none"
            >
               {governorates.map((gov) => (
               <option key={gov.id} value={gov.id}>
                  {locale === "ar" ? gov.nameAr : gov.nameEn} ({gov.shippingFee} ج.م)
               </option>
               ))}
            </select>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">المدينة *</label>
               <input
               type="text"
               name="city"
               value={addressData.city}
               onChange={handleInputChange}
               required
               className="w-full border p-2 rounded-md focus:ring-2 focus:ring-black outline-none"
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة / الحي *</label>
               <input
               type="text"
               name="area"
               value={addressData.area}
               onChange={handleInputChange}
               required
               className="w-full border p-2 rounded-md focus:ring-2 focus:ring-black outline-none"
               />
            </div>
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الشارع *</label>
            <input
               type="text"
               name="street"
               value={addressData.street}
               onChange={handleInputChange}
               required
               className="w-full border p-2 rounded-md focus:ring-2 focus:ring-black outline-none"
            />
         </div>

         <div className="grid grid-cols-3 gap-2">
            <div>
               <label className="block text-xs font-medium text-gray-600 mb-1">المبنى</label>
               <input
               type="text"
               name="building"
               value={addressData.building || ""}
               onChange={handleInputChange}
               className="w-full border p-2 rounded-md text-sm"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-600 mb-1">الدور</label>
               <input
               type="text"
               name="floor"
               value={addressData.floor || ""}
               onChange={handleInputChange}
               className="w-full border p-2 rounded-md text-sm"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-600 mb-1">الشقة</label>
               <input
               type="text"
               name="apartment"
               value={addressData.apartment || ""}
               onChange={handleInputChange}
               className="w-full border p-2 rounded-md text-sm"
               />
            </div>
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">علامة مميزة (اختياري)</label>
            <input
               type="text"
               name="landmark"
               value={addressData.landmark || ""}
               onChange={handleInputChange}
               className="w-full border p-2 rounded-md text-sm"
            />
         </div>
         </div>

         {/* Order Summary & Pricing */}
         <div className="border p-5 rounded-lg bg-gray-50 space-y-3">
         <h3 className="text-lg font-semibold border-b pb-2">ملخص الحسابات</h3>
         <div className="flex justify-between text-sm text-gray-600">
            <span>المجموع الفرعي:</span>
            <span>{subtotal.toFixed(2)} ج.م</span>
         </div>
         <div className="flex justify-between text-sm text-gray-600">
            <span>مصاريف الشحن:</span>
            <span>{shippingFee.toFixed(2)} ج.م</span>
         </div>
         <hr className="my-2" />
         <div className="flex justify-between font-bold text-base text-gray-900">
            <span>الإجمالي الكلي:</span>
            <span>{total.toFixed(2)} ج.م</span>
         </div>
         <div className="text-xs text-gray-500 pt-1">
            طريقة الدفع المقبولة: <strong>الدفع عند الاستلام (COD)</strong>
         </div>
         </div>

         <button
         type="submit"
         disabled={isPending || cartItems.length === 0}
         className="w-full bg-black hover:bg-gray-800 text-white p-3 rounded-md font-bold transition-colors disabled:bg-gray-400"
         >
         {isPending ? "جاري تأكيد الطلب..." : "تأكيد الطلب الآن"}
         </button>
      </form>
   );
}