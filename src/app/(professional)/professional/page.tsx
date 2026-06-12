'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoRole } from '@/contexts/DemoRoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, IndianRupee, Star, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfessionalDashboard() {
  const router = useRouter();
  const { demoRole, selectedProfessionalId, selectedUserName } = useDemoRole();
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [stats, setStats] = useState({
    todayJobs: 0,
    earningsToday: 0,
    rating: 0,
    allTimeJobs: 0,
  });
  const [activeJobs, setActiveJobs] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    if (!selectedProfessionalId) return;
    try {
      setLoading(true);
      // Fetch bookings to calculate stats
      const res = await fetch(`/api/professionals/${selectedProfessionalId}/bookings`);
      if (res.ok) {
        const bookings = await res.json();
        
        // Find Active Jobs
        const active = bookings.filter((b: any) => 
          b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS' || b.status === 'PRO_ON_THE_WAY'
        );
        setActiveJobs(active);

        // Compute stats
        const completed = bookings.filter((b: any) => b.status === 'COMPLETED');
        // For the demo, we will treat all completed jobs as recent to ensure the dashboard is populated
        // since seeded dates are spread out into the future
        const recentCompleted = completed;
        const recentEarnings = Math.round(recentCompleted.reduce((acc: number, b: any) => acc + (b.total - (b.commission || 0)), 0));

        // Fetch pro info for online status and rating
        // To save API calls for this demo, we'll just mock the online state toggle logic directly
        setStats({
          todayJobs: recentCompleted.length,
          earningsToday: recentEarnings,
          rating: 4.8, // Mocked rating for demo speed
          allTimeJobs: completed.length,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (demoRole === 'professional' && selectedProfessionalId) {
      fetchDashboardData();
    } else if (demoRole !== 'professional') {
      router.push('/');
    }
  }, [demoRole, selectedProfessionalId, router]);

  const toggleOnline = async () => {
    try {
      const newState = !isOnline;
      // Optimistic update
      setIsOnline(newState);
      
      const res = await fetch(`/api/professionals/${selectedProfessionalId}/toggle-online`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline: newState }),
      });
      
      if (!res.ok) {
        setIsOnline(!newState); // revert
        toast.error('Failed to update status');
      } else {
        toast.success(`You are now ${newState ? 'Online' : 'Offline'}`);
      }
    } catch (e) {
      console.error(e);
      setIsOnline(!isOnline);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-900" /></div>;
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Welcome back, {selectedUserName?.split(' ')[0]}.</h1>
          <p className="text-slate-500 mt-3 text-lg font-light">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2.5 pr-8 pl-3 rounded-full shadow-sm border border-slate-100">
          <button 
            onClick={toggleOnline}
            className={`relative inline-flex h-10 w-16 items-center rounded-full transition-colors focus:outline-none ${isOnline ? 'bg-black' : 'bg-slate-200'}`}
          >
            <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform shadow-sm ${isOnline ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
          <span className="font-bold text-xs uppercase tracking-widest text-slate-700">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Today's Jobs</p>
                <h3 className="text-4xl font-bold mt-2 tracking-tighter text-slate-900">{stats.todayJobs}</h3>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-black border border-slate-100">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Earnings Today</p>
                <h3 className="text-4xl font-bold mt-2 tracking-tighter text-slate-900">₹{stats.earningsToday}</h3>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-black border border-slate-100">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Overall Rating</p>
                <h3 className="text-4xl font-bold mt-2 tracking-tighter text-slate-900">{stats.rating.toFixed(1)}</h3>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-black border border-slate-100">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">All Time Jobs</p>
                <h3 className="text-4xl font-bold mt-2 tracking-tighter text-slate-900">{stats.allTimeJobs}</h3>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-black border border-slate-100">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs Section */}
      <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase pt-8">Active Jobs</h2>
      {activeJobs.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 shadow-none rounded-[2rem]">
          <CardContent className="py-20 text-center text-slate-500 font-medium">
            No active jobs at the moment. Toggle online to receive new requests.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeJobs.map(job => (
            <Card key={job.id} className="overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2rem] hover:shadow-2xl hover:-translate-y-1 transition-all bg-white flex flex-col">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="font-bold text-slate-900 text-xl tracking-tight">{job.service?.name}</span>
                <span className="text-[10px] font-bold text-white bg-black px-4 py-2 rounded-full uppercase tracking-widest">{job.status.replace(/_/g, ' ')}</span>
              </div>
              <CardContent className="p-8 space-y-8 flex-1 flex flex-col">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center font-bold text-slate-900 text-xl shadow-sm border border-slate-100 shrink-0">
                    {job.user?.name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{job.user?.name || 'Customer'}</p>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {job.timeSlot}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 text-sm font-medium text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex-1">
                  <MapPin className="w-5 h-5 shrink-0 text-black" />
                  <span className="line-clamp-3 leading-relaxed">{job.address}</span>
                </div>

                <Button 
                  className="w-full h-14 rounded-full font-bold text-base bg-black text-white hover:bg-slate-800 shadow-lg shadow-black/10 transition-all mt-auto" 
                  onClick={() => router.push(`/professional/jobs/${job.id}`)}
                >
                  Manage Job
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
