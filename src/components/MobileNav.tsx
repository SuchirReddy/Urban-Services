'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Calendar, Briefcase, ShieldAlert, Menu, X } from 'lucide-react';
import { useDemoRole } from '@/contexts/DemoRoleContext';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { demoRole } = useDemoRole();
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: LayoutGrid },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
  ];

  return (
    <div className="md:hidden">
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {/* Expanded Menu */}
        <div 
          className={`absolute bottom-[72px] right-0 bg-slate-900 shadow-xl border border-slate-700/50 rounded-3xl p-3 flex flex-col gap-2 min-w-[160px] origin-bottom-right transition-all duration-200 ease-in-out ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'}`}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                isActive(item.path) 
                  ? 'bg-indigo-600/20 text-indigo-400' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm tracking-wide">{item.name}</span>
            </Link>
          ))}

          {demoRole === 'admin' ? (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                isActive('/admin') 
                  ? 'bg-indigo-600/20 text-indigo-400' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              <span className="font-medium text-sm tracking-wide">Admin</span>
            </Link>
          ) : (
            <Link
              href="/professional"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                isActive('/professional') 
                  ? 'bg-indigo-600/20 text-indigo-400' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="font-medium text-sm tracking-wide">Pro</span>
            </Link>
          )}
        </div>

        {/* FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-[0_8px_30px_rgb(79,70,229,0.4)] flex items-center justify-center transition-transform active:scale-95"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
