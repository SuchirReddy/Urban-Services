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
    <div className="bg-slate-50 min-h-screen pt-4">
      <NotificationListener />
      
      <div className="flex justify-center mb-4 px-4">
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
