'use client';

import { useEffect, useState } from 'react';
import { getPusherClient } from '@/lib/pusher';
import { Button } from '@/components/ui/button';

export function PusherTest() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // We only connect if the key is not the mock key to avoid errors in console,
    // or we can let it try to connect anyway.
    const pusher = getPusherClient();
    const channel = pusher.subscribe('test-channel');

    channel.bind('test-event', (data: { message: string }) => {
      console.log('Received Pusher event:', data);
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      pusher.unsubscribe('test-channel');
    };
  }, []);

  const triggerEvent = async () => {
    try {
      await fetch('/api/pusher-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Hello at ${new Date().toLocaleTimeString()}` }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-slate-50 mb-6">
      <h3 className="font-bold mb-2">Pusher Realtime Test</h3>
      <Button onClick={triggerEvent}>Trigger Test Event</Button>
      <div className="mt-4">
        <h4 className="font-semibold text-sm">Messages received:</h4>
        <ul className="list-disc pl-5 mt-2">
          {messages.map((msg, i) => (
            <li key={i} className="text-sm">{msg}</li>
          ))}
          {messages.length === 0 && <li className="text-sm text-gray-500">None yet...</li>}
        </ul>
      </div>
    </div>
  );
}
