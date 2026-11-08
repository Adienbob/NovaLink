"use client";

import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

interface ImageFieldsProps {
  name: string;
  minItems?: number;
  labelMain?: boolean;
}

function ImagePreview({ url }: { url: string }) {
  const [hasError, setHasError] = useState(false);
  const t = useTranslations("StaffImageFields");

  if (!url || hasError) {
    return (
      <div className="w-16 h-16 rounded border flex items-center justify-center bg-muted text-muted-foreground">
        <ImageIcon className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded border overflow-hidden bg-background shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={t("preview")}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export function ImageFields({
  name,
  minItems = 0,
  labelMain = false,
}: ImageFieldsProps) {
  const t = useTranslations("StaffImageFields");

  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({ control, name });

  const arrayError = (errors[name] as any)?.message;

  return (
    <div className="space-y-4">
      {fields.map((fieldItem, index) => {
        const imgError = (errors[name] as any)?.[index];
        const urlError = imgError?.url?.message;
        const altError = imgError?.alt_text?.message;

        const currentUrl = watch(`${name}.${index}.url`);

        return (
          <div
            key={fieldItem.id}
            className="flex items-start gap-3 p-3 border rounded-lg bg-card"
          >
            <ImagePreview url={currentUrl} />

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">{t("url")} *</Label>
                <Input
                  placeholder="https://..."
                  {...register(`${name}.${index}.url`)}
                />
                {urlError && (
                  <p className="text-xs text-red-500">{urlError}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-2">
                  {t("altText")} *
                  {labelMain && index === 0 && (
                    <Badge
                      variant="default"
                      className="text-[10px] px-1 py-0"
                    >
                      {t("mainImage")}
                    </Badge>
                  )}
                </Label>

                <Input
                  placeholder={t("imageDescription")}
                  {...register(`${name}.${index}.alt_text`)}
                />

                {altError && (
                  <p className="text-xs text-red-500">{altError}</p>
                )}
              </div>
            </div>

            {fields.length > minItems && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive shrink-0 mt-6"
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
        onClick={() => append({ url: "", alt_text: "" })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("addImage")}
      </Button>
    </div>
  );
}