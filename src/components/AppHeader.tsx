'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDemoRole } from '@/contexts/DemoRoleContext';
import { usePathname, useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronDown, UserCircle2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
}

export default function AppHeader() {
  const { demoRole, selectedUserName, setDemoCustomer, setDemoProfessional, setDemoAdmin, clearDemoRole } = useDemoRole();
  const [users, setUsers] = useState<User[]>([]);
  const [professionals, setProfessionals] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname?.startsWith(path);

  useEffect(() => {
    // Fetch users and professionals for the dropdown
    async function fetchData() {
      setLoading(true);
      try {
        const [usersRes, prosRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/professionals'),
        ]);
        if (usersRes.ok) setUsers(await usersRes.json());
        if (prosRes.ok) setProfessionals(await prosRes.json());
      } catch (e) {
        console.error('Failed to fetch roles data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const renderRoleSelector = () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-slate-200/60 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400">
        {demoRole ? (
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">
              {selectedUserName ? selectedUserName.charAt(0) : demoRole.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <UserCircle2 className="w-5 h-5" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-slate-100">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch Demo Role</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Customer
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48 max-h-64 overflow-y-auto rounded-xl shadow-xl border-slate-100">
            {loading ? (
              <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
            ) : (
              users.map(u => (
                <DropdownMenuItem key={u.id} onClick={() => setDemoCustomer(u.id, u.name)}>
                  {u.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Professional
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48 max-h-64 overflow-y-auto rounded-xl shadow-xl border-slate-100">
            {loading ? (
              <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
            ) : (
              professionals.map(p => (
                <DropdownMenuItem key={p.id} onClick={() => setDemoProfessional(p.id, p.name)}>
                  {p.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem onClick={setDemoAdmin}>
          Admin
        </DropdownMenuItem>

        {demoRole && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearDemoRole} className="text-red-600 focus:text-red-600 focus:bg-red-50">
              Clear Role (Logout)
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="sticky top-0 z-50 w-full pt-4 pb-4 px-4 sm:px-6 pointer-events-none">
      <header className="pointer-events-auto max-w-6xl mx-auto h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-full shadow-lg shadow-slate-200/50 transition-all">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo_transparent.png" alt="Urbio Logo" width={64} height={64} className="rounded-sm object-cover object-center" />
          </Link>

          {(!isActive('/professional') && !isActive('/admin')) && (
            <div className="hidden md:flex items-center gap-2 border-l-2 border-slate-200/60 pl-8 h-8">
              <Link 
                href="/services" 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${isActive('/services') ? 'text-black bg-slate-50' : 'text-slate-500 hover:text-black hover:bg-slate-50'}`}
              >
                Services
              </Link>
              <Link 
                href="/services" 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${isActive('/services') ? 'text-black bg-slate-50' : 'text-slate-500 hover:text-black hover:bg-slate-50'}`}
              >
                Categories
              </Link>
              <Link 
                href="/bookings" 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${isActive('/bookings') ? 'text-black bg-slate-50' : 'text-slate-500 hover:text-black hover:bg-slate-50'}`}
              >
                My Bookings
              </Link>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">

            <nav className="bg-slate-100/80 p-1.5 rounded-full flex items-center border border-slate-200/50 shadow-inner">
              <button 
                onClick={() => {
                  if (demoRole !== 'customer' && users.length > 0) {
                    setDemoCustomer(users[0].id, users[0].name);
                  }
                  router.push('/');
                }}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${!isActive('/professional') && !isActive('/admin') ? 'bg-white text-slate-900 shadow-md scale-105' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
              >
                Customer
              </button>
              <button 
                onClick={() => {
                  if (demoRole !== 'professional' && professionals.length > 0) {
                    setDemoProfessional(professionals[0].id, professionals[0].name);
                  }
                  router.push('/professional');
                }}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isActive('/professional') ? 'bg-white text-slate-900 shadow-md scale-105' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
              >
                Professional
              </button>
              <button 
                onClick={() => {
                  if (demoRole !== 'admin') {
                    setDemoAdmin();
                  }
                  router.push('/admin');
                }}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isActive('/admin') ? 'bg-white text-slate-900 shadow-md scale-105' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
              >
                Admin
              </button>
            </nav>
          </div>

          <div className="flex items-center">
            {renderRoleSelector()}
          </div>
        </div>
      </header>
    </div>
  );
}
