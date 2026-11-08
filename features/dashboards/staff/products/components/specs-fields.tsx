"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SpecsFieldsProps {
   name: string;
   minItems?: number;
   dir?: "ltr" | "rtl";
}

export function SpecsFields({
   name,
   minItems = 0,
   dir = "ltr",
}: SpecsFieldsProps) {
   const t = useTranslations("SpecsFields");

   const { control, register, formState: { errors } } = useFormContext();
   const { fields, append, remove } = useFieldArray({ control, name });

   const arrayError = (errors[name] as any)?.message;

   return (
      <div className="space-y-3">
         {fields.map((field, index) => {
            const itemError = (errors[name] as any)?.[index];
            const keyError = itemError?.key?.message;
            const valueError = itemError?.value?.message;

            return (
               <div
                  key={field.id}
                  className="flex items-start gap-3 p-3 border rounded-lg bg-card"
               >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                     <div className="space-y-1.5">
                        <Label className="text-xs">{t("key")}</Label>
                        <Input
                           dir={dir}
                           placeholder={t("keyPlaceholder")}
                           {...register(`${name}.${index}.key`)}
                        />
                        {keyError && (
                           <p className="text-xs text-red-500">{keyError}</p>
                        )}
                     </div>

                     <div className="space-y-1.5">
                        <Label className="text-xs">{t("value")}</Label>
                        <Input
                           dir={dir}
                           placeholder={t("valuePlaceholder")}
                           {...register(`${name}.${index}.value`)}
                        />
                        {valueError && (
                           <p className="text-xs text-red-500">{valueError}</p>
                        )}
                     </div>
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
            onClick={() => append({ key: "", value: "" })}
            className="w-full"
         >
            <Plus className="h-4 w-4 mr-2" />
            {t("addSpecification")}
         </Button>
      </div>
   );
}