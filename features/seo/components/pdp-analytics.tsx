'use client';

import { useEffect } from 'react';
import { trackViewItem } from '@/app/lib/analytics/gtm';

interface PDPAnalyticsProps {
   product: {
      id: string;
      name: string;
      price: number;
      brandName?: string;
      categoryName?: string;
   };
}

export function PDPAnalytics({ product }: PDPAnalyticsProps) {
   useEffect(() => {
      trackViewItem({
         item_id: product.id,
         item_name: product.name,
         price: product.price,
         item_brand: product.brandName,
         item_category: product.categoryName,
      });
   }, [product]);

   return null;
}