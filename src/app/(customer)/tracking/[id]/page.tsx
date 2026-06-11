'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Pusher from 'pusher-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, Send, Loader2, ArrowLeft } from 'lucide-react';
import { useDemoRole } from '@/contexts/DemoRoleContext';

// Dynamically import the map to avoid SSR issues with Leaflet
const TrackingMap = dynamic(() => import('@/components/TrackingMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">Loading Map...</div>
});

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { demoRole, selectedUserId } = useDemoRole();
  const [booking, setBooking] = useState<any>(null);
  
  // Map Simulation State
  const [customerLoc] = useState({ lat: 12.9716, lng: 77.5946 }); // Static mock
  const [proLoc, setProLoc] = useState({ lat: 12.9616, lng: 77.5846 }); // Starts a bit away
  const [eta, setEta] = useState(12);
  
  // Chat State
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Booking and initialize Chat History
  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingRes, messagesRes] = await Promise.all([
          fetch(`/api/bookings/${params?.id}`),
          fetch(`/api/bookings/${params?.id}/messages`)
        ]);
        if (bookingRes.ok) setBooking(await bookingRes.json());
        if (messagesRes.ok) setMessages(await messagesRes.json());
      } catch (e) {
        console.error(e);
      }
    }
    if (params?.id) fetchData();
  }, [params?.id]);

  // 2. Setup Pusher for Real-time Chat
  useEffect(() => {
    if (!params?.id) return;
    
    // Initialize Pusher Client
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || 'mock_key', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
    });

    const channel = pusher.subscribe(`chat-${params.id}`);
    
    channel.bind('new-message', (data: any) => {
      setMessages(prev => {
        // Prevent duplicate messages if we are the sender
        if (prev.find(m => m.id === data.id)) return prev;
        return [...prev, data];
      });
      // Ensure chat scrolls down
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    const bookingChannel = pusher.subscribe(`booking-${params.id}`);
    bookingChannel.bind('status-update', async (data: { status: string }) => {
      try {
        const res = await fetch(`/api/bookings/${params.id}`);
        if (res.ok) {
          const updatedBooking = await res.json();
          setBooking(updatedBooking);
        } else {
          setBooking((prev: any) => ({ ...prev, status: data.status }));
        }
      } catch (e) {
        setBooking((prev: any) => ({ ...prev, status: data.status }));
      }
    });

    return () => {
      pusher.unsubscribe(`chat-${params.id}`);
      pusher.unsubscribe(`booking-${params.id}`);
    };
  }, [params?.id]);

  // 3. Simulate Professional Movement
  useEffect(() => {
    if (!booking) return;

    const interval = setInterval(() => {
      setProLoc(prev => {
        const latDiff = customerLoc.lat - prev.lat;
        const lngDiff = customerLoc.lng - prev.lng;
        
        // Move 5% of the distance every 3 seconds
        const newLat = prev.lat + (latDiff * 0.05);
        const newLng = prev.lng + (lngDiff * 0.05);
        
        // Update ETA roughly
        setEta(current => Math.max(1, current - 0.5));
        
        return { lat: newLat, lng: newLng };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [booking, customerLoc]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    const tempId = Date.now().toString();
    const messageData = {
      id: tempId, // Optimistic ID
      senderId: selectedUserId,
      senderType: 'USER',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      const res = await fetch(`/api/bookings/${params?.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: selectedUserId,
          senderType: 'USER',
          content: messageData.content
        })
      });
      if (!res.ok) {
        throw new Error('Failed to send');
      }
      // If we don't get Pusher updates (e.g. invalid keys), manually fetch again to see the simulated reply
      setTimeout(async () => {
        const messagesRes = await fetch(`/api/bookings/${params?.id}/messages`);
        if (messagesRes.ok) setMessages(await messagesRes.json());
      }, 3000);
    } catch (error) {
      console.error(error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  if (!booking) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (booking.status === 'PENDING') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-500 mx-auto" />
        <h1 className="text-3xl font-bold">Finding a Professional</h1>
        <p className="text-slate-500 text-lg">We are currently assigning the best professional for your job. Please wait...</p>
        <Button onClick={() => router.push('/bookings')} variant="outline" className="mt-8 rounded-full">
          Back to Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push('/bookings')} className="mb-6 -ml-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Bookings
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Map & Info */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Track Order</h1>
              <p className="text-slate-500 font-mono text-sm">#{String(params?.id).slice(-8).toUpperCase()}</p>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-base py-1 px-4">
              On the way
            </Badge>
          </div>

          <TrackingMap customerLocation={customerLoc} proLocation={proLoc} />

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full overflow-hidden relative">
                    {booking.professional?.avatar ? (
                      <img src={booking.professional.avatar} alt="Pro" className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
                        {booking.professional?.name?.[0] || 'P'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{booking.professional?.name || 'Assigning Professional...'}</h3>
                    <p className="text-slate-500 text-sm">{booking.service?.name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-600">{Math.ceil(eta)}</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Mins Away</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <Button variant="outline" className="py-6 font-semibold" onClick={() => alert("Calling professional...")}>
                  <Phone className="w-4 h-4 mr-2" /> Call
                </Button>
                <Button 
                  className="py-6 font-semibold bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Chat Sidebar (Visible on large screens or toggled) */}
        <div className={`lg:w-[400px] flex flex-col ${isChatOpen ? 'block' : 'hidden lg:flex'}`}>
          <Card className="flex-1 flex flex-col overflow-hidden h-[600px] lg:h-auto border-2 border-indigo-50 shadow-xl">
            <div className="bg-slate-900 text-white p-4">
              <h3 className="font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Chat with {booking.professional?.name?.split(' ')[0] || 'Pro'}
              </h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 text-sm mt-10">
                  Send a message to your professional.
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isUser = msg.senderType === 'USER';
                  return (
                    <div key={msg.id || idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isUser ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'}`}>
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
                  placeholder="Type a message..."
                  className="rounded-full"
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0 bg-indigo-600 hover:bg-indigo-700">
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
