"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/features/catalog/shared/components/add-to-cart-button";
import { ProductCardTypes } from "@/features/catalog/products/types/product-card";

interface ProductCardProps {
  product: ProductCardTypes;
  locale: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const isAr = locale === "ar";

  // استخراج الصورة الأولى بحسب sort_order
  const primaryImage =
    product.images && product.images.length > 0
      ? [...product.images].sort((a, b) => a.sort_order - b.sort_order)[0]?.url
      : null;

  // تحديد المتغير الافتراضي للبطاقة
  const defaultVariant = product.variants?.[0];
  const displayPrice = defaultVariant?.price;
  const inStock = defaultVariant ? defaultVariant.stock_quantity > 0 : false;

  console.log(primaryImage)
  return (
    <Card className="group overflow-hidden border-border bg-surface transition-all hover:shadow-md flex flex-col justify-between h-full">
      <div className="relative">
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-muted"
        >
          {primaryImage ? (
            <Image
              src={`${primaryImage}`}
              alt={product.images?.[0]?.alt_text || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-secondary">
              {isAr ? "لا توجد صورة" : "No image"}
            </div>
          )}
        </Link>

        {!inStock && (
          <div className="absolute top-2.5 inset-s-2.5 z-10">
            <Badge variant="destructive" className="text-[10px] px-2 py-0.5 font-medium">
              {isAr ? "نفدت الكمية" : "Out of Stock"}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {(product.category?.name || product.brand?.name) && (
            <p className="text-[11px] font-medium text-secondary uppercase tracking-wider">
              {product.category?.name || product.brand?.name}
            </p>
          )}
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="block font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        <div className="pt-1">
          <span className="text-base font-bold text-foreground font-mono">
            {Number(displayPrice).toFixed(2)} SAR
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {defaultVariant ? (
          <AddToCartButton
            productVariantId={defaultVariant.id}
            disabled={!inStock}
          />
        ) : (
          <Badge variant="outline" className="w-full justify-center py-2 text-xs">
            {isAr ? "غير متوفر" : "Unavailable"}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}