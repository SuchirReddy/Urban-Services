'use client';


import { Search, Star, Clock, ArrowRight, ShieldCheck, Zap, Sparkles, Droplets, Scissors, Wrench, Paintbrush, Hammer } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useDemoRole } from '@/contexts/DemoRoleContext';
import { useRouter } from 'next/navigation';
import { useState, Fragment } from 'react';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  rating?: number;
}

interface Professional {
  id: string;
  name: string;
  rating: number;
  jobCount: number;
  avatar: string | null;
}



export default function HomePageClient({ services, professionals, categories }: { services: Service[], professionals: Professional[], categories: string[] }) {
  const { demoRole } = useDemoRole();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/services');
    }
  };

  const handleBookNow = () => {
    if (demoRole === 'customer') {
      router.push('/customer');
    } else {
      alert('Please select a Customer role from the Demo menu in the header first.');
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden rounded-b-[3rem] shadow-xl -mt-24 pt-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_bg_ultra.png"
            alt="Premium Home Interior"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/30" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight drop-shadow-sm">
            Premium Home Services,<br/> Delivered.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-900 max-w-2xl mx-auto font-semibold leading-relaxed drop-shadow-md">
            Book highly-rated professionals for cleaning, plumbing, beauty, and more. Guaranteed quality at your doorstep.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-10 max-w-2xl mx-auto bg-white/95 backdrop-blur-xl p-1.5 md:p-2 rounded-full flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-black/5 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] focus-within:ring-black/20 focus-within:bg-white"
          >
            <div className="pl-4 pr-2 md:pl-6 md:pr-4">
              <Search className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you need help with?"
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-black placeholder-slate-500 font-medium md:font-bold text-sm md:text-lg py-2 md:py-3"
            />
            <button type="submit" className="relative overflow-hidden group/btn bg-slate-50/50 backdrop-blur-xl px-5 md:px-8 py-2 md:py-3 rounded-full text-slate-800 font-bold text-sm md:text-base shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-slate-50/60 whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
              <span className="relative z-10">Search</span>
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-28 pb-12 relative z-20 hidden md:flex items-center justify-center gap-6">
        <div className="group bg-white/90 backdrop-blur-xl rounded-full shadow-xl shadow-slate-200/50 p-2 pr-8 flex items-center gap-4 border border-slate-200/60 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="w-14 h-14 bg-slate-50/50 backdrop-blur-xl rounded-full flex items-center justify-center text-slate-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 relative overflow-hidden group-hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] transition-all">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-wide uppercase">Verified Pros</h4>
            <p className="text-xs text-slate-500 font-semibold">Background-checked experts</p>
          </div>
        </div>

        <div className="group bg-white/90 backdrop-blur-xl rounded-full shadow-xl shadow-slate-200/50 p-2 pr-8 flex items-center gap-4 border border-slate-200/60 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="w-14 h-14 bg-slate-50/50 backdrop-blur-xl rounded-full flex items-center justify-center text-slate-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 relative overflow-hidden group-hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] transition-all">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <Star className="w-6 h-6 fill-current" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-wide uppercase">Top Quality</h4>
            <p className="text-xs text-slate-500 font-semibold">Average 4.8/5 rating</p>
          </div>
        </div>

        <div className="group bg-white/90 backdrop-blur-xl rounded-full shadow-xl shadow-slate-200/50 p-2 pr-8 flex items-center gap-4 border border-slate-200/60 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="w-14 h-14 bg-slate-50/50 backdrop-blur-xl rounded-full flex items-center justify-center text-slate-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 relative overflow-hidden group-hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] transition-all">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <Zap className="w-6 h-6 fill-current" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-wide uppercase">Instant Booking</h4>
            <p className="text-xs text-slate-500 font-semibold">Book in seconds</p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Popular Categories</h2>
          <p className="text-slate-500 mt-2 text-lg">Browse services by category to find exactly what you need.</p>
        </div>
        <div className="overflow-hidden relative -mx-4 px-4 md:mx-0 md:px-0 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pb-6 pt-2">
          <div className="flex gap-4 md:gap-6 animate-scroll-left w-max hover:[animation-play-state:paused]">
            {[...categories, ...categories, ...categories].map((category, index) => (
              <div
                key={`${category}-${index}`}
                onClick={() => router.push(`/services?category=${encodeURIComponent(category)}`)}
                className="w-36 md:w-48 shrink-0 bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] p-6 md:p-8 flex flex-col items-center justify-center gap-3 md:gap-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50/50 backdrop-blur-xl rounded-full flex items-center justify-center text-slate-800 text-xl md:text-2xl font-bold shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 relative overflow-hidden group-hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] transition-all">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    {category === 'Cleaning' ? <Sparkles className="w-6 h-6 md:w-8 md:h-8" /> :
                     category === 'Plumbing' ? <Droplets className="w-6 h-6 md:w-8 md:h-8" /> :
                     category === 'Beauty' ? <Scissors className="w-6 h-6 md:w-8 md:h-8" /> :
                     category === 'Appliance Repair' ? <Wrench className="w-6 h-6 md:w-8 md:h-8" /> :
                     category === 'Electrician' ? <Zap className="w-6 h-6 md:w-8 md:h-8" /> :
                     category === 'Painting' ? <Paintbrush className="w-6 h-6 md:w-8 md:h-8" /> :
                     category === 'Carpentry' ? <Hammer className="w-6 h-6 md:w-8 md:h-8" /> :
                     category.charAt(0)}
                  </div>
                </div>
                <span className="font-semibold text-slate-800 text-sm md:text-base text-center whitespace-nowrap">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services by Category */}
      <div className="py-12 bg-white">
        {categories.filter(c => c !== 'Painting').map((category, index) => {
          const categoryServices = services.filter((s) => s.category === category);
          if (categoryServices.length === 0) return null;

          return (
            <Fragment key={category}>
              <section className="max-w-7xl mx-auto px-4 py-12 md:py-16 border-t border-slate-100 first-of-type:border-t-0">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">{category}</h2>
                    <p className="text-slate-500 mt-2 text-base md:text-lg">Top-rated {category.toLowerCase()} professionals at your service.</p>
                  </div>
                  <button
                    onClick={() => router.push(`/services?category=${encodeURIComponent(category)}`)}
                    className="hidden md:flex relative overflow-hidden group/btn bg-slate-50/50 backdrop-blur-xl px-6 py-2.5 rounded-full text-slate-800 font-bold shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-slate-50/60"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
                    <span className="relative z-10 flex items-center gap-2">View all {category.toLowerCase()} <ArrowRight className="w-4 h-4" /></span>
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {categoryServices.slice(0, 6).map((service) => (
                    <div
                      key={service.id}
                      className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                      onClick={() => router.push(`/services/${service.id}`)}
                    >
                      <div className="relative h-32 md:h-64 overflow-hidden shrink-0">
                        <Image
                          src={service.imageUrl}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3 md:p-6 flex flex-col flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 md:mb-2">
                          <h3 className="text-sm md:text-xl font-bold text-slate-900 line-clamp-1">{service.name}</h3>
                          <div className="text-left md:text-right mt-0.5 md:mt-0 flex items-center md:block gap-2">
                            <span className="text-sm md:text-lg font-bold text-slate-900 block">₹{service.price}</span>
                            {service.rating ? (
                              <div className="flex items-center gap-1 text-amber-500 text-[10px] md:text-xs mt-0 md:mt-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="font-bold text-slate-700">{service.rating.toFixed(1)}</span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <p className="hidden md:block text-slate-500 text-sm line-clamp-2 mb-4">{service.description}</p>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-2 md:pt-4 border-t border-slate-100 mt-auto gap-2 md:gap-0">
                          <div className="flex items-center gap-1 md:gap-2 text-slate-500 text-[10px] md:text-sm font-medium">
                            <Clock className="w-3 h-3 md:w-4 md:h-4" />
                            {service.duration} mins
                          </div>
                          <button
                            className="relative overflow-hidden group/btn w-full md:w-auto h-8 md:h-10 rounded-full bg-slate-50/50 backdrop-blur-xl text-slate-800 font-bold shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-slate-50/60 px-3 md:px-4"
                            onClick={() => router.push(`/services/${service.id}`)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
                            <span className="relative z-10 flex items-center justify-center h-full w-full text-xs md:text-sm">Book Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Promotional Banners injected between categories */}
              {index === 0 && (
                <div className="max-w-7xl mx-auto px-4 py-12">
                  <div className="bg-black rounded-[3rem] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden gap-12 shadow-2xl">
                    <div className="relative z-10 text-center md:text-left flex-1 flex flex-col items-center md:items-start">
                      <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-4">Urbio Exclusive</span>
                      <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">The Black Card.</h3>
                      <p className="text-slate-400 max-w-md text-lg mb-8 leading-relaxed font-light">Elevate your home. Enjoy 20% off all bookings, priority luxury support, and a dedicated team of master professionals.</p>
                      <button className="relative overflow-hidden group/btn bg-slate-50/50 backdrop-blur-xl px-10 py-4 rounded-full text-slate-800 font-bold text-sm tracking-wide shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-slate-50/60">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
                        <span className="relative z-10">EXPLORE BENEFITS</span>
                      </button>
                    </div>

                    <div className="relative z-10 w-full md:w-[450px] h-64 md:h-[350px] shrink-0 rounded-[2rem] overflow-hidden shadow-2xl">
                      <Image
                        src="/images/banners/premium_club_v2.png"
                        alt="Urbio Premium Club"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {index === 2 && (
                <div className="max-w-7xl mx-auto px-4 py-12">
                  <div className="bg-[#F8F7F5] rounded-[3rem] p-8 md:p-14 flex flex-col-reverse md:flex-row items-center justify-between border border-slate-200/50 relative overflow-hidden gap-12 shadow-xl shadow-slate-200/40">
                    <div className="relative z-10 w-full md:w-[450px] h-64 md:h-[350px] shrink-0 rounded-[2rem] overflow-hidden shadow-2xl">
                      <Image
                        src="/images/banners/home_protect_v2.png"
                        alt="Signature Home Detailing"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <div className="relative z-10 text-center md:text-right flex-1 flex flex-col items-center md:items-end">
                      <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-4">Signature Add-on</span>
                      <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Immaculate Detail.</h3>
                      <p className="text-slate-500 max-w-md text-lg mb-8 leading-relaxed font-light">Add our comprehensive white-glove inspection to any deep cleaning service. Perfection, guaranteed.</p>
                      <button className="relative overflow-hidden group/btn bg-slate-50/50 backdrop-blur-xl px-10 py-4 rounded-full text-slate-800 font-bold text-sm tracking-wide shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-slate-50/60">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
                        <span className="relative z-10">CLAIM OFFER</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {category === 'Electrician' && (
                <div className="max-w-7xl mx-auto px-4 py-12">
                  <div className="bg-slate-900 rounded-[3rem] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden gap-12 shadow-2xl">
                    <div className="relative z-10 text-center md:text-left flex-1 flex flex-col items-center md:items-start">
                      <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-4">Smart Home</span>
                      <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">The Future is Here.</h3>
                      <p className="text-slate-400 max-w-md text-lg mb-8 leading-relaxed font-light">Upgrade your space with intelligent lighting, climate control, and security systems. Installed by our master electricians.</p>
                      <button className="relative overflow-hidden group/btn bg-slate-50/50 backdrop-blur-xl px-10 py-4 rounded-full text-slate-800 font-bold text-sm tracking-wide shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-slate-50/60">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
                        <span className="relative z-10">DISCOVER UPGRADES</span>
                      </button>
                    </div>

                    <div className="relative z-10 w-full md:w-[450px] h-64 md:h-[350px] shrink-0 rounded-[2rem] overflow-hidden shadow-2xl">
                      <Image
                        src="/images/banners/smart_home_v2.png"
                        alt="Smart Home Upgrades"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'Carpentry' && (
                <div className="max-w-7xl mx-auto px-4 py-12">
                  <div className="bg-[#2A1B12] rounded-[3rem] p-8 md:p-14 flex flex-col-reverse md:flex-row items-center justify-between text-white relative overflow-hidden gap-12 shadow-2xl">
                    <div className="relative z-10 w-full md:w-[450px] h-64 md:h-[350px] shrink-0 rounded-[2rem] overflow-hidden shadow-2xl">
                      <Image
                        src="/images/banners/carpentry_v2.png"
                        alt="Bespoke Woodwork"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <div className="relative z-10 text-center md:text-right flex-1 flex flex-col items-center md:items-end">
                      <span className="text-[10px] font-bold text-amber-500/80 tracking-[0.2em] uppercase mb-4">Master Craftsmanship</span>
                      <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Bespoke Woodwork.</h3>
                      <p className="text-amber-100/70 max-w-md text-lg mb-8 leading-relaxed font-light">Custom shelving, luxury home libraries, and premium furniture repair. Designed and crafted by elite artisans.</p>
                      <button className="relative overflow-hidden group/btn bg-slate-50/50 backdrop-blur-xl px-10 py-4 rounded-full text-slate-800 font-bold text-sm tracking-wide shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-slate-50/60">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
                        <span className="relative z-10">BOOK A CRAFTSMAN</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      {/* How it works */}
      <section className="bg-white py-32 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">How it works.</h2>
            <p className="text-slate-500 mt-4 text-xl font-light max-w-2xl">Three simple steps to experience the best home services.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            <div className="group cursor-default">
              <div className="text-8xl font-light text-black mb-8 tracking-tighter transition-colors duration-500">01</div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-widest uppercase">Select Service</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Browse through our curated list of premium services and choose exactly what you need.</p>
            </div>
            <div className="group cursor-default">
              <div className="text-8xl font-light text-black mb-8 tracking-tighter transition-colors duration-500">02</div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-widest uppercase">Pick a Time</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Select a convenient slot that fits your schedule perfectly. Instant confirmation.</p>
            </div>
            <div className="group cursor-default">
              <div className="text-8xl font-light text-black mb-8 tracking-tighter transition-colors duration-500">03</div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-widest uppercase">Relax & Enjoy</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Sit back while our vetted, background-checked professionals handle everything else.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services by Category - Painting (Under How It Works) */}
      <div className="py-12 bg-white">
        {categories.filter(c => c === 'Painting').map((category, index) => {
          const categoryServices = services.filter((s) => s.category === category);
          if (categoryServices.length === 0) return null;

          return (
            <Fragment key={category}>
              <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">{category}</h2>
                    <p className="text-slate-500 mt-2 text-base md:text-lg">Top-rated {category.toLowerCase()} professionals at your service.</p>
                  </div>
                  <button
                    onClick={() => router.push(`/services?category=${encodeURIComponent(category)}`)}
                    className="hidden md:flex relative overflow-hidden group/btn bg-slate-50/50 backdrop-blur-xl px-6 py-2.5 rounded-full text-slate-800 font-bold shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-slate-50/60"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
                    <span className="relative z-10 flex items-center gap-2">View all {category.toLowerCase()} <ArrowRight className="w-4 h-4" /></span>
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {categoryServices.slice(0, 6).map((service) => (
                    <div
                      key={service.id}
                      className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                      onClick={() => router.push(`/services/${service.id}`)}
                    >
                      <div className="relative h-32 md:h-64 overflow-hidden shrink-0">
                        <Image
                          src={service.imageUrl}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3 md:p-6 flex flex-col flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 md:mb-2">
                          <h3 className="text-sm md:text-xl font-bold text-slate-900 line-clamp-1">{service.name}</h3>
                          <div className="text-left md:text-right mt-0.5 md:mt-0 flex items-center md:block gap-2">
                            <span className="text-sm md:text-lg font-bold text-slate-900 block">₹{service.price}</span>
                            {service.rating ? (
                              <div className="flex items-center gap-1 text-amber-500 text-[10px] md:text-xs mt-0 md:mt-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="font-bold text-slate-700">{service.rating.toFixed(1)}</span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <p className="hidden md:block text-slate-500 text-sm line-clamp-2 mb-4">{service.description}</p>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-2 md:pt-4 border-t border-slate-100 mt-auto gap-2 md:gap-0">
                          <div className="flex items-center gap-1 md:gap-2 text-slate-500 text-[10px] md:text-sm font-medium">
                            <Clock className="w-3 h-3 md:w-4 md:h-4" />
                            {service.duration} mins
                          </div>
                          <button
                            className="relative overflow-hidden group/btn w-full md:w-auto h-8 md:h-10 rounded-full bg-slate-50/50 backdrop-blur-xl text-slate-800 font-bold shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-slate-50/60 px-3 md:px-4"
                            onClick={() => router.push(`/services/${service.id}`)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
                            <span className="relative z-10 flex items-center justify-center h-full w-full text-xs md:text-sm">Book Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="max-w-7xl mx-auto px-4 py-12 pb-24">
                <div className="bg-[#1A2E26] rounded-[3rem] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden gap-12 shadow-2xl">
                  <div className="relative z-10 text-center md:text-left flex-1 flex flex-col items-center md:items-start">
                    <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase mb-4">Color & Character</span>
                    <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Master Painters.</h3>
                    <p className="text-emerald-100/80 max-w-md text-lg mb-8 leading-relaxed font-light">Transform your space with premium paints and master craftsmen. From single accent walls to full-home luxury makeovers.</p>
                    <button className="relative overflow-hidden group/btn bg-slate-50/50 backdrop-blur-xl px-10 py-4 rounded-full text-slate-800 font-bold text-sm tracking-wide shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-slate-50/60">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
                      <span className="relative z-10">GET A QUOTE</span>
                    </button>
                  </div>

                  <div className="relative z-10 w-full md:w-[450px] h-64 md:h-[350px] shrink-0 rounded-[2rem] overflow-hidden shadow-2xl">
                    <Image
                      src="/images/banners/painting_v2.png"
                      alt="Luxury Painting Services"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>

      {/* Ready to Upgrade CTA */}
      <section className="bg-black py-24 relative overflow-hidden mt-12 rounded-t-[3rem] shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">Experience Premium Home Services</h2>
          <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            Join thousands of happy customers who trust Urbio for their home needs. Verified professionals, guaranteed quality, zero hassle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="relative overflow-hidden group/btn bg-slate-50/50 backdrop-blur-xl rounded-full h-14 px-8 text-slate-800 text-lg font-bold shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/80 ring-1 ring-slate-900/5 w-full sm:w-auto transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] hover:bg-slate-50/60" onClick={() => router.push('/services')}>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/10 to-transparent pointer-events-none" />
              <span className="relative z-10 flex items-center justify-center h-full w-full">Book Your First Service</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
