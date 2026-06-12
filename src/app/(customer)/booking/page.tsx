'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useDemoRole } from '@/contexts/DemoRoleContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CheckCircle2, Loader2, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { demoRole, selectedUserId } = useDemoRole();
  
  const serviceId = searchParams?.get('serviceId');
  const addonsParam = searchParams?.get('addons');
  const totalParam = searchParams?.get('total');

  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Redirect if not customer or missing params
  useEffect(() => {
    if (demoRole !== 'customer' || !serviceId) {
      router.push('/');
    }
  }, [demoRole, serviceId, router]);

  // Generate some realistic future time slots
  const timeSlots = [
    "09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM", "06:00 PM"
  ];

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentSuccess(true);
    
    // Call API to create booking
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          serviceId,
          address,
          date,
          timeSlot,
          total: Number(totalParam),
          addOns: addonsParam ? addonsParam.split(',') : [],
        }),
      });

      if (res.ok) {
        const booking = await res.json();
        // Wait a moment to show success checkmark before redirecting
        setTimeout(() => {
          router.push(`/booking/${booking.id}/confirmation`);
        }, 1500);
      } else {
        console.error('Failed to create booking');
        setIsProcessing(false);
        setPaymentSuccess(false);
      }
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
      setPaymentSuccess(false);
    }
  };

  if (!serviceId) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">Complete your booking.</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Form sections */}
        <div className="md:col-span-2 space-y-10">
          
          <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6 px-8">
              <CardTitle className="flex items-center gap-3 text-lg tracking-wide uppercase text-slate-900">
                <CalendarIcon className="w-5 h-5 text-black" />
                Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">Select Date</label>
                <Input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]} 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full sm:w-1/2 h-14 rounded-xl bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-black text-base font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">Select Time Slot</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {timeSlots.map(slot => (
                    <Button
                      key={slot}
                      variant={timeSlot === slot ? "default" : "outline"}
                      onClick={() => setTimeSlot(slot)}
                      className={`h-12 rounded-full font-bold transition-all ${timeSlot === slot ? "bg-black hover:bg-slate-800 text-white shadow-md shadow-black/20" : "bg-white border-slate-200 text-slate-600 hover:border-black hover:text-black"}`}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6 px-8">
              <CardTitle className="flex items-center gap-3 text-lg tracking-wide uppercase text-slate-900">
                <MapPin className="w-5 h-5 text-black" />
                Service Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <label className="block text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">Where should the professional go?</label>
              <Textarea 
                placeholder="Enter your full address (e.g. 123 Main St, Apt 4B...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="min-h-[120px] rounded-xl bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-black p-4 text-base font-medium resize-none"
              />
            </CardContent>
          </Card>

        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24 border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
            <CardContent className="p-8 md:p-10">
              <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-8">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500">Service Total</span>
                  <span className="font-bold text-slate-900 text-lg">₹{totalParam}</span>
                </div>
                {addonsParam && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Add-ons Included</span>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-3 py-1 rounded-full">{addonsParam.split(',').length} items</span>
                  </div>
                )}
                
                <Separator className="my-6 bg-slate-100" />
                
                {date && timeSlot ? (
                  <div className="flex flex-col gap-3 text-sm font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-black" /> 
                      {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-black" /> 
                      {timeSlot}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-medium text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-center justify-center text-center">
                    Please select a date and time slot to proceed.
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-10 pt-6 border-t border-slate-100">
                <span className="font-bold text-slate-900 uppercase tracking-widest text-xs">Total to Pay</span>
                <span className="font-bold text-4xl text-black tracking-tighter">₹{totalParam}</span>
              </div>

              <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                <Button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  disabled={!date || !timeSlot || !address}
                  className="w-full text-base font-bold rounded-full h-14 bg-black text-white hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  Confirm & Pay
                </Button>

                <DialogContent className="sm:max-w-md rounded-[2rem] p-8">
                  {!paymentSuccess ? (
                    <>
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold tracking-tight">Secure Checkout</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500">
                          This is a simulated payment. No real charges will be made.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">Card Number</label>
                          <Input disabled value="**** **** **** 4242" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-mono text-base font-bold text-slate-700" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">Expiry</label>
                            <Input disabled value="12/26" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-mono text-base font-bold text-slate-700" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">CVC</label>
                            <Input disabled value="***" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-mono text-base font-bold text-slate-700" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="mt-8 sm:justify-start">
                        <Button 
                          onClick={handlePay} 
                          disabled={isProcessing}
                          className="w-full h-14 rounded-full font-bold text-lg bg-black text-white hover:bg-slate-800 shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
                        >
                          {isProcessing ? (
                            <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Processing...</>
                          ) : (
                            `Pay ₹${totalParam}`
                          )}
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center shadow-2xl shadow-black/20 animate-in zoom-in duration-500">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Payment Successful!</h2>
                        <p className="text-slate-500 font-medium">Confirming your booking details...</p>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading checkout...</div>}>
      <BookingContent />
    </Suspense>
  );
}
