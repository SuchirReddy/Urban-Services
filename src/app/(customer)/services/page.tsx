'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Star, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useDemoRole } from '@/contexts/DemoRoleContext';

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

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { demoRole } = useDemoRole();
  
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || 'All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [priceRange, setPriceRange] = useState<number[]>([5000]); // Max price

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/services/categories')
        ]);
        
        if (servicesRes.ok) {
          const data = await servicesRes.json();
          setAllServices(data);
          // Auto-adjust max price based on data
          if (data.length > 0) {
            const max = Math.max(...data.map((s: Service) => s.price));
            const safeMax = max > 0 ? max : 5000;
            setMaxPrice(safeMax);
            setPriceRange([safeMax]);
          }
        }
        if (categoriesRes.ok) {
          setCategories(await categoriesRes.json());
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Update URL and local state when searchParams change (like if user uses browser back button)
  useEffect(() => {
    setSearchQuery(searchParams?.get('q') || '');
    setSelectedCategory(searchParams?.get('category') || 'All');
  }, [searchParams]);

  const updateFilters = (newQ: string, newCat: string) => {
    const params = new URLSearchParams();
    if (newQ) params.set('q', newQ);
    if (newCat && newCat !== 'All') params.set('category', newCat);
    router.push(`/services?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(searchQuery, selectedCategory);
  };

  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesPrice = service.price <= priceRange[0];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleBookNow = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Top Filters Bar */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..." 
                className="h-12 pl-12 rounded-full bg-slate-50 border-transparent hover:border-slate-200 focus-visible:ring-1 focus-visible:ring-black focus-visible:bg-white transition-all shadow-sm text-base font-medium"
              />
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
              <button type="submit" className="hidden">Submit</button>
            </form>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-sm font-bold text-slate-700">Max Price</span>
              <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">₹{priceRange[0]}</span>
            </div>
            <Slider 
              value={priceRange} 
              onValueChange={(val: any) => setPriceRange(Array.isArray(val) ? val : [val])} 
              max={maxPrice} 
              step={100} 
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="flex overflow-x-auto gap-3 pt-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <button
              onClick={() => updateFilters(searchQuery, 'All')}
              className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${selectedCategory === 'All' ? 'bg-black text-white border-black shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-black'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => updateFilters(searchQuery, cat)}
                className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${selectedCategory === cat ? 'bg-black text-white border-black shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-black'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {selectedCategory === 'All' ? 'All Services' : `${selectedCategory} Services`}
          </h1>
          <p className="text-slate-500 mt-2">Showing {filteredServices.length} result{filteredServices.length !== 1 && 's'}</p>
        </div>

        {filteredServices.length === 0 ? (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No services found</h3>
            <p className="text-slate-500 mb-6">We couldn't find any services matching your filters.</p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); updateFilters('', 'All'); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredServices.map(service => (
              <Card 
                key={service.id} 
                className="overflow-hidden hover:shadow-xl transition-shadow group flex flex-col rounded-2xl md:rounded-xl cursor-pointer"
                onClick={() => handleBookNow(service.id)}
              >
                <div className="relative h-32 md:h-48 shrink-0">
                  <Image 
                    src={service.imageUrl} 
                    alt={service.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-2 left-2 md:top-3 md:left-3 text-[10px] md:text-xs bg-white/90 text-black hover:bg-white/90 px-1.5 py-0 md:px-2.5 md:py-0.5">
                    {service.category}
                  </Badge>
                </div>
                <CardContent className="p-3 md:p-6 flex-1 flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between md:items-start mb-1 md:mb-2">
                    <h3 className="font-bold text-sm md:text-lg leading-tight pr-0 md:pr-4 line-clamp-1">{service.name}</h3>
                    <div className="text-left md:text-right shrink-0 mt-0.5 md:mt-0 flex items-center md:block gap-2">
                      <span className="font-bold text-sm md:text-base text-slate-900 block">₹{service.price}</span>
                      {service.rating ? (
                        <div className="flex items-center gap-1 text-amber-500 text-[10px] md:text-xs mt-0 md:mt-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-semibold text-slate-700">{service.rating.toFixed(1)}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <p className="hidden md:block text-sm text-slate-500 line-clamp-2 mb-6 flex-1">{service.description}</p>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-2 md:pt-4 border-t mt-auto gap-2 md:gap-0">
                    <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm text-slate-500 font-medium">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      {service.duration} mins
                    </div>
                    <Button 
                      className="w-full md:w-auto h-8 md:h-10 text-xs md:text-sm px-3 md:px-4"
                      onClick={() => handleBookNow(service.id)}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
