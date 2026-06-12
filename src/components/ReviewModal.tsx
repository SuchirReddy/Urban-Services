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
      <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl p-8 gap-8">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-3xl font-bold text-center text-slate-900">Rate your service</DialogTitle>
          <DialogDescription className="text-center text-slate-500 text-base">
            How was your experience with <span className="font-bold text-slate-900">{professionalName || 'the professional'}</span>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-50 py-4 px-8 rounded-full border border-slate-100 shadow-inner">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-all hover:scale-110 active:scale-95"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`w-10 h-10 ${
                    (hoverRating || rating) >= star 
                      ? 'fill-black text-black drop-shadow-sm' 
                      : 'text-slate-200 hover:text-slate-300'
                  } transition-all duration-200`} 
                />
              </button>
            ))}
          </div>

          <Textarea 
            placeholder="Tell us what you liked or how we can improve..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[120px] rounded-2xl border-slate-200 focus-visible:ring-black bg-slate-50/50 p-4 text-base resize-none"
          />
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={handleSubmit} 
            disabled={!rating || isSubmitting}
            className="w-full rounded-full h-14 text-base font-bold bg-black text-white hover:bg-slate-800 shadow-lg transition-all active:scale-[0.98]"
          >
            {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</> : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
