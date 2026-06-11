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
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
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
              <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-slate-50 border-b p-4 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-slate-500 block">Booking ID</span>
                      <span className="font-mono font-medium">#{booking.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
                    <div className="text-sm">
                      <span className="text-slate-500 block">Total Amount</span>
                      <span className="font-medium">₹{booking.total}</span>
                    </div>
                  </div>
                  <Badge 
                    className={
                      isCompleted 
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">{booking.service?.name}</h3>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-500" />
                          {booking.timeSlot}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-500" />
                          <span className="line-clamp-1 max-w-[200px]">{booking.address}</span>
                        </div>
                      </div>

                      {booking.professional && (
                        <div className="flex items-center gap-3 pt-4 border-t mt-4">
                          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center font-bold text-slate-400">
                            {booking.professional.avatar ? (
                              <img src={booking.professional.avatar} alt="Pro" className="w-full h-full object-cover" />
                            ) : (
                              booking.professional.name[0]
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Assigned Professional</p>
                            <p className="font-semibold">{booking.professional.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3 justify-center min-w-[140px]">
                      {!isCompleted ? (
                        <>
                          <Button 
                            className="w-full rounded-full" 
                            onClick={() => router.push(`/tracking/${booking.id}`)}
                          >
                            Track Order
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" className="w-full rounded-full" onClick={() => router.push(`/services/${booking.serviceId}`)}>
                            Book Again
                          </Button>
                          {!hasReviewed ? (
                            <Button variant="secondary" className="w-full rounded-full" onClick={() => openReviewModal(booking)}>
                              <Star className="w-4 h-4 mr-2" /> Rate Service
                            </Button>
                          ) : (
                            <div className="text-sm font-medium text-amber-600 flex items-center justify-center gap-1 bg-amber-50 py-2 rounded-full">
                              <Star className="w-4 h-4 fill-current" /> Reviewed
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
