import React from 'react';
import ProductGrid from './product-grid';
import { ProductCardTypes } from '@/features/catalog/products/types/product-card';
import { Locale } from '@/app/lib/types/general-types';

interface BuildNetworkSectionProps {
   products: ProductCardTypes[];
   locale: Locale;
   title?: string;
   subtitle?: string;
}

export default function BuildNetworkSection({
   products,
   locale,
   title = 'Build Your Own Network',
   subtitle = 'High-performance routers, switches, and access points configured for ultimate speed.',
}: BuildNetworkSectionProps) {
   if (!products || products.length === 0) return null;

   const isRtl = locale === 'ar';

   return (
      <section className="py-4 border-t border-slate-200/80 bg-slate-50/50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
               <div>
                  
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {isRtl ? 'تصميم شبكتك الاحترافية' : title}
                  </h2>
                  {subtitle && (
                  <p className="text-sm text-slate-500 mt-1 max-w-xl">
                     {subtitle}
                  </p>
                  )}
               </div>
            </div>

            <ProductGrid 
               products={products}
               locale={locale}
            
            />

         </div>
      </section>
   );
}