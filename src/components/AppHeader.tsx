'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDemoRole } from '@/contexts/DemoRoleContext';
import { usePathname } from 'next/navigation';
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
      <DropdownMenuTrigger className={buttonVariants({ variant: 'outline', className: 'gap-2 bg-black text-white border-slate-700 hover:bg-slate-800 hover:text-white' })}>
        {demoRole ? (
          <>
            <div className="flex flex-col items-start">
              <span className="text-xs text-slate-400 capitalize">{demoRole}</span>
              <span className="text-sm font-semibold">{selectedUserName}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </>
        ) : (
          <>
            <UserCircle2 className="w-5 h-5 text-slate-300" />
            <span>Demo: Select Role</span>
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch Demo Role</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Customer
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48 max-h-64 overflow-y-auto">
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
          <DropdownMenuSubContent className="w-48 max-h-64 overflow-y-auto">
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
    <header className="bg-black border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">
            UrbanGlow
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-2 text-sm font-bold text-white items-center">
          <Link 
            href="/services" 
            className={`px-4 py-2 rounded-full transition-colors ${isActive('/services') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'}`}
          >
            Services
          </Link>
          <Link 
            href="/bookings" 
            className={`px-4 py-2 rounded-full transition-colors ${isActive('/bookings') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'}`}
          >
            My Bookings
          </Link>
          <Link 
            href="/professional" 
            className={`px-4 py-2 rounded-full transition-colors ${isActive('/professional') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'}`}
          >
            Professional Portal
          </Link>
          <Link 
            href="/admin" 
            className={`px-4 py-2 rounded-full transition-colors ${isActive('/admin') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'}`}
          >
            Admin Portal
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {renderRoleSelector()}
        </div>
      </div>
    </header>
  );
}
