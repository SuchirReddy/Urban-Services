import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex-1 w-full flex items-center justify-center min-h-[65vh]">
      <div className="flex flex-col items-center">
        
        {/* Container exclusively for Logo and Rings to keep them perfectly centered together */}
        <div className="relative flex items-center justify-center w-56 h-56">
          {/* Ambient glow behind the logo */}
          <div className="absolute inset-0 m-auto w-32 h-32 bg-slate-200/80 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
          
          {/* Elegant spinning rings */}
          <div className="absolute inset-0 m-auto w-40 h-40 border-[0.5px] border-slate-200 rounded-full" />
          <div className="absolute inset-0 m-auto w-48 h-48 border-[0.5px] border-transparent border-t-slate-300 rounded-full animate-spin" style={{ animationDuration: '2.5s' }} />
          <div className="absolute inset-0 m-auto w-56 h-56 border-[0.5px] border-transparent border-b-slate-200 rounded-full animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />

          {/* Logo Container */}
          <div className="relative w-28 h-28 z-10 drop-shadow-xl animate-pulse" style={{ animationDuration: '2s' }}>
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
        <div className="mt-8 flex flex-col items-center gap-4 z-10">
          <div className="text-xs font-semibold tracking-[0.25em] text-slate-500 uppercase">
            Curating Experience
          </div>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
          </div>
        </div>

      </div>
    </div>
  );
}
