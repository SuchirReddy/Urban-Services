'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, MapPin, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();

  if (!params?.id) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Booking Confirmed!</h1>
      <p className="text-lg text-slate-500 mb-10">
        Your service has been successfully booked. Our professional will arrive at the scheduled time.
      </p>

      <Card className="max-w-md mx-auto text-left mb-10 overflow-hidden shadow-lg border-2 border-emerald-50">
        <div className="bg-slate-50 p-4 border-b flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Booking Reference</span>
          <span className="font-mono text-sm font-bold text-slate-900">#{String(params.id).slice(-8).toUpperCase()}</span>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Premium Home Service</p>
              <p className="text-sm text-slate-500">Service selected</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Scheduled Date</p>
              <p className="text-sm text-slate-500">Check your selected date and time</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Service Location</p>
              <p className="text-sm text-slate-500">At your provided address</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button render={<Link href={`/tracking/${params.id}`} />} size="lg" className="rounded-full px-8 py-6 text-base w-full sm:w-auto">
          Track Order
        </Button>
        <Button render={<Link href="/" />} variant="outline" size="lg" className="rounded-full px-8 py-6 text-base w-full sm:w-auto">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
