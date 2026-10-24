// app/[locale]/(dashboards)/staff/layout.tsx
import StaffSidebar from '@/components/navigation/staff-sidebar';
import React, { ReactNode } from 'react';

interface StaffDashboardLayoutProps {
   children: ReactNode;
}

export default async function StaffDashboardLayout({ children }: StaffDashboardLayoutProps) {
   // You can fetch or pass real operational stats here (e.g., from Supabase)
   const operationsData = {
      pendingReturns: 3,
      pendingDeliveries: 12,
      inventory: { 
         outOfStockCount: 3, // Triggers the quantity alert badge in the sidebar
         lowStockCount: 5 
      }
   };

   return (
      <div className="flex h-screen bg-slate-950 overflow-hidden">
         {/* Persistent Staff Sidebar (hidden on mobile, can be toggled via mobile menu if needed) */}
         <StaffSidebar operations={operationsData} className="hidden md:flex shrink-0" />

         {/* Main Content Area housing all staff pages */}
         <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-100">
         <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
         </main>
         </div>
      </div>
   );
}