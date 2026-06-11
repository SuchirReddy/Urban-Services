'use client';

import { useDemoRole } from '@/contexts/DemoRoleContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CustomerDashboard() {
  const { demoRole, selectedUserId, selectedUserName } = useDemoRole();
  const router = useRouter();

  useEffect(() => {
    if (demoRole !== 'customer') {
      router.push('/');
    }
  }, [demoRole, router]);

  if (demoRole !== 'customer') return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
      <p className="text-lg text-slate-600">Welcome back, {selectedUserName}!</p>
      <div className="mt-8 bg-white p-6 rounded-lg border shadow-sm">
        <p className="text-sm text-slate-500 font-mono">User ID: {selectedUserId}</p>
      </div>
    </div>
  );
}
