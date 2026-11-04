// features/catalog/products/queries/get-product-metadata.ts
import { Metadata } from "next";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { Locale } from "@/app/lib/types/general-types";

interface GetProductMetadataParams {
  slug: string;
  locale: Locale;
}

export async function getProductMetadata({
  slug,
  locale,
}: GetProductMetadataParams): Promise<Metadata> {
  const isArabic = locale === "ar";

  const { data: product } = await supabaseAdmin
    .from("products")
    .select(`
      name_en,
      name_ar,
      description_en,
      description_ar,
      seo_title_en,
      seo_title_ar,
      seo_description_en,
      seo_description_ar
    `)
    .eq("slug", slug)
    .single();

  if (!product) {
    return {
      title: isArabic ? "المنتج غير موجود" : "Product Not Found",
    };
  }

  // Localized content with fallbacks
  const name = isArabic
    ? product.name_ar || product.name_en
    : product.name_en || product.name_ar;

  const description = isArabic
    ? product.description_ar || product.description_en
    : product.description_en || product.description_ar;

  const title =
    (isArabic ? product.seo_title_ar : product.seo_title_en) || name;

  const seoDescription =
    (isArabic ? product.seo_description_ar : product.seo_description_en) ||
    description?.slice(0, 160) ||
    "";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zain.eg";
  const arPath = `/products/${slug}`;
  const enPath = `/en/products/${slug}`;

  return {
    title,
    description: seoDescription,
    alternates: {
      canonical: isArabic ? `${baseUrl}${arPath}` : `${baseUrl}${enPath}`,
      languages: {
      ar: `${baseUrl}${arPath}`,
      en: `${baseUrl}${enPath}`,
      "x-default": `${baseUrl}${arPath}`,
      },
    },
    openGraph: {
        title: title ?? undefined,
      description: seoDescription,
      type: "website",
      locale: isArabic ? "ar_EG" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
        title: title ?? undefined,
      description: seoDescription,
    },
  };
}