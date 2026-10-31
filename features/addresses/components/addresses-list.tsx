"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAddress } from "@/features/addresses/actions/delete-address";
import { setDefaultAddress } from "@/features/addresses/actions/set-default-address";
import { createAddress } from "@/features/addresses/actions/create-address";
import { updateAddress } from "@/features/addresses/actions/update-address";
import AddressForm, { AddressFormData } from "./address-form";

type Governorate = {
   id: string;
   name_en?: string;
   name_ar?: string;
};

type Address = {
   id: string;
   label: string | null;
   recipient_name: string;
   phone: string;
   governorate: { id: string; name_ar?: string, name_en?: string } | null;
   governorate_id?: string; // may come from the query
   city: string;
   area: string;
   street: string;
   building: string | null;
   floor: string | null;
   apartment: string | null;
   landmark: string | null;
   notes: string | null;
   is_default: boolean;
};

type Props = {
   addresses: Address[];
   governorates: Governorate[];
   locale: string;
};

export default function AddressesList({ addresses, governorates, locale }: Props) {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const [mode, setMode] = useState<"list" | "create" | Address>("list");

   const handleDelete = (id: string) => {
      if (!confirm("Are you sure you want to delete this address?")) return;

      startTransition(async () => {
         try {
         await deleteAddress(id);
         router.refresh();
         } catch (err) {
         alert(err instanceof Error ? err.message : "Failed to delete address");
         }
      });
   };

   const handleSetDefault = (id: string) => {
      startTransition(async () => {
         try {
         await setDefaultAddress(id);
         router.refresh();
         } catch (err) {
         alert(err instanceof Error ? err.message : "Failed to set default");
         }
      });
   };

   const handleCreate = async (data: AddressFormData) => {
      await createAddress(data);
      setMode("list");
      router.refresh();
   };

   const handleUpdate = async (data: AddressFormData) => {
      if (typeof mode === "string") return; // safety
      await updateAddress(mode.id, data);
      setMode("list");
      router.refresh();
   };

   
   if (mode !== "list") {
      const isEdit = mode !== "create";
      const initialData: Partial<AddressFormData> | undefined = isEdit
         ? {
            label: mode.label ?? "",
            recipient_name: mode.recipient_name,
            phone: mode.phone,
            governorate_id: mode.governorate?.id ?? mode.governorate_id ?? "",
            city: mode.city,
            area: mode.area,
            street: mode.street,
            building: mode.building ?? "",
            floor: mode.floor ?? "",
            apartment: mode.apartment ?? "",
            landmark: mode.landmark ?? "",
            notes: mode.notes ?? "",
            is_default: mode.is_default,
         }
         : undefined;

      return (
         <div className="mx-auto max-w-2xl">
            <div className="mb-8">
               <h1 className="text-2xl font-bold tracking-tight">
                  {isEdit ? "Edit Address" : "Add New Address"}
               </h1>
               <p className="mt-2 text-sm text-muted-foreground">
                  {isEdit
                  ? "Update the details of this shipping address."
                  : "Fill in the details below to save a new shipping address."}
               </p>
            </div>


            <div className="rounded-2xl border border-border bg-card px-6 py-10 shadow-sm">
               <AddressForm
                  governorates={governorates}
                  initialData={initialData}
                  onSubmit={isEdit ? handleUpdate : handleCreate}
                  onCancel={() => setMode("list")}
                  submitLabel={isEdit ? "Update Address" : "Save Address"}
                  locale={locale}
               />

            </div>
         </div>
      );
   }

   
   return (
      <div className="space-y-8">
         {/* Header */}
         <div className="flex flex-wrap items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
               My Addresses
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
               Manage your saved shipping addresses.
            </p>
         </div>

         <button
            type="button"
            onClick={() => setMode("create")}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
         >
            + Add New Address
         </button>
         </div>

         {addresses.length === 0 ? (
         <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-4xl">
               📍
            </div>
            <h2 className="mt-6 text-xl font-bold text-card-foreground">
               No addresses saved
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
               You haven't added any shipping addresses yet.
            </p>
            <button
               type="button"
               onClick={() => setMode("create")}
               className="mt-7 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
               Add Your First Address
            </button>
         </div>
         ) : (
         <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {addresses.map((address) => (
               <article
               key={address.id}
               className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:p-6"
               >
               {/* Header */}
               <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                     <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
                     📍
                     </div>
                     <div>
                     <h2 className="font-semibold text-foreground">
                        {address.label || "Shipping Address"}
                     </h2>
                     <p className="mt-1 text-xs text-muted-foreground">
                        {address.recipient_name}
                     </p>
                     </div>
                  </div>

                  {address.is_default && (
                     <span className="shrink-0 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
                     Default
                     </span>
                  )}
               </div>

               {/* Details */}
               <div className="space-y-3 py-5 text-sm">
                  <div>
                     <p className="text-xs font-medium text-muted-foreground">Phone Number</p>
                     <p className="mt-1 font-medium text-foreground" dir="ltr">
                     {address.phone}
                     </p>
                  </div>

                  <div>
                     <p className="text-xs font-medium text-muted-foreground">Address</p>
                     <p className="mt-1 leading-7 text-foreground">
                     {[
                        locale === "ar"
                           ? address.governorate?.name_ar
                           : address.governorate?.name_en,
                        address.city,
                        address.area,
                        address.street,
                        address.building,
                        address.floor && `Floor ${address.floor}`,
                        address.apartment && `Apartment ${address.apartment}`,
                        ]
                        .filter(Boolean)
                        .join(", ")
                     }
                     </p>
                  </div>

                  {address.landmark && (
                     <div>
                     <p className="text-xs font-medium text-muted-foreground">Landmark</p>
                     <p className="mt-1 text-foreground">{address.landmark}</p>
                     </div>
                  )}

                  {address.notes && (
                     <div>
                     <p className="text-xs font-medium text-muted-foreground">Delivery Notes</p>
                     <p className="mt-1 text-foreground">{address.notes}</p>
                     </div>
                  )}
               </div>

               {/* Actions */}
               <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                  <div className="flex gap-2">
                     <button
                     type="button"
                     onClick={() => setMode(address)}
                     className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                     >
                     Edit
                     </button>

                     <button
                     type="button"
                     disabled={isPending}
                     onClick={() => handleDelete(address.id)}
                     className="rounded-lg border border-destructive/20 px-4 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-50"
                     >
                     Delete
                     </button>
                  </div>

                  {!address.is_default && (
                     <button
                     type="button"
                     disabled={isPending}
                     onClick={() => handleSetDefault(address.id)}
                     className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover hover:underline disabled:opacity-50"
                     >
                     Set as Default
                     </button>
                  )}
               </div>
               </article>
            ))}
         </div>
         )}
      </div>
   );
}