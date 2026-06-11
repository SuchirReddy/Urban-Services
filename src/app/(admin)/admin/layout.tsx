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
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`py-4 px-1 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'border-indigo-400 text-indigo-400' 
                      : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
