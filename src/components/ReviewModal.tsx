'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2 } from 'lucide-react';
import { useDemoRole } from '@/contexts/DemoRoleContext';

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  professionalName?: string;
  onSuccess: () => void;
}

export default function ReviewModal({ isOpen, onOpenChange, bookingId, professionalName, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedUserId } = useDemoRole();

  const handleSubmit = async () => {
    if (!rating || !selectedUserId) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          rating,
          comment
        })
      });

      if (res.ok) {
        onSuccess();
        onOpenChange(false);
      } else {
        console.error("Failed to submit review");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your service</DialogTitle>
          <DialogDescription>
            How was your experience with {professionalName || 'the professional'}?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`w-10 h-10 ${
                    (hoverRating || rating) >= star 
                      ? 'fill-amber-400 text-amber-400' 
                      : 'text-slate-200'
                  } transition-colors`} 
                />
              </button>
            ))}
          </div>

          <Textarea 
            placeholder="Tell us what you liked or how we can improve..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!rating || isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
