'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDemoRole } from '@/contexts/DemoRoleContext';
import { Loader2, Calendar, Clock, MapPin, Star } from 'lucide-react';
import ReviewModal from '@/components/ReviewModal';

export default function CustomerBookingsPage() {
  const router = useRouter();
  const { demoRole, selectedUserId } = useDemoRole();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeReviewBooking, setActiveReviewBooking] = useState<any>(null);

  const fetchBookings = async () => {
    if (!selectedUserId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${selectedUserId}/bookings`);
      if (res.ok) {
        setBookings(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (demoRole === 'customer' && selectedUserId) {
      fetchBookings();
    } else if (demoRole !== 'customer') {
      router.push('/');
    }
  }, [demoRole, selectedUserId, router]);

  const openReviewModal = (booking: any) => {
    setActiveReviewBooking(booking);
    setIsReviewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-2">No bookings found</h2>
          <p className="text-slate-500 mb-6">You haven't booked any services yet.</p>
          <Button onClick={() => router.push('/services')}>Explore Services</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => {
            const isCompleted = booking.status === 'COMPLETED';
            const hasReviewed = !!booking.review;
            
            return (
              <Card key={booking.id} className="overflow-hidden border border-slate-100 shadow-xl rounded-3xl hover:shadow-2xl transition-all">
                <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-white">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-xs block mb-0.5">Booking ID</span>
                      <span className="font-bold text-slate-900">#{booking.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
                    <div className="text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-xs block mb-0.5">Total Amount</span>
                      <span className="font-bold text-slate-900">₹{booking.total}</span>
                    </div>
                  </div>
                  <div className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {booking.status.replace(/_/g, ' ')}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-slate-900">{booking.service?.name}</h3>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 font-medium">
                          <Calendar className="w-4 h-4 text-slate-900 shrink-0" />
                          {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 font-medium">
                          <Clock className="w-4 h-4 text-slate-900 shrink-0" />
                          {booking.timeSlot}
                        </div>
                        <div className="flex items-center gap-2 font-medium">
                          <MapPin className="w-4 h-4 text-slate-900 shrink-0" />
                          <span className="line-clamp-1">{booking.address}</span>
                        </div>
                      </div>

                      {booking.professional && (
                        <div className="flex items-center gap-4 pt-2">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center font-bold text-slate-900 text-xl shadow-sm border border-slate-100 overflow-hidden">
                            {booking.professional.avatar ? (
                              <img src={booking.professional.avatar} alt="Pro" className="w-full h-full object-cover" />
                            ) : (
                              booking.professional.name[0]
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Assigned Professional</p>
                            <p className="font-bold text-slate-900">{booking.professional.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3 justify-center min-w-[160px]">
                      {!isCompleted ? (
                        <>
                          <Button 
                            className="w-full h-12 rounded-full font-bold bg-black text-white hover:bg-slate-800 shadow-md transition-all" 
                            onClick={() => router.push(`/tracking/${booking.id}`)}
                          >
                            Track Order
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" className="w-full h-12 rounded-full font-bold border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => router.push(`/services/${booking.serviceId}`)}>
                            Book Again
                          </Button>
                          {!hasReviewed ? (
                            <Button variant="outline" className="w-full h-12 rounded-full font-bold border-slate-200 text-slate-900 hover:bg-slate-50 transition-all shadow-sm" onClick={() => openReviewModal(booking)}>
                              <Star className="w-4 h-4 mr-2" /> Rate Service
                            </Button>
                          ) : (
                            <div className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 h-12 rounded-full">
                              <Star className="w-4 h-4 fill-slate-900" /> Reviewed
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal 
        isOpen={isReviewOpen} 
        onOpenChange={setIsReviewOpen}
        bookingId={activeReviewBooking?.id}
        professionalName={activeReviewBooking?.professional?.name}
        onSuccess={fetchBookings}
      />
    </div>
  );
}
