'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDemoRole } from '@/contexts/DemoRoleContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { demoRole } = useDemoRole();

  React.useEffect(() => {
    if (demoRole !== 'admin') {
      router.push('/');
    }
  }, [demoRole, router]);

  const tabs = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Bookings', path: '/admin/bookings' },
    { name: 'Professionals', path: '/admin/professionals' },
    { name: 'Services', path: '/admin/services' },
  ];

  if (demoRole !== 'admin') return null;

  return (
    <div className="bg-slate-50 min-h-screen pt-4">
      <div className="flex justify-center mb-8 px-4">
        <nav className="bg-white border border-slate-200 shadow-sm rounded-full p-1 flex items-center overflow-x-auto no-scrollbar max-w-full">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`py-2.5 px-6 text-sm font-bold rounded-full whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-black text-white shadow-md' 
                    : 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
