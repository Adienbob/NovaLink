'use client';

import { useEffect, useRef } from 'react';
import { trackPurchase } from '@/app/lib/analytics/gtm';

interface OrderSuccessAnalyticsProps {
   order: {
      id: string; // Order transaction ID
      totalAmount: number;
      shippingFee: number;
      items: Array<{
         id: string;
         name: string;
         price: number;
         quantity: number;
         brand?: string;
         category?: string;
      }>;
   };
}

export function OrderSuccessAnalytics({ order }: OrderSuccessAnalyticsProps) {
   const hasFired = useRef(false);

   useEffect(() => {
      // Prevent duplicate firing on component re-renders or page refreshes
      if (hasFired.current) return;

      trackPurchase({
         transactionId: order.id,
         totalValue: order.totalAmount,
         shippingCost: order.shippingFee,
         items: order.items.map((item) => ({
         item_id: item.id,
         item_name: item.name,
         price: item.price,
         quantity: item.quantity,
         item_brand: item.brand,
         item_category: item.category,
         })),
      });

      hasFired.current = true;
   }, [order]);

   return null;
}