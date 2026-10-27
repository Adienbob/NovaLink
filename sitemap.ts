import { MetadataRoute } from 'next';
import { supabaseAdmin } from './app/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

   const sitemapEntries: MetadataRoute.Sitemap = [
      {
         url: baseUrl,
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: 1.0,
         alternates: {
         languages: {
            ar: baseUrl,
            en: `${baseUrl}/en`,
         },
         },
      },
   ];

   // 1. Fetch active products
   const { data: products } = await supabaseAdmin
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true);

   if (products) {
      for (const product of products) {
         const lastMod = new Date(product.updated_at || Date.now());
         sitemapEntries.push(
         {
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: lastMod,
            changeFrequency: 'weekly',
            priority: 0.8,
            alternates: {
               languages: {
               ar: `${baseUrl}/products/${product.slug}`,
               en: `${baseUrl}/en/products/${product.slug}`,
               },
            },
         },
         {
            url: `${baseUrl}/en/products/${product.slug}`,
            lastModified: lastMod,
            changeFrequency: 'weekly',
            priority: 0.8,
            alternates: {
               languages: {
               ar: `${baseUrl}/products/${product.slug}`,
               en: `${baseUrl}/en/products/${product.slug}`,
               },
            },
         }
         );
      }
   }

   // 2. Fetch categories
   const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('slug');

   if (categories) {
      for (const cat of categories) {
         sitemapEntries.push(
         {
            url: `${baseUrl}/categories/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
         },
         {
            url: `${baseUrl}/en/categories/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
         }
         );
      }
   }

   // 3. Fetch brands
   const { data: brands } = await supabaseAdmin
      .from('brands')
      .select('slug');

   if (brands) {
      for (const brand of brands) {
         sitemapEntries.push(
         {
            url: `${baseUrl}/brands/${brand.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
               languages: {
               ar: `${baseUrl}/brands/${brand.slug}`,
               en: `${baseUrl}/en/brands/${brand.slug}`,
               },
            },
         },
         {
            url: `${baseUrl}/en/brands/${brand.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
               languages: {
               ar: `${baseUrl}/brands/${brand.slug}`,
               en: `${baseUrl}/en/brands/${brand.slug}`,
               },
            },
         }
         );
      }
   }

   return sitemapEntries;
}