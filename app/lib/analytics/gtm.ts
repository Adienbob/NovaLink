// src/app/lib/analytics/gtm.ts

type GTMProduct = {
   item_id: string;
   item_name: string;
   price: number;
   item_brand?: string;
   item_category?: string;
   quantity?: number;
};

export const pushToDataLayer = (eventData: Record<string, unknown>) => {
   if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ ecommerce: null }); // Reset ecommerce object
      window.dataLayer.push(eventData);
   }
};

// 1. Track Product View (PDP)
export const trackViewItem = (product: GTMProduct, currency: string = 'EGP') => {
   pushToDataLayer({
      event: 'view_item',
      ecommerce: {
         currency,
         value: product.price,
         items: [
         {
            item_id: product.item_id,
            item_name: product.item_name,
            item_brand: product.item_brand || 'Zain',
            item_category: product.item_category,
            price: product.price,
            quantity: 1,
         },
         ],
      },
   });
};

// 2. Track Add To Cart Action
export const trackAddToCart = (product: GTMProduct, quantity: number = 1, currency: string = 'EGP') => {
   pushToDataLayer({
      event: 'add_to_cart',
      ecommerce: {
         currency,
         value: product.price * quantity,
         items: [
         {
            item_id: product.item_id,
            item_name: product.item_name,
            item_brand: product.item_brand || 'Zain',
            item_category: product.item_category,
            price: product.price,
            quantity,
         },
         ],
      },
   });
};

// 3. Track Category / Brand View Item List
export const trackViewItemList = (listName: string, products: GTMProduct[], currency: string = 'EGP') => {
   pushToDataLayer({
      event: 'view_item_list',
      ecommerce: {
         item_list_name: listName,
         items: products.map((item, index) => ({
         item_id: item.item_id,
         item_name: item.item_name,
         item_brand: item.item_brand || 'Zain',
         item_category: item.item_category,
         price: item.price,
         index: index + 1,
         })),
      },
   });
};

export const trackBeginCheckout = (items: GTMProduct[], totalValue: number, currency: string = 'EGP') => {
   pushToDataLayer({
      event: 'begin_checkout',
      ecommerce: {
         currency,
         value: totalValue,
         items: items.map((item) => ({
         item_id: item.item_id,
         item_name: item.item_name,
         item_brand: item.item_brand || 'Zain',
         item_category: item.item_category,
         price: item.price,
         quantity: item.quantity || 1,
         })),
      },
   });
};

export const trackPurchase = ({
   transactionId,
   totalValue,
   shippingCost = 0,
   tax = 0,
   items,
   currency = 'EGP',
}: {
   transactionId: string;
   totalValue: number;
   shippingCost?: number;
   tax?: number;
   items: GTMProduct[];
   currency?: string;
}) => {
   pushToDataLayer({
      event: 'purchase',
      ecommerce: {
         transaction_id: transactionId,
         value: totalValue,
         tax,
         shipping: shippingCost,
         currency,
         items: items.map((item) => ({
         item_id: item.item_id,
         item_name: item.item_name,
         item_brand: item.item_brand || 'Zain',
         item_category: item.item_category,
         price: item.price,
         quantity: item.quantity || 1,
         })),
      },
   });
};