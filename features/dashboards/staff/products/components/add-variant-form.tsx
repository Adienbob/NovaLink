"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { variantSchema } from "../schema/variant-schema";
import { addVariant } from "../actions/add-variant";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { VariantFields } from "./variant-fields";
import { ImageFields } from "./images-fields";
import { getErrorMessage } from "../helpers/map-db-error";
import { imageSchema } from "../schema/images-shema";

const addVariantFormSchema = z.object({
  variant: variantSchema,
  images: z.array(imageSchema).optional(),
});

interface AddVariantFormProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddVariantForm({ productId, open, onOpenChange }: AddVariantFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm({
    resolver: zodResolver(addVariantFormSchema),
    defaultValues: {
      variant: { variant_name: "", sku: "", price: 0, stock_quantity: 0, attributes: [] },
      images: [], // Images are optional for add variant
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = async (values: any) => {
    setServerError(null);
    try {
      await addVariant({ productId, ...values });
      reset();
      onOpenChange(false);
      router.refresh(); // Refresh page data
    } catch (err: any) {
      setServerError(getErrorMessage(err.message));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Variant</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
            {serverError && (
              <Alert variant="destructive"><AlertDescription>{serverError}</AlertDescription></Alert>
            )}

            {/* Single Variant Fields */}
            <VariantFields name="variant" multiple={false} />

            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3">Variant Specific Images (Optional)</h4>
              {/* Optional here, minItems is 0 */}
              <ImageFields name="images" minItems={0} />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Variant
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}