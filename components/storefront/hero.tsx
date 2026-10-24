'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

interface HeroProps {
  locale?: string;
  heroImageSrc?: string;
}

const HEADING = 'Discover Premium Tech & Modern Lifestyle Essentials';
const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

export default function Hero({
  locale = 'en',
  heroImageSrc = '/hero banner.png',
}: HeroProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowContent(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  const words = HEADING.split(' ');
  const headingEnd = 300 + words.length * 80; // when the last word starts

  return (
    <section className="relative flex min-h-[550px] items-center overflow-hidden bg-slate-950 py-24 lg:py-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {heroImageSrc ? (
          <Image
            src={heroImageSrc}
            alt="Zain Networking Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950" />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow: fade + scale + blur */}
          <span
            className={`inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md transition-[opacity,transform,filter] duration-700 ${EASE} motion-reduce:transition-none ${
              showContent
                ? 'scale-100 opacity-100 blur-0'
                : 'scale-90 opacity-0 blur-sm'
            }`}
          >
            New Season Arrivals 2026
          </span>

          {/* Heading: word-by-word mask reveal */}
          <h1
            aria-label={HEADING}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {words.map((word, i) => (
              <React.Fragment key={`${word}-${i}`}>
                <span
                  aria-hidden="true"
                  className="inline-block overflow-hidden pb-[0.1em] align-bottom"
                >
                  <span
                    className={`inline-block transition-[transform,opacity] duration-700 ${EASE} motion-reduce:transition-none ${
                      showContent
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-full opacity-0'
                    }`}
                    style={{ transitionDelay: `${300 + i * 80}ms` }}
                  >
                    {word}
                  </span>
                </span>{' '}
              </React.Fragment>
            ))}
          </h1>

          {/* Description: fade + blur-in */}
          <p
            className={`max-w-2xl text-base leading-relaxed text-slate-300 transition-[opacity,filter] duration-1000 ease-out motion-reduce:transition-none sm:text-lg ${
              showContent ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
            }`}
            style={{ transitionDelay: `${headingEnd}ms` }}
          >
            Shop top-tier brands, high-performance electronics, and everyday
            innovations curated specifically for you at Zain.
          </p>

          {/* Action: fade + scale-up */}
          <div
            className={`flex flex-wrap items-center gap-4 pt-4 transition-[opacity,transform] duration-700 ${EASE} motion-reduce:transition-none ${
              showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
            style={{ transitionDelay: `${headingEnd + 250}ms` }}
          >
            <Link href={`/${locale}/brands`}>
              <Button
                size="lg"
                className="h-12 bg-blue-600 px-8 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500"
              >
                Explore Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}