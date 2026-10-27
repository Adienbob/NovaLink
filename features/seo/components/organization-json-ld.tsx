// src/features/seo/components/organization-json-ld.tsx
import { baseUrl } from '@/app/lib/utils/utils';
import React from 'react';

export function OrganizationJsonLd() {

   const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#organization`,
      name: 'Zain Egypt',
      alternateName: 'زين مصر للحلول الشبكية',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      image: `${baseUrl}/og-image.jpg`,
      description: 'Authorized distributor of enterprise networking equipment, routers, switches, and IT infrastructure in Egypt.',
      address: {
         '@type': 'PostalAddress',
         streetAddress: 'El-Tahrir St',
         addressLocality: 'Cairo',
         addressRegion: 'Cairo Governorate',
         postalCode: '11511',
         addressCountry: 'EG',
      },
      geo: {
         '@type': 'GeoCoordinates',
         latitude: 30.0444,
         longitude: 31.2357,
      },
      telephone: '+20-2-00000000',
      priceRange: '$$$',
      currenciesAccepted: 'EGP',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer',
      areaServed: {
         '@type': 'Country',
         name: 'Egypt',
      },
      sameAs: [
         'https://www.facebook.com/zain.egypt',
         'https://www.linkedin.com/company/zain-egypt',
      ],
   };

   return (
      <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
   );
}