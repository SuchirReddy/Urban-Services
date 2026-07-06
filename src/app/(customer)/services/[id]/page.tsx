'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useDemoRole } from '@/contexts/DemoRoleContext';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { demoRole } = useDemoRole();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/services/${params?.id}`);
        if (res.ok) {
          setService(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (params?.id) fetchService();
  }, [params?.id]);

  const handleAddOnToggle = (id: string, price: number) => {
    setSelectedAddOns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateTotal = () => {
    if (!service) return 0;
    let total = service.price;
    service.addOns.forEach((addon: any) => {
      if (selectedAddOns[addon.id]) total += addon.price;
    });
    return total;
  };

  const handleProceed = () => {
    if (demoRole !== 'customer') {
      alert('Please select a Customer role from the Demo menu in the header first to proceed with booking.');
      return;
    }
    const addons = Object.keys(selectedAddOns).filter(k => selectedAddOns[k]).join(',');
    router.push(`/booking?serviceId=${service.id}&addons=${addons}&total=${calculateTotal()}`);
  };

  if (loading) {
    return <div className="p-20 text-center">Loading service details...</div>;
  }
  
  if (!service) {
    return <div className="p-20 text-center text-red-500">Service not found.</div>;
  }

  const includedFeatures = [
    "Verified and background-checked professionals",
    "High-quality tools and equipment",
    "100% satisfaction guarantee",
    "On-time service completion"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-80 rounded-3xl overflow-hidden border">
            <Image src={service.imageUrl} alt={service.name} fill className="object-cover" />
          </div>

          <div>
            <Badge className="mb-4">{service.category}</Badge>
            <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
            
            <div className="flex items-center gap-6 text-slate-600 mb-6 border-b pb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">{service.duration} mins</span>
              </div>
              {service.reviewCount > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span className="font-bold">{service.rating.toFixed(1)}</span>
                  <span className="text-sm">({service.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            <p className="text-lg text-slate-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">What's included</h3>
            <ul className="space-y-4">
              {includedFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {service.reviews?.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6 pt-6 border-t">Latest Reviews</h3>
              <div className="space-y-6">
                {service.reviews.map((r: any, i: number) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold">{r.user?.name || 'Anonymous User'}</div>
                      <div className="flex text-amber-500">
                        {Array.from({length: 5}).map((_, idx) => (
                          <Star key={idx} className={`w-4 h-4 ${idx < r.rating ? 'fill-current' : 'text-slate-300'}`} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-slate-600 text-sm mt-2">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Cart */}
        <div>
          <Card className="sticky top-24 border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
            <CardContent className="p-8 md:p-10">
              <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-8">Booking Summary</h3>
              
              <div className="flex justify-between items-end mb-8">
                <div>
                  <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">Base Price</div>
                  <div className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter">₹{service.price}</div>
                </div>
              </div>

              {service.addOns?.length > 0 && (
                <>
                  <Separator className="my-8 bg-slate-100" />
                  <div className="mb-6 font-bold text-xs text-slate-400 tracking-widest uppercase">Optional Add-ons</div>
                  <div className="space-y-5">
                    {service.addOns.map((addon: any) => (
                      <div key={addon.id} className="flex items-start space-x-4 group cursor-pointer" onClick={() => handleAddOnToggle(addon.id, addon.price)}>
                        <Checkbox 
                          id={addon.id} 
                          checked={!!selectedAddOns[addon.id]}
                          onCheckedChange={() => handleAddOnToggle(addon.id, addon.price)}
                          className="mt-0.5 w-5 h-5 border-slate-300 data-[state=checked]:bg-black data-[state=checked]:border-black rounded-[4px] transition-all"
                        />
                        <div className="flex-1">
                          <label className="text-sm font-bold text-slate-700 leading-none group-hover:text-black transition-colors cursor-pointer">
                            {addon.name}
                          </label>
                          <p className="text-sm text-slate-500 mt-1 font-medium">+₹{addon.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <Separator className="my-8 bg-slate-100" />
              
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-slate-900 uppercase tracking-widest text-xs">Total</span>
                <span className="font-bold text-3xl text-black tracking-tighter">₹{calculateTotal()}</span>
              </div>

              <button 
                onClick={handleProceed} 
                className="relative overflow-hidden group/btn bg-slate-50/50 backdrop-blur-xl rounded-full h-14 w-full text-slate-800 text-lg font-bold shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] hover:bg-slate-50/60"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
                <span className="relative z-10 flex items-center justify-center h-full w-full">Proceed to Book</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
