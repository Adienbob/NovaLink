"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct } from "../actions/create-product";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "../helpers/map-db-error";
import { FormError } from "@/components/ui/form-error";
import { VariantFields } from "./variant-fields";
import { ImageFields } from "./images-fields";
import { productCreateSchema } from "../schema/product-schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { generateSlug } from "../actions/generate-slug";
import { KeyFeaturesFields } from "./key-features-fields";
import { SpecsFields } from "./specs-fields";


export function CreateProductForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const methods = useForm({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name_en: "", name_ar: "",
      slug: "",
      description_en: "", description_ar: "",
      seo_title_en: "", seo_title_ar: "",
      seo_description_en: "", seo_description_ar: "",
      base_price: 0, is_active: true,
      brand_id: null, category_id: null,
      
      specs_en: [{ key: "", value: "" }],
      specs_ar: [{ key: "", value: "" }],
      key_features_en: [""],
      key_features_ar: [""],

      variants: [{ variant_name: "Standrad", sku: "", price: 0, stock_quantity: 0, attributes: [] }],
      images: [{ url: "", alt_text: "" }],
    },
  });
  const { watch, setValue, register, handleSubmit, formState: { isSubmitting, errors } } = methods;

  // Auto-generate slug from name_en until touched
  const nameEn = watch("name_en");
  useEffect(() => {
    if (!isSlugManuallyEdited) {
      setValue("slug", generateSlug(nameEn), { shouldValidate: true });
    }
  }, [nameEn, isSlugManuallyEdited, setValue]);

  const onSubmit = async (values: any) => {
    setServerError(null);
    try {
      const res = await createProduct(values);
      router.push(`/staff/products/${res.slug}`);
    } catch (err: any) {
      setServerError(getErrorMessage(err.message));
    }
  };

  const onInvalid = (errs: typeof errors) => {
  console.log("Validation errors:", errs);
  setServerError("Please fix the highlighted fields.");
};


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8 max-w-5xl mx-auto pb-10">
        {serverError && (
          <Alert variant="destructive"><AlertDescription>{serverError}</AlertDescription></Alert>
        )}

          <div>
            <h1 className="text-2xl font-bold">Create Product</h1>
            <p className="text-sm text-muted-foreground">
              Add a new product with variants and images.
            </p>
          </div>          

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Product
          </Button>
        </div>
        {/* Basic Info & Localized Names */}
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name_en">English Name *</Label>
                <Input {...register("name_en")} />
                <FormError message={errors.name_en?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name_ar">Arabic Name *</Label>
                <Input dir="rtl" {...register("name_ar")} />
                <FormError message={errors.name_ar?.message} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                {...register("slug")}
                onChange={(e) => {
                  setIsSlugManuallyEdited(true);
                  register("slug").onChange(e);
                }}
              />
              <FormError message={errors.slug?.message} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="base_price">Base Price *</Label>
                <Input type="number" step="0.01" {...register("base_price", { valueAsNumber: true })} />
                <FormError message={errors.base_price?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brand_id">Brand ID (UUID)</Label>
                <Input placeholder="Optional" {...register("brand_id")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category_id">Category ID (UUID)</Label>
                <Input placeholder="Optional" {...register("category_id")} />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-3">
              <Checkbox
                id="is_active"
                checked={watch("is_active")}
                onCheckedChange={(checked) => setValue("is_active", !!checked)}
              />
              <Label htmlFor="is_active">Product Active (visible in store)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Localized Descriptions */}
        <Card>
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="description_en">English Description *</Label>
              <Textarea {...register("description_en")} rows={5} />
              <FormError message={errors.description_en?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description_ar">Arabic Description *</Label>
              <Textarea {...register("description_ar")} rows={5} dir="rtl" />
              <FormError message={errors.description_ar?.message} />
            </div>
          </CardContent>
        </Card>

        {/* Localized SEO Descriptions */}
        <Card>
          <CardHeader><CardTitle>SEO Description</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="seo_description_en">English Description *</Label>
              <Textarea {...register("seo_description_en")} rows={5} />
              <FormError message={errors.seo_description_en?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seo_description_ar">Arabic Description *</Label>
              <Textarea {...register("seo_description_ar")} rows={5} dir="rtl" />
              <FormError message={errors.seo_description_ar?.message} />
            </div>
          </CardContent>
        </Card>

        {/* Localized SEO Descriptions */}
        <Card>
          <CardHeader><CardTitle>SEO Title</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="seo_title_en">English Title *</Label>
              <Textarea {...register("seo_title_en")} rows={5} />
              <FormError message={errors.seo_description_en?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seo_title_ar">Arabic Title *</Label>
              <Textarea {...register("seo_title_ar")} rows={5} dir="rtl" />
              <FormError message={errors.seo_description_ar?.message} />
            </div>
          </CardContent>
        </Card>

        {/* Specs */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">English</h3>
              <SpecsFields name="specs_en" minItems={0} />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Arabic</h3>
              <SpecsFields name="specs_ar" minItems={0} dir="rtl" />
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">English</h3>
              <KeyFeaturesFields
                name="key_features_en"
                minItems={0}
                placeholder="e.g. Waterproof"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Arabic</h3>
              <KeyFeaturesFields
                name="key_features_ar"
                minItems={0}
                dir="rtl"
                placeholder="مثال: مقاوم للماء"
              />
            </div>
          </CardContent>
        </Card>

        {/* Variants Section */}
        <Card>
          <CardHeader><CardTitle>Variants</CardTitle></CardHeader>
          <CardContent>
            <VariantFields name="variants" multiple minItems={1} />
          </CardContent>
        </Card>

        {/* Product Images Section */}
        <Card>
          <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
          <CardContent>
            {/* labelMain is true here to show "Main" Badge for the product list */}
            <ImageFields name="images" minItems={1} labelMain />
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}