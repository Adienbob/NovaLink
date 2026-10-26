// src/components/home/Hero.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
}

interface HeroProps {
  locale?: string;
  slides?: HeroSlide[];
}

// Default slides incorporating your image path
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: 'Enterprise Solutions 2026',
    title: 'Build High-Performance Enterprise Networks',
    description: 'Explore state-of-the-art routers, managed switches, and access points built for unmatched speed and reliability.',
    ctaText: 'Explore Catalog',
    ctaLink: '/products',
    imageSrc: '/hero banner.png',
  },
  {
    id: 'slide-4',
    badge: 'Enterprise Solutions 2026',
    title: 'Build High-Performance Enterprise Networks',
    description: 'Explore state-of-the-art routers, managed switches, and access points built for unmatched speed and reliability.',
    ctaText: 'Explore Catalog',
    ctaLink: '/products',
    imageSrc: '/hero banner.png',
  },
  {
    id: 'slide-2',
    badge: 'Official Distributor',
    title: 'Top-Tier Networking Gear & Accessories',
    description: 'Direct access to certified Cisco, Aruba, and Grandstream equipment with full Egyptian local warranty.',
    ctaText: 'View Brands',
    ctaLink: '/brands',
    imageSrc: '/hero banner.png',
  },
  {
    id: 'slide-3',
    badge: 'Next-Gen Connectivity',
    title: 'Empower Your Business Infrastructure',
    description: 'Scalable Wi-Fi 6 access points and structured cabling solutions engineered for dense modern environments.',
    ctaText: 'Shop Solutions',
    ctaLink: '/categories',
    imageSrc: '/hero banner.png',
  },
];

export default function Hero({ locale = 'en', slides = DEFAULT_SLIDES }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isRtl = locale === 'ar';

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay functionality (5 seconds interval)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <section
      className="relative overflow-hidden m-0 bg-slate-950 max-h-[350px] flex items-center group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. SLIDER CONTAINER */}
      <div className="absolute inset-0 z-0">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(${isRtl ? currentIndex * 100 : -currentIndex * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative min-w-full h-full flex-shrink-0">
              <Image
                src={slide.imageSrc}
                alt={slide.title}
                fill
                priority={index === 0}
                className="w-full h-full object-fill object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. TEXT CONTENT WITH STAGGERED BOTTOM-TO-TOP ANIMATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl space-y-6">
          {slides.map((slide, index) => {
            if (index !== currentIndex) return null;

            return (
              <div key={`content-${slide.id}`} className="space-y-6">
                {/* 1. Eyebrow Tag */}
                <div className="animate-fade-in-up [animation-delay:150ms] opacity-0">
                  <span className="inline-flex items-center rounded-full bg-blue-500/20 border border-blue-500/30 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
                    {slide.badge}
                  </span>
                </div>

                {/* 2. Main Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] animate-fade-in-up [animation-delay:350ms] opacity-0">
                  {slide.title}
                </h1>

                {/* 3. Description */}
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl animate-fade-in-up [animation-delay:550ms] opacity-0">
                  {slide.description}
                </p>

                {/* 4. Action Button */}
                <div className="flex flex-wrap items-center gap-4 pt-4 animate-fade-in-up [animation-delay:750ms] opacity-0">
                  <Link href={`/${locale}${slide.ctaLink}`}>
                    <Button
                      size="lg"
                      className="h-12 px-8 font-semibold text-sm shadow-xl bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 hover:scale-[1.02]"
                    >
                      {slide.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. NAVIGATION ARROWS (Left & Right) */}
      <button
        onClick={isRtl ? nextSlide : prevSlide}
        aria-label="Previous Slide"
        className="absolute start-4 lg:start-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/60 border border-slate-700/60 text-white backdrop-blur-md transition-all duration-300 hover:bg-blue-600 hover:border-blue-500 hover:scale-110 opacity-0 group-hover:opacity-100"
      >
        <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={isRtl ? prevSlide : nextSlide}
        aria-label="Next Slide"
        className="absolute end-4 lg:end-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/60 border border-slate-700/60 text-white backdrop-blur-md transition-all duration-300 hover:bg-blue-600 hover:border-blue-500 hover:scale-110 opacity-0 group-hover:opacity-100"
      >
        <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 4. SLIDE DOT INDICATORS */}
      <div className="absolute bottom-6 start-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'w-8 bg-blue-500'
                : 'w-2.5 bg-slate-600/70 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
}