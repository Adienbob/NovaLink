// src/components/home/BannersGrid.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface BannerConfig {
  id: string;
  title: string;
  src: string; // Leave empty or pass image path
  alt: string;
  href: string;
}

interface BannersGridProps {
  // Optional custom paths if passed via props
  wideBannerSrc?: string;
  lessWiderFullHeightSrc?: string;
  stackedTopSrc?: string;
  stackedBottomSrc?: string;
  smallTopSrc?: string;
  smallBottomSrc?: string;
  className?: string;
}

export default function BannersGrid({
  wideBannerSrc = '/wide.png', // Fill your image path here
  lessWiderFullHeightSrc = '/lessWider.png', // Fill your image path here
  stackedTopSrc = '/small.png', // Fill your image path here
  stackedBottomSrc = '/small2.png', // Fill your image path here
  smallTopSrc = '', // Fill your image path here
  smallBottomSrc = '', // Fill your image path here
  className = '',
}: BannersGridProps) {
  const locale = useLocale();

  return (
    <section className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {/* 
        Responsive Layout Grid:
        - Mobile: Single column stack
        - Tablet (md): 2 columns
        - Desktop (lg): 4-column balanced grid layout
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
        
        {/* 1. Main Wide Banner (Desktop: 6 cols span) */}
        <div className="lg:col-span-6 flex flex-col">
          <Link 
            href={`/${locale}/products`} 
            className="group relative w-full h-64 sm:h-80 md:h-full min-h-[320px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            {wideBannerSrc ? (
              <Image
                src={wideBannerSrc}
                alt="Zain Wide Master Banner - Networking Solutions"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              /* Placeholder background when path is empty */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white text-center">
                <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">
                  Main Hero Showcase
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold">Wide Banner Placeholder</h3>
                <p className="text-xs text-slate-400 mt-2">`wideBannerSrc`</p>
              </div>
            )}
            <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors" />
          </Link>
        </div>

        {/* 2. Less Wider Banner (Full Height - Desktop: 3 cols span) */}
        <div className="lg:col-span-3 flex flex-col">
          <Link 
            href={`/${locale}/categories/routers`} 
            className="group relative w-full h-80 sm:h-96 md:h-full min-h-[320px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            {lessWiderFullHeightSrc ? (
              <Image
                src={lessWiderFullHeightSrc}
                alt="Zain Less Wider Full-Height Banner - Routers & Switches"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              /* Placeholder background when path is empty */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-800 to-slate-900 text-white text-center">
                <span className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-2">
                  Full Height Feature
                </span>
                <h3 className="text-lg font-bold">Less Wider Banner</h3>
                <p className="text-xs text-slate-400 mt-2">`lessWiderFullHeightSrc`</p>
              </div>
            )}
            <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors" />
          </Link>
        </div>

        {/* 3 & 4. Two Small Banners Stacked On Each Other (Desktop: 3 cols span) */}
        <div className="lg:col-span-3 flex flex-col gap-4 justify-between">
          
          {/* Top Small Banner */}
          <Link 
            href={`/${locale}/categories/range-extenders`} 
            className="group relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            {stackedTopSrc ? (
              <Image
                src={stackedTopSrc}
                alt="Zain Extenders Small Banner"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              /* Placeholder background when path is empty */
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-r from-slate-800 to-blue-950 text-white text-center">
                <span className="text-xs font-semibold text-blue-400">Stacked Top</span>
                <p className="text-xs text-slate-400 mt-1">`stackedTopSrc`</p>
              </div>
            )}
            <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors" />
          </Link>

          {/* Bottom Small Banner */}
          <Link 
            href={`/${locale}/categories/access-points`} 
            className="group relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            {stackedBottomSrc ? (
              <Image
                src={stackedBottomSrc}
                alt="Zain Access Points Small Banner"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              /* Placeholder background when path is empty */
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-r from-slate-900 to-blue-900 text-white text-center">
                <span className="text-xs font-semibold text-blue-400">Stacked Bottom</span>
                <p className="text-xs text-slate-400 mt-1">`stackedBottomSrc`</p>
              </div>
            )}
            <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors" />
          </Link>

        </div>

      </div>
    </section>
  );
}