'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationListener from '@/components/NotificationListener';

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Dashboard', path: '/professional' },
    { name: 'Job Requests', path: '/professional/requests' },
    { name: 'Earnings', path: '/professional/earnings' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <NotificationListener />
      
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`py-4 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${
                    isActive 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
