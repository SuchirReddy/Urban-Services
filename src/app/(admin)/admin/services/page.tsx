'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Edit, Plus, Trash2, Tag, Clock, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) setServices(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    
    try {
      const res = await fetch(`/api/admin/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService)
      });
      if (res.ok) {
        toast.success('Service updated successfully');
        setEditingService(null);
        fetchServices();
      } else {
        toast.error('Failed to update service');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update service');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Services Catalog</h1>
          <p className="text-slate-500 mt-1">Manage offerings, pricing, and descriptions</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <Card key={service.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
            <div className="h-48 bg-slate-200 relative">
              {service.imageUrl ? (
                <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}
              <div className="absolute top-3 left-3 bg-white text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {service.category}
              </div>
            </div>
            
            <CardContent className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2">{service.name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 flex-1 mb-4">{service.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900">{service.price}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-900">{service.duration}m</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                onClick={() => setEditingService(service)}
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Service
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal Overlay */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl border-none">
            <form onSubmit={handleSave}>
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-slate-900">Edit Service</h2>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                  <Input 
                    value={editingService.name}
                    onChange={e => setEditingService({...editingService, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <Input 
                    value={editingService.category}
                    onChange={e => setEditingService({...editingService, category: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editingService.description}
                    onChange={e => setEditingService({...editingService, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                    <Input 
                      type="number"
                      value={editingService.price}
                      onChange={e => setEditingService({...editingService, price: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration (mins)</label>
                    <Input 
                      type="number"
                      value={editingService.duration}
                      onChange={e => setEditingService({...editingService, duration: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <div className="p-6 border-t bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                <Button type="button" variant="outline" onClick={() => setEditingService(null)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
