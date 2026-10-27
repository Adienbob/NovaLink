// features/catalog/brands/queries/get-brand-metadata.ts
import { Metadata } from 'next';
import { baseUrl } from '@/app/lib/utils/utils';
import { supabaseAdmin } from '@/app/lib/supabase/server';

interface GetBrandMetadataParams {
   slug: string;
   locale: string;
}

export async function getBrandMetadata({
   slug,
   locale,
}: GetBrandMetadataParams): Promise<Metadata> {
   const isRtl = locale === 'ar';

   const { data: brand } = await supabaseAdmin
      .from('brands')
      .select('name, name_ar, description_ar, description_en')
      .eq('slug', slug)
      .single();

   if (!brand) {
      return {
         title: isRtl ? 'العلامة التجارية غير موجودة' : 'Brand Not Found',
      };
   }

   // Resolve localized name and description
   const brandName = isRtl ? brand.name_ar || brand.name : brand.name;
   const brandDescription = isRtl
      ? brand.description_ar || `تسوق أحدث منتجات ${brandName} بأفضل الأسعار في مصر من زين.`
      : brand.description_en || `Shop the latest ${brandName} products at best prices in Egypt from Zain.`;

   const title = brandName;
   const description = brandDescription.slice(0, 160);

   const arPath = `/brands/${slug}`;
   const enPath = `/en/brands/${slug}`;

   return {
      title,
      description,
      alternates: {
         canonical: isRtl ? `${baseUrl}${arPath}` : `${baseUrl}${enPath}`,
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
         locale: isRtl ? 'ar_EG' : 'en_US',
      },
      twitter: {
         card: 'summary_large_image',
         title,
         description,
      },
   };
}