"use client";

import { useState, useEffect } from "react";

type Governorate = {
   id: string;
   name: string;
};

export type AddressFormData = {
   label: string;
   recipient_name: string;
   phone: string;
   governorate_id: string;
   city: string;
   area: string;
   street: string;
   building: string;
   floor: string;
   apartment: string;
   landmark: string;
   notes: string;
   is_default: boolean;
};

type AddressFormProps = {
   governorates: Governorate[];
   initialData?: Partial<AddressFormData>; // ← for Edit
   onSubmit: (data: AddressFormData) => Promise<void>;
   onCancel?: () => void;
   submitLabel?: string;
};

const emptyValues: AddressFormData = {
   label: "",
   recipient_name: "",
   phone: "",
   governorate_id: "",
   city: "",
   area: "",
   street: "",
   building: "",
   floor: "",
   apartment: "",
   landmark: "",
   notes: "",
   is_default: false,
};

export default function AddressForm({
   governorates,
   initialData,
   onSubmit,
   onCancel,
   submitLabel = "Save Address",
}: AddressFormProps) {
   const [formData, setFormData] = useState<AddressFormData>({
      ...emptyValues,
      ...initialData,
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");

   // Keep form in sync when switching between create/edit
   useEffect(() => {
      setFormData({
         ...emptyValues,
         ...initialData,
      });
   }, [initialData]);

   function handleChange(
      event: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) {
      const { name, value, type } = event.target;

      setFormData((prev) => ({
         ...prev,
         [name]:
         type === "checkbox"
            ? (event.target as HTMLInputElement).checked
            : value,
      }));
   }

   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setError("");
      setIsSubmitting(true);

      try {
         await onSubmit(formData);
      } catch (err) {
         setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
         setIsSubmitting(false);
      }
   }

   const inputClass =
      "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20";

   const labelClass = "mb-2 block text-sm font-medium text-foreground";

   function renderInput(
      name: keyof AddressFormData,
      label: string,
      required = false,
      placeholder = ""
   ) {
      return (
         <div>
         <label htmlFor={name} className={labelClass}>
            {label}
            {required && <span className="ms-1 text-destructive">*</span>}
         </label>

         <input
            id={name}
            name={name}
            value={String(formData[name] ?? "")}
            onChange={handleChange}
            required={required}
            placeholder={placeholder}
            className={inputClass}
         />
         </div>
      );
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-8">
         {/* Recipient Information */}
         <section className="space-y-5">
         <div>
            <h2 className="text-lg font-semibold text-foreground">
               Recipient Information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
               Who should receive this order?
            </p>
         </div>

         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {renderInput("recipient_name", "Recipient Name", true)}
            {renderInput("phone", "Phone Number", true, "01xxxxxxxxx")}
         </div>
         </section>

         <div className="border-t border-border" />

         {/* Address Information */}
         <section className="space-y-5">
         <div>
            <h2 className="text-lg font-semibold text-foreground">
               Address Information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
               Enter your complete shipping address.
            </p>
         </div>

         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {renderInput("label", "Address Label", false, "Home, Work...")}

            <div>
               <label htmlFor="governorate_id" className={labelClass}>
               Governorate <span className="text-destructive">*</span>
               </label>

               <select
               id="governorate_id"
               name="governorate_id"
               value={formData.governorate_id}
               onChange={handleChange}
               required
               className={inputClass}
               >
               <option value="">Select governorate</option>
               {governorates.map((g) => (
                  <option key={g.id} value={g.id}>
                     {g.name}
                  </option>
               ))}
               </select>
            </div>

            {renderInput("city", "City", true)}
            {renderInput("area", "Area", true)}
            {renderInput("street", "Street", true)}
            {renderInput("building", "Building")}
            {renderInput("floor", "Floor")}
            {renderInput("apartment", "Apartment")}
            {renderInput("landmark", "Nearby Landmark")}
         </div>
         </section>

         <div className="border-t border-border" />

         {/* Additional Information */}
         <section className="space-y-5">
         <div>
            <h2 className="text-lg font-semibold text-foreground">
               Additional Information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
               Add any instructions that might help with delivery.
            </p>
         </div>

         <div>
            <label htmlFor="notes" className={labelClass}>
               Delivery Notes
            </label>
            <textarea
               id="notes"
               name="notes"
               value={formData.notes}
               onChange={handleChange}
               rows={3}
               placeholder="Additional delivery instructions..."
               className={`${inputClass} resize-y`}
            />
         </div>

         <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/40">
            <input
               type="checkbox"
               name="is_default"
               checked={formData.is_default}
               onChange={handleChange}
               className="mt-1 h-4 w-4 accent-primary"
            />
            <span>
               <span className="block text-sm font-semibold text-foreground">
               Set as default address
               </span>
               <span className="mt-1 block text-xs text-muted-foreground">
               Use this address by default during checkout.
               </span>
            </span>
         </label>
         </section>

         {error && (
         <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
         </div>
         )}

         <div className="flex justify-between border-t border-border pt-6">
         {onCancel && (
            <button
               type="button"
               onClick={onCancel}
               disabled={isSubmitting}
               className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
               Cancel
            </button>
         )}

         <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
         >
            {isSubmitting ? "Saving..." : submitLabel}
         </button>
         </div>
      </form>
  );
}