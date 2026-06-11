'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoRole } from '@/contexts/DemoRoleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function JobRequestsPage() {
  const router = useRouter();
  const { demoRole, selectedProfessionalId } = useDemoRole();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = async () => {
    if (!selectedProfessionalId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/professionals/${selectedProfessionalId}/bookings`);
      if (res.ok) {
        const allBookings = await res.json();
        const pending = allBookings.filter((b: any) => b.status === 'PENDING');
        setRequests(pending);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (demoRole === 'professional' && selectedProfessionalId) {
      fetchRequests();
    } else if (demoRole !== 'professional') {
      router.push('/');
    }
  }, [demoRole, selectedProfessionalId, router]);

  const handleAction = async (bookingId: string, action: 'ACCEPTED' | 'CANCELLED') => {
    try {
      setActionLoading(bookingId);
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });

      if (res.ok) {
        toast.success(`Job ${action === 'ACCEPTED' ? 'Accepted' : 'Rejected'}!`);
        // Remove from list
        setRequests(prev => prev.filter(req => req.id !== bookingId));
        if (action === 'ACCEPTED') {
          router.push('/professional'); // Go back to dashboard to see active job
        }
      } else {
        toast.error('Failed to update job status.');
      }
    } catch (e) {
      console.error(e);
      toast.error('An error occurred.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Job Requests</h1>
          <p className="text-slate-500 mt-1">Review and accept incoming jobs</p>
        </div>
        <Badge variant="secondary" className="text-lg py-1 px-4">{requests.length} Pending</Badge>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-2">No new requests</h2>
          <p className="text-slate-500">You're all caught up! Make sure you are online to receive jobs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((req) => {
            const estimatedPayout = Math.round(req.total * 0.8); // Total minus 20% commission
            
            return (
              <Card key={req.id} className="overflow-hidden hover:shadow-md transition-all border-slate-200">
                <div className="p-6 pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{req.service?.name}</h3>
                      <p className="font-semibold text-slate-700 mt-1">{req.user?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-500">Estimated Payout</p>
                      <p className="text-2xl font-bold text-emerald-600">₹{estimatedPayout}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-sm text-slate-700 mb-6 border">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{new Date(req.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{req.timeSlot}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{req.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex border-t border-slate-100">
                  <button
                    onClick={() => handleAction(req.id, 'CANCELLED')}
                    disabled={actionLoading === req.id}
                    className="flex-1 py-4 flex items-center justify-center gap-2 font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" /> Reject
                  </button>
                  <div className="w-px bg-slate-100"></div>
                  <button
                    onClick={() => handleAction(req.id, 'ACCEPTED')}
                    disabled={actionLoading === req.id}
                    className="flex-1 py-4 flex items-center justify-center gap-2 font-bold text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === req.id ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Accepting...</>
                    ) : (
                      <><CheckCircle2 className="w-5 h-5" /> Accept Job</>
                    )}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
