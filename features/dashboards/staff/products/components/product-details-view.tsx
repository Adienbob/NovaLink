"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Plus, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddVariantForm } from "./add-variant-form";
import { AddImagesForm } from "./add-images-form";
import { Separator } from "@/components/ui/separator";

interface ProductDetailsViewProps {
  product: any; // Type comes from Supabase query return type
  variants: any[];
  images: any[];
  canManage: boolean; // Based on user roles checked on server
}

function StatusWarnings({ product, variants, images }: { product: any; variants: any[]; images: any[] }) {
  const t = useTranslations("StaffProductDetails");
  const activeVariants = variants.filter(v => v.is_active);
  const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);

  const visible = product.is_active && activeVariants.length > 0 && images.length > 0 && totalStock > 0;

  if (visible) return null;

   return (
      <Alert className="border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200">
         <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
         <AlertTitle className="font-semibold">{t("warnings.title")}</AlertTitle>
         <AlertDescription className="text-sm">
            {t("warnings.reasonIntro")}
            <ul className="list-disc list-inside mt-1.5 space-y-0.5">
               {!product.is_active && <li>{t("warnings.inactive")}</li>}
               {activeVariants.length === 0 && <li>{t("warnings.zeroVariants")}</li>}
               {images.length === 0 && <li>{t("warnings.zeroImages")}</li>}
               {totalStock === 0 && variants.length > 0 && <li>{t("warnings.zeroStock")}</li>}
            </ul>
         </AlertDescription>
      </Alert>
   );
}

export function ProductDetailsView({ product, variants, images, canManage }: ProductDetailsViewProps) {
  const t = useTranslations("StaffProductDetails");
  const [addVariantOpen, setAddVariantOpen] = useState(false);
  
  // Controls AddImagesForm dialog
  const [addImagesState, setAddImagesState] = useState<{ open: boolean; variantId: string | null; displayName: string }>({
    open: false, variantId: null, displayName: ""
  });

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/dashboard/products" className="text-sm text-muted-foreground flex items-center gap-1.5 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {t("backToProducts")}
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-3xl font-bold tracking-tight">{product.name_en}</h1>
            <Badge variant={product.is_active ? "default" : "secondary"}>
              {product.is_active ? t("active") : t("inactive")}
            </Badge>
          </div>
          <p className="text-muted-foreground">{product.name_ar} <code className="text-xs bg-muted p-1 rounded ml-2">{product.slug}</code></p>
        </div>
        {canManage && (
          <div className="flex gap-2 shrink-0">
            {/* Future phases: Edit basic details */}
            <Button variant="outline" disabled>{t("editProduct")}</Button> 
          </div>
        )}
      </div>

      <StatusWarnings product={product} variants={variants} images={images} />

      {/* Basic Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">{t("cardPriceInfo.title")}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground">{t("cardPriceInfo.basePrice")}</p><p className="font-medium">${product.base_price.toFixed(2)}</p></div>
            <div><p className="text-muted-foreground">{t("cardPriceInfo.activeVariants")}</p><p className="font-medium">{variants.filter(v=>v.is_active).length} / {variants.length}</p></div>
            <div><p className="text-muted-foreground">{t("cardPriceInfo.brandId")}</p><p className="font-mono text-xs">{product.brand_id || '—'}</p></div>
            <div><p className="text-muted-foreground">{t("cardPriceInfo.categoryId")}</p><p className="font-mono text-xs">{product.category_id || '—'}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">{t("cardDescription.title")}</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-3 max-h-[150px] overflow-y-auto">
            <span><Badge variant="outline" className="mr-1.5">EN</Badge>{product.description_en}</span>
            <Separator />
            <span dir="rtl"><Badge variant="outline" className="ml-1.5">AR</Badge>{product.description_ar}</span>
          </CardContent>
        </Card>
      </div>

      {/* Variants Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("variants.titlePrefix")}{variants.length}{t("variants.titleSuffix")}</CardTitle>
          {canManage && (
            <Button size="sm" onClick={() => setAddVariantOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> {t("variants.addVariant")}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("variants.tableStatus")}</TableHead>
                  <TableHead>{t("variants.tableVariantNameSku")}</TableHead>
                  <TableHead>{t("variants.tablePrice")}</TableHead>
                  <TableHead>{t("variants.tableUsd")}</TableHead>
                  <TableHead>{t("variants.tableStock")}</TableHead>
                  <TableHead>{t("variants.tableAttributes")}</TableHead>
                  {canManage && <TableHead className="text-right">{t("variants.tableActions")}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-6 text-muted-foreground">{t("variants.noVariants")}</TableCell></TableRow>
                ) : (
                  variants.map(v => {
                    const lowStock = v.stock_quantity <= 5 && v.stock_quantity > 0;
                    const outOfStock = v.stock_quantity === 0;
                    
                    return (
                      <TableRow key={v.id}>
                        <TableCell>
                          <Badge variant={v.is_active ? "success" : "secondary"} className="text-[11px] px-1.5 py-0.5">
                            {v.is_active ? t("variants.statusActive") : t("variants.statusHidden")}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {v.variant_name}<p className="font-mono text-xs text-muted-foreground">{v.sku}</p>
                        </TableCell>
                        <TableCell>${v.price.toFixed(2)}</TableCell>
                        <TableCell className="text-muted-foreground">{v.base_price_usd ? `$${v.base_price_usd.toFixed(2)}` : '—'}</TableCell>
                        <TableCell>
                          <Badge variant={outOfStock ? "destructive" : lowStock ? "warning" : "secondary"}>
                            {v.stock_quantity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(v.attributes) && v.attributes.map((attr:any, i:number) => (
                              <Badge key={i} variant="outline" className="text-[11px] font-normal">{attr.key}: {attr.value}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        {canManage && (
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" onClick={() => setAddImagesState({ open: true, variantId: v.id, displayName: `${v.variant_name} (${v.sku})` })}>
                              <ImageIcon className="h-4 w-4 mr-1.5" /> {t("variants.addImages")}
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Images section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("images.titlePrefix")}{images.length}{t("images.titleSuffix")}</CardTitle>
          {canManage && (
            <Button size="sm" onClick={() => setAddImagesState({ open: true, variantId: null, displayName: "Product Level" })}>
              <Plus className="h-4 w-4 mr-1.5" /> {t("images.addImages")}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-lg bg-muted/30 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">{t("images.noImages")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {images.map((img, idx) => (
                <div key={img.id} className="relative group aspect-square rounded-md border bg-background overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt_text} className="w-full h-full object-cover" />
                  {idx === 0 && <Badge className="absolute top-1.5 left-1.5 text-[10px] px-1 py-0">{t("images.mainBadge")}</Badge>}
                  <div className="absolute inset-x-0 bottom-0 p-1 bg-black/50 text-white text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.alt_text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {canManage && (
        <>
          <AddVariantForm productId={product.id} open={addVariantOpen} onOpenChange={setAddVariantOpen} />
          
          <AddImagesForm 
            productId={product.id}
            variantId={addImagesState.variantId}
            targetDisplayName={addImagesState.displayName}
            open={addImagesState.open}
            onOpenChange={(open) => setAddImagesState(s => ({...s, open}))}
          />
        </>
      )}
    </div>
  );
}