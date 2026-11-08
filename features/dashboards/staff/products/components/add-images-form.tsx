"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { addImagesSchema } from "../schema/product-schemas";
import { addImages } from "../actions/add-images";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "../helpers/map-db-error";
import { ImageFields } from "./images-fields";

interface AddImagesFormProps {
  productId: string;
  variantId?: string | null;
  targetDisplayName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddImagesForm({ productId, variantId = null, targetDisplayName, open, onOpenChange }: AddImagesFormProps) {
  const router = useRouter();
  const t = useTranslations("StaffAddImages");
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm({
    resolver: zodResolver(addImagesSchema),
    defaultValues: {
      productId,
      variantId: variantId ?? null,
      images: [{ url: "", alt_text: "" }], // Require at least one image
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = async (values: any) => {
    setServerError(null);
    try {
      await addImages(values);
      reset();
      onOpenChange(false);
      router.refresh();
    } catch (err: any) {
      setServerError(getErrorMessage(err.message));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("titlePrefix")}
            <span className="text-primary">{targetDisplayName}</span>
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
            {serverError && (
              <Alert variant="destructive"><AlertDescription>{serverError}</AlertDescription></Alert>
            )}

            {/* labelMain true only if adding to product level (null variantId) */}
            <ImageFields name="images" minItems={1} labelMain={!variantId} />

            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t("submit")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}