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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Complete your Booking</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form sections */}
        <div className="md:col-span-2 space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-500" />
                Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Date</label>
                <Input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]} 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full sm:w-1/2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select Time Slot</label>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map(slot => (
                    <Button
                      key={slot}
                      variant={timeSlot === slot ? "default" : "outline"}
                      onClick={() => setTimeSlot(slot)}
                      className={timeSlot === slot ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                Service Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="block text-sm font-medium mb-2">Where should the professional go?</label>
              <Textarea 
                placeholder="Enter your full address (e.g. 123 Main St, Apt 4B...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24 border-2 border-indigo-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Total</span>
                  <span className="font-medium">₹{totalParam}</span>
                </div>
                {addonsParam && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Includes Add-ons</span>
                    <span className="font-medium">{addonsParam.split(',').length} items</span>
                  </div>
                )}
                <Separator className="my-3" />
                {date && timeSlot && (
                  <div className="flex flex-col gap-1 text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" /> {new Date(date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> {timeSlot}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg">Total to Pay</span>
                <span className="font-bold text-2xl text-slate-900">₹{totalParam}</span>
              </div>

              <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                <div className="mt-6">
                  <Button 
                    onClick={() => setIsPaymentModalOpen(true)}
                    disabled={!date || !timeSlot || !address}
                    className="w-full font-bold py-6 rounded-full"
                  >
                    Confirm & Pay
                  </Button>
                </div>

                <DialogContent className="sm:max-w-md">
                  {!paymentSuccess ? (
                    <>
                      <DialogHeader>
                        <DialogTitle>Secure Checkout (Demo)</DialogTitle>
                        <DialogDescription>
                          This is a simulated payment. No real charges will be made.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Card Number</label>
                          <Input disabled value="**** **** **** 4242" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Expiry</label>
                            <Input disabled value="12/26" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">CVC</label>
                            <Input disabled value="***" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handlePay} 
                          disabled={isProcessing}
                          className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                          {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...</>
                          ) : (
                            `Pay ₹${totalParam}`
                          )}
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">Payment Successful!</h2>
                      <p className="text-slate-500">Confirming your booking details...</p>
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
