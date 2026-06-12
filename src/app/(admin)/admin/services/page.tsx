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
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({ name: '', category: '', description: '', price: '', duration: '', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop' });

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

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      });
      if (res.ok) {
        toast.success('Service added successfully');
        setIsAddingService(false);
        setNewService({ name: '', category: '', description: '', price: '', duration: '', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop' });
        fetchServices();
      } else {
        toast.error('Failed to add service');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add service');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-900" /></div>;
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Services Catalog</h1>
          <p className="text-slate-500 mt-1">Manage offerings, pricing, and descriptions</p>
        </div>
        <Button className="bg-black text-white hover:bg-slate-800 rounded-full font-bold px-6 h-12 shadow-md transition-all" onClick={() => setIsAddingService(true)}>
          <Plus className="w-5 h-5 mr-2" /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <Card key={service.id} className="border border-slate-100 shadow-xl rounded-3xl hover:shadow-2xl transition-all overflow-hidden flex flex-col">
            <div className="h-48 bg-slate-200 relative">
              {service.imageUrl ? (
                <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}
              <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                {service.category}
              </div>
            </div>
            
            <CardContent className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2 text-slate-900">{service.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-6">{service.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <IndianRupee className="w-3 h-3" /> Price
                  </div>
                  <span className="font-bold text-slate-900 text-lg">₹{service.price}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Clock className="w-3 h-3" /> Duration
                  </div>
                  <span className="font-bold text-slate-900 text-lg">{service.duration}m</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 rounded-full font-bold border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl border border-slate-100 rounded-3xl overflow-hidden bg-white">
            <form onSubmit={handleSave}>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900">Edit Service</h2>
              </div>
              <CardContent className="p-6 space-y-4 bg-slate-50/50">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Service Name</label>
                  <Input 
                    value={editingService.name}
                    onChange={e => setEditingService({...editingService, name: e.target.value})}
                    required
                    className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
                  <Input 
                    value={editingService.category}
                    onChange={e => setEditingService({...editingService, category: e.target.value})}
                    required
                    className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                  <textarea 
                    className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                    value={editingService.description}
                    onChange={e => setEditingService({...editingService, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Price (₹)</label>
                    <Input 
                      type="number"
                      value={editingService.price}
                      onChange={e => setEditingService({...editingService, price: e.target.value})}
                      required
                      className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Duration (mins)</label>
                    <Input 
                      type="number"
                      value={editingService.duration}
                      onChange={e => setEditingService({...editingService, duration: e.target.value})}
                      required
                      className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-black"
                    />
                  </div>
                </div>
              </CardContent>
              <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                <Button type="button" variant="outline" className="rounded-full h-12 px-6 font-bold border-slate-200 hover:bg-slate-50" onClick={() => setEditingService(null)}>Cancel</Button>
                <Button type="submit" className="bg-black hover:bg-slate-800 text-white rounded-full h-12 px-6 font-bold shadow-md">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Add Modal Overlay */}
      {isAddingService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl border border-slate-100 rounded-3xl overflow-hidden bg-white">
            <form onSubmit={handleAddService}>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900">Add New Service</h2>
              </div>
              <CardContent className="p-6 space-y-4 bg-slate-50/50 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Service Name</label>
                  <Input 
                    value={newService.name}
                    onChange={e => setNewService({...newService, name: e.target.value})}
                    required
                    placeholder="e.g. Deep Home Cleaning"
                    className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
                  <Input 
                    value={newService.category}
                    onChange={e => setNewService({...newService, category: e.target.value})}
                    required
                    placeholder="e.g. Cleaning"
                    className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Image URL</label>
                  <Input 
                    value={newService.imageUrl}
                    onChange={e => setNewService({...newService, imageUrl: e.target.value})}
                    required
                    placeholder="https://..."
                    className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                  <textarea 
                    className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                    value={newService.description}
                    onChange={e => setNewService({...newService, description: e.target.value})}
                    required
                    placeholder="Detailed description of the service..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Price (₹)</label>
                    <Input 
                      type="number"
                      value={newService.price}
                      onChange={e => setNewService({...newService, price: e.target.value})}
                      required
                      placeholder="999"
                      className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Duration (mins)</label>
                    <Input 
                      type="number"
                      value={newService.duration}
                      onChange={e => setNewService({...newService, duration: e.target.value})}
                      required
                      placeholder="120"
                      className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-black"
                    />
                  </div>
                </div>
              </CardContent>
              <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                <Button type="button" variant="outline" className="rounded-full h-12 px-6 font-bold border-slate-200 hover:bg-slate-50" onClick={() => setIsAddingService(false)}>Cancel</Button>
                <Button type="submit" className="bg-black hover:bg-slate-800 text-white rounded-full h-12 px-6 font-bold shadow-md">Add Service</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
