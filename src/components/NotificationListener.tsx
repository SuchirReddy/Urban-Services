'use client';

import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'sonner';
import { useDemoRole } from '@/contexts/DemoRoleContext';
import { useRouter } from 'next/navigation';

export default function NotificationListener() {
  const { demoRole, selectedProfessionalId } = useDemoRole();
  const router = useRouter();

  useEffect(() => {
    // Only listen if logged in as a professional
    if (demoRole !== 'professional' || !selectedProfessionalId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || 'mock_key', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
    });

    const channel = pusher.subscribe(`pro-${selectedProfessionalId}`);
    
    channel.bind('new-booking', (data: any) => {
      toast.success('New Job Request!', {
        description: `You have a new request for ${data?.serviceName || 'a service'}.`,
        action: {
          label: 'View',
          onClick: () => router.push('/professional/requests'),
        },
        duration: 8000,
      });
    });

    return () => {
      pusher.unsubscribe(`pro-${selectedProfessionalId}`);
    };
  }, [demoRole, selectedProfessionalId, router]);

  return null;
}
