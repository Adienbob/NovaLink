"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface KeyFeaturesFieldsProps {
   name: string;
   minItems?: number;
   dir?: "ltr" | "rtl";
   placeholder?: string;
}

export function KeyFeaturesFields({
   name,
   minItems = 0,
   dir = "ltr",
   placeholder,
}: KeyFeaturesFieldsProps) {
   const t = useTranslations("StaffKeyFeaturesFields");

   const { control, register, formState: { errors } } = useFormContext();
   const { fields, append, remove } = useFieldArray({ control, name });

   const arrayError = (errors[name] as any)?.message;

   return (
      <div className="space-y-3">
         {fields.map((field, index) => {
            const itemError = (errors[name] as any)?.[index]?.message;

            return (
               <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                     <Label className="text-xs">
                        {t("feature", { number: index + 1 })}
                     </Label>

                     <Input
                        dir={dir}
                        placeholder={placeholder || t("defaultPlaceholder")}
                        {...register(`${name}.${index}` as const)}
                     />

                     {itemError && (
                        <p className="text-xs text-red-500">{itemError}</p>
                     )}
                  </div>

                  {fields.length > minItems && (
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive mt-6 shrink-0"
                        onClick={() => remove(index)}
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  )}
               </div>
            );
         })}

         {arrayError && (
            <p className="text-xs text-red-500">{arrayError}</p>
         )}

         <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("")}
            className="w-full"
         >
            <Plus className="h-4 w-4 mr-2" />
            {t("addFeature")}
         </Button>
      </div>
   );
}