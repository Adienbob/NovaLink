// src/components/navigation/asides/StaffSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

interface InventoryAlert {
  outOfStockCount: number;
  lowStockCount: number;
}

interface OperationsData {
  pendingReturns: number;
  pendingDeliveries: number;
  inventory: InventoryAlert;
}

interface StaffSidebarProps {
  operations?: OperationsData;
  className?: string;
}

// Pure SVG Icon helpers to avoid external icon dependencies
const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
  </svg>
);

const IconOrders = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const IconInventory = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const IconReturns = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

const IconDeliveries = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const IconCategories = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const IconBrands = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const IconAlert = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default function StaffSidebar({ operations, className = '' }: StaffSidebarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('StaffNavigation');

  const stats = operations || {
    pendingReturns: 3,
    pendingDeliveries: 12,
    inventory: { outOfStockCount: 3, lowStockCount: 5 }
  };

  const navItems = [
    { 
      href: `/${locale}/admin`, 
      label: t('dashboard'), 
      icon: IconDashboard,
      exact: true 
    },
    { 
      href: `/${locale}/admin/orders`, 
      label: t('orders'), 
      icon: IconOrders 
    },
    { 
      href: `/${locale}/admin/inventory`, 
      label: t('inventory'), 
      icon: IconInventory,
      badge: stats.inventory.outOfStockCount > 0 
        ? `${stats.inventory.outOfStockCount} ${t('emptyUnits')}` 
        : null,
      badgeVariant: 'danger'
    },
    { 
      href: `/${locale}/admin/returns`, 
      label: t('returns'), 
      icon: IconReturns,
      badge: stats.pendingReturns > 0 ? `${stats.pendingReturns}` : null,
      badgeVariant: 'warning'
    },
    { 
      href: `/${locale}/admin/deliveries`, 
      label: t('deliveries'), 
      icon: IconDeliveries,
      badge: stats.pendingDeliveries > 0 ? `${stats.pendingDeliveries}` : null,
      badgeVariant: 'info'
    },
    { 
      href: `/${locale}/admin/categories`, 
      label: t('categories'), 
      icon: IconCategories 
    },
    { 
      href: `/${locale}/admin/brands`, 
      label: t('brands'), 
      icon: IconBrands 
    },
  ];

  return (
    <aside 
      aria-label={t('sidebarAriaLabel')} 
      className={`w-64 bg-slate-900 text-slate-100 flex flex-col h-full border-e border-slate-800 select-none ${className}`}
    >
      {/* Brand & Project Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          Z
        </div>
        <div>
          <h2 className="font-bold text-sm tracking-wide text-white">Zain IT Admin</h2>
          <span className="text-xs text-slate-400 font-medium">Networking & Infrastructure</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                }`}>
                  <IconComponent />
                </span>
                <span>{item.label}</span>
              </div>
              
              {item.badge && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1 transition-all ${
                  isActive
                    ? 'bg-white/20 text-white border border-white/20'
                    : item.badgeVariant === 'danger' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' 
                    : item.badgeVariant === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {item.badgeVariant === 'danger' && <IconAlert />}
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info / Versioning */}
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
        <span>Zain Store v2.4</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="System Operational" />
      </div>
    </aside>
  );
}