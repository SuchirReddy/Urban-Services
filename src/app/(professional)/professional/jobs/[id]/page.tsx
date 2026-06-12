'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Pusher from 'pusher-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, MessageSquare, Send, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useDemoRole } from '@/contexts/DemoRoleContext';
import { toast } from 'sonner';

const TrackingMap = dynamic(() => import('@/components/TrackingMap'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl"></div>
});

export default function ActiveJobPage() {
  const params = useParams();
  const router = useRouter();
  const { demoRole, selectedProfessionalId } = useDemoRole();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Static mock locations for map
  const [proLoc] = useState({ lat: 12.9616, lng: 77.5846 });
  const [customerLoc] = useState({ lat: 12.9716, lng: 77.5946 });

  // Chat State
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobRes, msgsRes] = await fetch(`/api/bookings/${params?.id}`).then(r => Promise.all([r, fetch(`/api/bookings/${params?.id}/messages`)]));
        if (jobRes.ok) setJob(await jobRes.json());
        if (msgsRes.ok) setMessages(await msgsRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (params?.id) fetchData();
  }, [params?.id]);

  useEffect(() => {
    if (!params?.id) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || 'mock_key', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
    });
    const channel = pusher.subscribe(`chat-${params.id}`);
    channel.bind('new-message', (data: any) => {
      setMessages(prev => {
        if (prev.find(m => m.id === data.id)) return prev;
        return [...prev, data];
      });
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => pusher.unsubscribe(`chat-${params.id}`);
  }, [params?.id]);

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const res = await fetch(`/api/bookings/${job.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJob({ ...job, status: newStatus });
        toast.success(`Job marked as ${newStatus}`);
      }
    } catch (e) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProfessionalId) return;

    const tempId = Date.now().toString();
    const messageData = {
      id: tempId,
      senderId: selectedProfessionalId,
      senderType: 'PROFESSIONAL',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      await fetch(`/api/bookings/${params?.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: selectedProfessionalId,
          senderType: 'PROFESSIONAL',
          content: messageData.content
        })
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-900" /></div>;
  if (!job) return <div className="text-center py-20">Job not found</div>;

  const isCompleted = job.status === 'COMPLETED';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push('/professional')} className="mb-8 hover:bg-slate-100 rounded-full pr-6 font-bold text-slate-600 hover:text-black transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
      </Button>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column: Job Details & Map */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Job Details.</h1>
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">ID #{job.id.slice(-8).toUpperCase()}</p>
            </div>
            <span className="text-xs font-bold text-white bg-black px-4 py-2 rounded-full uppercase tracking-widest shadow-md">
              {job.status.replace(/_/g, ' ')}
            </span>
          </div>

          <Card className="border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
            <CardContent className="p-8 md:p-10 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{job.service?.name}</h2>
                <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-wider">Customer: <span className="text-slate-900">{job.user?.name || 'Customer'}</span></p>
              </div>

              <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Service Address</p>
                    <p className="font-medium text-slate-700 leading-relaxed text-sm">{job.address}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm">
                <TrackingMap customerLocation={customerLoc} proLocation={proLoc} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-14 rounded-full font-bold text-base text-slate-900 border-slate-200 hover:bg-slate-50 transition-all hover:border-black"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${customerLoc.lat},${customerLoc.lng}`, '_blank')}
                >
                  <Navigation className="w-5 h-5 mr-3" /> Get Directions
                </Button>
                
                {!isCompleted && (
                  <Button 
                    className="flex-1 h-14 rounded-full font-bold text-base bg-black text-white hover:bg-slate-800 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5"
                    onClick={() => updateStatus(job.status === 'ACCEPTED' ? 'IN_PROGRESS' : 'COMPLETED')}
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                     job.status === 'ACCEPTED' ? 'Start Job' : 
                     <><CheckCircle2 className="w-5 h-5 mr-3" /> Complete Job</>}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Chat */}
        <div className="lg:w-[450px] flex flex-col h-[600px] lg:h-[800px]">
          <Card className="flex-1 flex flex-col overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[2rem] bg-white">
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                  <MessageSquare className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-none tracking-tight">{job.user?.name?.split(' ')[0] || 'Customer'}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">Customer Support</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 text-sm font-medium mt-10">No messages yet.</div>
              ) : (
                messages.map((msg, idx) => {
                  const isPro = msg.senderType === 'PROFESSIONAL';
                  return (
                    <div key={msg.id || idx} className={`flex ${isPro ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-3xl px-6 py-4 text-sm font-medium leading-relaxed shadow-sm ${isPro ? 'bg-black text-white rounded-br-md' : 'bg-slate-50 border border-slate-100 text-slate-900 rounded-bl-md'}`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-5 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input 
                  value={newMessage} 
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Message customer..."
                  className="rounded-full h-14 bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-black px-6 shadow-none text-base font-medium"
                  disabled={isCompleted}
                />
                <Button type="submit" size="icon" className="w-14 h-14 rounded-full shrink-0 bg-black hover:bg-slate-800 text-white shadow-lg transition-all hover:-translate-y-0.5" disabled={isCompleted}>
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
