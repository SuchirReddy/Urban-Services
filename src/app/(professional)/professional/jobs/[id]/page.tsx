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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  if (!job) return <div className="text-center py-20">Job not found</div>;

  const isCompleted = job.status === 'COMPLETED';

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Button variant="ghost" onClick={() => router.push('/professional')} className="mb-6 -ml-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Job Details & Map */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Job Details</h1>
              <p className="text-slate-500 font-mono text-sm">#{job.id.slice(-8).toUpperCase()}</p>
            </div>
            <Badge className="text-base py-1 px-4">{job.status}</Badge>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold">{job.service?.name}</h2>
                <p className="text-slate-500 mt-1">Customer: <span className="font-semibold text-slate-800">{job.user?.name || 'Customer'}</span></p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Service Address</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{job.address}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <TrackingMap customerLocation={customerLoc} proLocation={proLoc} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 py-6 font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${customerLoc.lat},${customerLoc.lng}`, '_blank')}
                >
                  <Navigation className="w-4 h-4 mr-2" /> Get Directions
                </Button>
                
                {!isCompleted && (
                  <Button 
                    className="flex-1 py-6 font-bold"
                    onClick={() => updateStatus(job.status === 'ACCEPTED' ? 'IN_PROGRESS' : 'COMPLETED')}
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     job.status === 'ACCEPTED' ? 'Start Job' : 
                     <><CheckCircle2 className="w-4 h-4 mr-2" /> Complete Job</>}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Chat */}
        <div className="lg:w-[400px] flex flex-col h-[600px] lg:h-[800px]">
          <Card className="flex-1 flex flex-col overflow-hidden border-2 shadow-sm">
            <div className="bg-slate-900 text-white p-4">
              <h3 className="font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Chat with {job.user?.name?.split(' ')[0] || 'Customer'}
              </h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 text-sm mt-10">No messages yet.</div>
              ) : (
                messages.map((msg, idx) => {
                  const isPro = msg.senderType === 'PROFESSIONAL';
                  return (
                    <div key={msg.id || idx} className={`flex ${isPro ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isPro ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'}`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                  value={newMessage} 
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Message customer..."
                  className="rounded-full"
                  disabled={isCompleted}
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={isCompleted}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
