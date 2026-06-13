'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Show splash screen for 2.5 seconds, then start fade out
    const timer = setTimeout(() => {
      setIsFading(true);
      // Remove from DOM after fade transition completes
      setTimeout(() => {
        setIsVisible(false);
      }, 700);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 transition-opacity duration-700 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Ambient glow behind the logo */}
        <div className="absolute inset-0 m-auto w-40 h-40 bg-slate-200/80 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />

        {/* Elegant spinning rings */}
        <div className="absolute inset-0 m-auto w-48 h-48 border-[0.5px] border-slate-200 rounded-full" />
        <div className="absolute inset-0 m-auto w-56 h-56 border-[0.5px] border-transparent border-t-slate-300 rounded-full animate-spin" style={{ animationDuration: '2.5s' }} />
        <div className="absolute inset-0 m-auto w-64 h-64 border-[0.5px] border-transparent border-b-slate-200 rounded-full animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />

        {/* Logo Container */}
        <div className="relative w-32 h-32 z-10 drop-shadow-2xl animate-pulse" style={{ animationDuration: '2s' }}>
          <Image
            src="/logo_transparent.png"
            alt="Urbio Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Premium Typography & Loading Indicator */}
      <div className="mt-10 flex flex-col items-center gap-3 z-10">
        <div className="text-xl font-semibold tracking-[0.4em] text-slate-800 uppercase ml-2">

        </div>
        <div className="text-[10px] font-medium tracking-[0.3em] text-slate-500 uppercase mt-1">
          Premium Home Services
        </div>
        <div className="flex gap-2 mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
        </div>
      </div>
    </div>
  );
}
