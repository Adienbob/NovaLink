// features/catalog/products/queries/get-product-metadata.ts
import { Metadata } from 'next';
import { supabaseAdmin } from '@/app/lib/supabase/server';

interface GetProductMetadataParams {
   slug: string;
   locale: string;
}

export async function getProductMetadata({
   slug,
   locale,
}: GetProductMetadataParams): Promise<Metadata> {
   const { data: product } = await supabaseAdmin
      .from('products')
      .select('name, description, seo_title, seo_description')
      .eq('slug', slug)
      .single();

   if (!product) {
      return {
         title: locale === 'ar' ? 'المنتج غير موجود' : 'Product Not Found',
      };
   }

   const title = product.seo_title || product.name;
   const description =
      product.seo_description || product.description?.slice(0, 160) || '';

   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zain.eg';
   const arPath = `/products/${slug}`;
   const enPath = `/en/products/${slug}`;

   return {
      title,
      description,
      alternates: {
         canonical: locale === 'ar' ? `${baseUrl}${arPath}` : `${baseUrl}${enPath}`,
         languages: {
         ar: `${baseUrl}${arPath}`,
         en: `${baseUrl}${enPath}`,
         'x-default': `${baseUrl}${arPath}`,
         },
      },
      openGraph: {
         title,
         description,
         type: 'website',
         locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      },
      twitter: {
         card: 'summary_large_image',
         title,
         description,
      },
   };
}