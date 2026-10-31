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

const IconDashboard = () => (
  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
  </svg>
);

const IconOrders = () => (
  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M8 7V6a4 4 0 018 0v1m-11 0h14l1 13H4L5 7z" />
  </svg>
);

const IconInventory = () => (
  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const IconReturns = () => (
  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M9 14l-4-4 4-4M5 10h9a5 5 0 015 5v3" />
  </svg>
);

const IconDeliveries = () => (
  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M3 6h11v11H3zM14 10h4l3 3v4h-7zM7 20a2 2 0 100-4 2 2 0 000 4zM18 20a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

const IconCategories = () => (
  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z" />
  </svg>
);

const IconBrands = () => (
  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M20 13l-7 7-10-10V3h7l10 10z" />
    <circle cx="7.5" cy="7.5" r="1" strokeWidth="1.7" />
  </svg>
);

const IconAlert = () => (
  <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v3m0 4h.01M10.3 4.9L2.8 18a1.5 1.5 0 001.3 2.2h15.8a1.5 1.5 0 001.3-2.2L13.7 4.9a2 2 0 00-3.4 0z" />
  </svg>
);

export default function StaffSidebar({
  operations,
  className = '',
}: StaffSidebarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('StaffNavigation');

  const stats = operations ?? {
    pendingReturns: 0,
    pendingDeliveries: 0,
    inventory: {
      outOfStockCount: 0,
      lowStockCount: 0,
    },
  };

  const basePath = `/${locale}/staff`;

  const navItems = [
    {
      href: basePath,
      label: t('dashboard'),
      icon: IconDashboard,
      exact: true,
    },
    {
      href: `${basePath}/orders`,
      label: t('orders'),
      icon: IconOrders,
    },
    {
      href: `${basePath}/inventory`,
      label: t('inventory'),
      icon: IconInventory,
      badge:
        stats.inventory.outOfStockCount > 0
          ? stats.inventory.outOfStockCount
          : null,
      badgeVariant: 'danger' as const,
    },
    {
      href: `${basePath}/returns`,
      label: t('returns'),
      icon: IconReturns,
      badge: stats.pendingReturns > 0 ? stats.pendingReturns : null,
      badgeVariant: 'warning' as const,
    },
    {
      href: `${basePath}/deliveries`,
      label: t('deliveries'),
      icon: IconDeliveries,
      badge: stats.pendingDeliveries > 0 ? stats.pendingDeliveries : null,
      badgeVariant: 'info' as const,
    },
    {
      href: `${basePath}/categories`,
      label: t('categories'),
      icon: IconCategories,
    },
    {
      href: `${basePath}/brands`,
      label: t('brands'),
      icon: IconBrands,
    },
  ];

  const isItemActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      aria-label={t('sidebarAriaLabel')}
      className={`flex h-full w-64 shrink-0 flex-col border-e border-slate-200 bg-white text-slate-700 ${className}`}
    >
      {/* Brand */}
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm shadow-blue-600/20">
            Z
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold tracking-tight text-slate-900">
              Zain IT
            </h2>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {locale === 'ar' ? 'إدارة المتجر' : 'Store Management'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label={t('sidebarAriaLabel')}
        className="flex-1 space-y-1 overflow-y-auto px-3 py-5"
      >
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {locale === 'ar' ? 'القائمة الرئيسية' : 'MAIN MENU'}
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-blue-50 font-semibold text-blue-700'
                  : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span
                className={`absolute inset-y-2 start-0 w-0.5 rounded-e-full transition-colors ${
                  isActive ? 'bg-blue-600' : 'bg-transparent'
                }`}
                aria-hidden="true"
              />

              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`shrink-0 ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-400 transition-colors group-hover:text-slate-600'
                  }`}
                >
                  <Icon />
                </span>

                <span className="truncate">{item.label}</span>
              </span>

              {item.badge !== null && item.badge !== undefined && (
                <span
                  className={`inline-flex min-w-5 shrink-0 items-center justify-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums ${
                    item.badgeVariant === 'danger'
                      ? 'bg-red-50 text-red-600'
                      : item.badgeVariant === 'warning'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {item.badgeVariant === 'danger' && <IconAlert />}
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-600">Zain Store</p>
            <p className="mt-1 text-[11px] text-slate-400">Admin Panel · v2.4</p>
          </div>

          <span
            className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"
            title="System operational"
            aria-label="System operational"
          />
        </div>
      </div>
    </aside>
  );
}
