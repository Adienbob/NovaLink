// features/catalog/categories/queries/get-category-metadata.ts
import { Metadata } from 'next';
import { baseUrl } from '@/app/lib/utils/utils';
import { supabaseAdmin } from '@/app/lib/supabase/server';

interface GetCategoryMetadataParams {
   slug: string;
   locale: string;
   searchParams?: { [key: string]: string | string[] | undefined };
}

export async function getCategoryMetadata({
   slug,
   locale,
   searchParams = {},
}: GetCategoryMetadataParams): Promise<Metadata> {
   const isRtl = locale === 'ar';

   const { data: category } = await supabaseAdmin
      .from('categories')
      .select('name, name_ar, description_ar, description_en')
      .eq('slug', slug)
      .single();

   if (!category) {
      return {
         title: isRtl ? 'القسم غير موجود' : 'Category Not Found',
      };
   }

   // Resolve localized name and description
   const categoryName = isRtl ? category.name_ar || category.name : category.name;
   const categoryDescription = isRtl
      ? category.description_ar || `تسوق أحدث منتجات ${categoryName} بأفضل الأسعار في مصر من زين.`
      : category.description_en || `Shop the latest ${categoryName} products at best prices in Egypt from Zain.`;

   const basePath = locale === 'en' ? `/en/categories/${slug}` : `/categories/${slug}`;
   const arPath = `/categories/${slug}`;
   const enPath = `/en/categories/${slug}`;

   // Check filter vs pagination presence
   const hasFilters = Object.keys(searchParams).some(
      (key) => key !== 'page' && searchParams[key] !== undefined
   );
   const pageParam = typeof searchParams.page === 'string' ? searchParams.page : undefined;

   // Determine canonical URL: Filtered pages canonicalize to base category URL
   const canonicalUrl = hasFilters
      ? `${baseUrl}${basePath}`
      : pageParam
      ? `${baseUrl}${basePath}?page=${pageParam}`
      : `${baseUrl}${basePath}`;

   // Build page title suffix for pagination
   const pageTitleSuffix = pageParam ? ` - ${isRtl ? 'صفحة' : 'Page'} ${pageParam}` : '';
   const title = `${categoryName}${pageTitleSuffix}`;
   const description = categoryDescription.slice(0, 160);

   return {
      title,
      description,
      robots: hasFilters
         ? { index: false, follow: true }
         : { index: true, follow: true },
      alternates: {
         canonical: canonicalUrl,
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