'use client';


import { Search, Star, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
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
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden rounded-b-[3rem] shadow-xl">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero_bg.png" 
            alt="Premium Home Interior" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Premium Home Services,<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">Delivered.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light">
            Book highly-rated professionals for cleaning, plumbing, beauty, and more. Guaranteed quality at your doorstep.
          </p>
          
          <form 
            onSubmit={handleSearch}
            className="mt-10 max-w-2xl mx-auto bg-white p-1.5 md:p-2 rounded-full border border-slate-200 flex items-center shadow-2xl"
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
            <button type="submit" className="bg-slate-900 text-white px-5 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base hover:bg-slate-800 transition-colors shadow-lg whitespace-nowrap">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-6xl mx-auto px-4 py-12 -mt-10 relative z-20 hidden md:block">
        <div
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 flex items-center justify-between border border-slate-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Verified Pros</h4>
              <p className="text-sm text-slate-500">Background-checked experts</p>
            </div>
          </div>
          <div className="w-px h-12 bg-slate-100"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-fuchsia-50 rounded-full flex items-center justify-center text-fuchsia-600">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Top Quality</h4>
              <p className="text-sm text-slate-500">Average 4.8/5 rating</p>
            </div>
          </div>
          <div className="w-px h-12 bg-slate-100"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Instant Booking</h4>
              <p className="text-sm text-slate-500">Book in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Popular Categories</h2>
          <p className="text-slate-500 mt-2 text-lg">Browse services by category to find exactly what you need.</p>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-6 md:overflow-visible">
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => router.push(`/services?category=${encodeURIComponent(category)}`)}
              className="w-36 md:w-auto shrink-0 snap-start bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
                {category.charAt(0)}
              </div>
              <span className="font-semibold text-slate-800 text-sm text-center">{category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services by Category */}
      <div className="py-12 bg-white">
        {categories.map((category, index) => {
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
                  className="hidden md:flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                >
                  View all {category.toLowerCase()} <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {categoryServices.slice(0, 6).map((service) => (
                  <div
                    key={service.id}
                    className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
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
                        <Button 
                          className="w-full md:w-auto h-8 md:h-10 text-xs md:text-sm rounded-full bg-black hover:bg-slate-800 text-white font-semibold px-3 md:px-4"
                          onClick={() => router.push(`/services/${service.id}`)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Promotional Banners injected between categories */}
            {index === 0 && (
              <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-slate-900 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden gap-8">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
                  
                  <div className="relative z-10 text-center md:text-left flex-1">
                    <h3 className="text-2xl md:text-4xl font-bold mb-4">Join the Premium Club</h3>
                    <p className="text-slate-300 max-w-xl text-lg mb-6 mx-auto md:mx-0">Get 20% off your first 3 bookings and enjoy priority support, dedicated professionals, and zero cancellation fees.</p>
                    <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-colors">
                      Explore Plans
                    </button>
                  </div>

                  <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Image
                      src="/images/banners/premium_club.png"
                      alt="Premium Club"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {index === 2 && (
              <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-indigo-50 rounded-3xl p-8 md:p-12 flex flex-col-reverse md:flex-row items-center justify-between border border-indigo-100 relative overflow-hidden gap-8">
                  <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-2xl overflow-hidden shadow-xl -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Image
                      src="/images/banners/home_protect.png"
                      alt="Protect Your Home"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="relative z-10 text-center md:text-right flex-1 flex flex-col items-center md:items-end">
                    <h3 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">Protect Your Home</h3>
                    <p className="text-slate-600 max-w-xl text-lg mb-6">Add a comprehensive home inspection to any deep cleaning service for absolutely free.</p>
                    <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 transition-colors">
                      Claim Offer
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
      <section className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">How it works</h2>
            <p className="text-slate-500 mt-4 text-lg">Your home services sorted in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl font-bold text-slate-900 mb-6">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Choose a service</h3>
              <p className="text-slate-500 leading-relaxed">Browse through our extensive list of premium services and select the one you need.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl font-bold text-slate-900 mb-6">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Book a slot</h3>
              <p className="text-slate-500 leading-relaxed">Pick a time that works best for you and instantly confirm your booking.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl font-bold text-slate-900 mb-6">3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Enjoy</h3>
              <p className="text-slate-500 leading-relaxed">Sit back and relax while our vetted professionals handle the rest.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
