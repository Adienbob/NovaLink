// src/features/seo/components/breadcrumb-json-ld.tsx
import { baseUrl } from '@/app/lib/utils/utils';
import React from 'react';

interface BreadcrumbItem {
   name: string;
   url: string;
}

interface BreadcrumbJsonLdProps {
   items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {

   const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
         '@type': 'ListItem',
         position: index + 1,
         name: item.name,
         item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
      })),
   };

   return (
      <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
   );
}