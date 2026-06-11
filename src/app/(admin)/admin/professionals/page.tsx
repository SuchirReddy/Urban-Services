'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldCheck, ShieldAlert, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function AdminProfessionalsPage() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = async () => {
    try {
      const res = await fetch('/api/admin/professionals');
      if (res.ok) setProfessionals(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleToggleVerification = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setProfessionals(prev => prev.map(p => p.id === id ? { ...p, isVerified: !currentStatus } : p));
    toast.info(currentStatus ? 'Revoking verification...' : 'Verifying professional...');
    
    try {
      const res = await fetch(`/api/admin/professionals/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentStatus })
      });
      
      if (res.ok) {
        toast.success(currentStatus ? 'Verification revoked.' : 'Professional successfully verified.');
      } else {
        throw new Error('Failed to update');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to update verification status.');
      // Revert optimistic update
      setProfessionals(prev => prev.map(p => p.id === id ? { ...p, isVerified: currentStatus } : p));
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Professionals</h1>
        <p className="text-slate-500 mt-1">Manage platform service providers and verification</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {professionals.map(pro => (
          <Card key={pro.id} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center p-6 gap-6">
                
                {/* Pro Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center font-bold text-2xl text-slate-400 shrink-0">
                    {pro.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{pro.name}</h3>
                      {pro.isVerified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
                    </div>
                    <p className="text-slate-500">{pro.email} • {pro.phone}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pro.services.map((s: any, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-indigo-50 text-indigo-700 font-normal">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8 text-center bg-slate-50 p-4 rounded-xl border border-slate-100 w-full sm:w-auto shrink-0">
                  <div>
                    <div className="text-slate-500 text-sm font-medium mb-1">Rating</div>
                    <div className="flex items-center justify-center font-bold text-lg text-slate-900">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" /> 4.8
                    </div>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div>
                    <div className="text-slate-500 text-sm font-medium mb-1">Service Areas</div>
                    <div className="font-bold text-slate-900 text-sm truncate max-w-[150px]" title={pro.serviceAreas}>
                      {pro.serviceAreas || 'Global'}
                    </div>
                  </div>
                </div>

                {/* Verification Toggle */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <div className="text-sm font-medium text-slate-500">
                    {pro.isVerified ? 'Verified Account' : 'Needs Verification'}
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={pro.isVerified}
                        onChange={() => handleToggleVerification(pro.id, pro.isVerified)}
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${pro.isVerified ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${pro.isVerified ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                  </label>
                </div>

              </div>
            </CardContent>
          </Card>
        ))}
        {professionals.length === 0 && (
          <div className="p-10 text-center text-slate-500">No professionals found.</div>
        )}
      </div>
    </div>
  );
}
