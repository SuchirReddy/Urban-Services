'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      if (res.ok) setBookings(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await fetch(`/api/bookings/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.professional?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-500 mt-1">Manage and monitor platform bookings</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input 
              placeholder="Search ID, user, or pro..." 
              className="pl-9"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Professional</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => {
                const canCancel = b.status !== 'COMPLETED' && b.status !== 'CANCELLED';
                
                return (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900">#{b.id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{b.user?.name || 'Unknown'}</div>
                      <div className="text-slate-500 text-xs">{b.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {b.professional ? (
                        <div className="font-medium text-slate-900">{b.professional.name}</div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{b.service?.name}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">₹{b.total}</td>
                    <td className="px-6 py-4">
                      <Badge className={
                        b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                        b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        b.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }>
                        {b.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canCancel && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleCancelBooking(b.id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-none border-none"
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="p-10 text-center text-slate-500">No bookings found.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
