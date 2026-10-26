'use client';

import ProductGrid from '@/components/storefront/product-grid';
import type { Product } from '../types/product';

interface RelatedProductsProps {
   products: Product[];
   title?: string;
   subtitle?: string;
   locale?: string;
}

export default function RelatedProducts({
   products,
   title = "Related Equipment",
   subtitle = "Complete your setup with compatible networking gear",
   locale = "en",
}: RelatedProductsProps) {
   if (!products || products.length === 0) return null;

   return (
      <section className="py-12 border-t border-slate-200/80 bg-slate-50/50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Recommendations
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {title}
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