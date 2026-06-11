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
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {selectedUserName?.split(' ')[0]}!</h1>
          <p className="text-slate-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 pr-6 pl-2 rounded-full border shadow-sm">
          <button 
            onClick={toggleOnline}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
          <span className="font-semibold text-sm">
            {isOnline ? <span className="text-emerald-600">Online & Accepting Jobs</span> : <span className="text-slate-500">Offline</span>}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Today's Jobs</p>
                <h3 className="text-3xl font-bold mt-1">{stats.todayJobs}</h3>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Earnings Today</p>
                <h3 className="text-3xl font-bold mt-1 text-emerald-600">₹{stats.earningsToday}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Overall Rating</p>
                <h3 className="text-3xl font-bold mt-1">{stats.rating.toFixed(1)}</h3>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                <Star className="w-6 h-6 fill-current" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">All Time Jobs</p>
                <h3 className="text-3xl font-bold mt-1">{stats.allTimeJobs}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs Section */}
      <h2 className="text-2xl font-bold pt-4">Active Jobs</h2>
      {activeJobs.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent shadow-none">
          <CardContent className="py-12 text-center text-slate-500">
            No active jobs at the moment. Toggle online to receive new requests!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeJobs.map(job => (
            <Card key={job.id} className="overflow-hidden border-2 border-indigo-50">
              <div className="bg-indigo-50 px-6 py-3 border-b flex justify-between items-center">
                <span className="font-bold text-indigo-900">{job.service?.name}</span>
                <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">{job.status}</span>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 text-xl">
                    {job.user?.name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-semibold">{job.user?.name || 'Customer'}</p>
                    <p className="text-sm text-slate-500">{new Date(job.date).toLocaleDateString()} at {job.timeSlot}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                  <span className="line-clamp-2">{job.address}</span>
                </div>

                <Button 
                  className="w-full font-bold mt-2" 
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
