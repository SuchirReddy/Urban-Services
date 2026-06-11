'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoRole } from '@/contexts/DemoRoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, IndianRupee, TrendingUp, Calendar as CalendarIcon, Wallet } from 'lucide-react';

export default function EarningsPage() {
  const router = useRouter();
  const { demoRole, selectedProfessionalId } = useDemoRole();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState({
    total: 0,
    monthly: 0,
    weekly: 0,
    completedJobs: [] as any[],
  });

  useEffect(() => {
    async function fetchEarnings() {
      if (!selectedProfessionalId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/professionals/${selectedProfessionalId}/bookings`);
        if (res.ok) {
          const bookings = await res.json();
          const completed = bookings.filter((b: any) => b.status === 'COMPLETED');
          
          let total = 0;
          let monthly = 0;
          let weekly = 0;
          
          const now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

          completed.forEach((b: any) => {
            const payout = b.total - (b.commission || 0);
            total += payout;
            
            const bookingDate = new Date(b.date);
            if (bookingDate >= oneWeekAgo) weekly += payout;
            if (bookingDate >= oneMonthAgo) monthly += payout;
          });

          setEarnings({ 
            total: Math.round(total), 
            monthly: Math.round(monthly), 
            weekly: Math.round(weekly), 
            completedJobs: completed 
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    if (demoRole === 'professional' && selectedProfessionalId) {
      fetchEarnings();
    } else if (demoRole !== 'professional') {
      router.push('/');
    }
  }, [demoRole, selectedProfessionalId, router]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Earnings Dashboard</h1>
        <p className="text-slate-500 mt-1">Track your payouts and job history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-emerald-100 mb-1">Total Payouts</p>
                <h2 className="text-4xl font-bold">₹{earnings.total}</h2>
              </div>
              <Wallet className="w-8 h-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-500 mb-1">This Month</p>
                <h2 className="text-3xl font-bold text-slate-800">₹{earnings.monthly}</h2>
              </div>
              <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                <CalendarIcon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-500 mb-1">This Week</p>
                <h2 className="text-3xl font-bold text-slate-800">₹{earnings.weekly}</h2>
              </div>
              <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="text-lg">Payout History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {earnings.completedJobs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No completed jobs yet. Keep accepting requests!
            </div>
          ) : (
            <div className="divide-y">
              {earnings.completedJobs.map(job => {
                const payout = Math.round(job.total - (job.commission || 0));
                return (
                  <div key={job.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-lg">{job.service?.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <span className="font-medium text-slate-700">{job.user?.name}</span>
                        <span>•</span>
                        <span>{new Date(job.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-emerald-600">₹{payout}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Total: ₹{job.total} | Commission: ₹{job.commission || 0}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
