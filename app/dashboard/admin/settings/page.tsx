'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  FileBadge, 
  CreditCard,
  Loader2,
  Zap,
  Layout,
  Tag
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

export default function AdminSettingsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  const token = useAuthStore(state => state.token);

  const fetchData = async () => {
    try {
      const [catRes, priceRes] = await Promise.all([
        apiRequest('categories/list', {}, token),
        apiRequest('pricing/list', {}, token)
      ]);
      setCategories(catRes.data || []);
      setPricing(priceRes.data || []);
    } catch (err) {
      setToast({ message: 'Failed to sync with global catalog', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleAddCategory = async () => {
    const name = prompt('Enter Global Category Name:');
    const description = prompt('Provide Category Description:');
    if (!name || !description) return;

    setActionLoading(true);
    try {
      await apiRequest('admin/addCategory', { name, description }, token);
      setToast({ message: 'New Category Cataloged', type: 'success' });
      fetchData();
    } catch (err) {
      setToast({ message: 'Failed to add entry', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddPricing = async () => {
    const category = prompt('Category Target Name:');
    const tierName = prompt('Pricing Tier Label (e.g. Premium):');
    const price = prompt('Base Price (Numeric):');
    if (!category || !tierName || !price) return;

    setActionLoading(true);
    try {
      await apiRequest('admin/addPricing', { category, tierName, price: Number(price) }, token);
      setToast({ message: 'Pricing Plan Broadcasted', type: 'success' });
      fetchData();
    } catch (err) {
      setToast({ message: 'Failed to broadcast plan', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async (action: string, id: string) => {
    if (!confirm('Permanently decommission this catalog entry?')) return;
    setActionLoading(true);
    try {
      await apiRequest(`admin/${action}`, { id }, token);
      setToast({ message: 'Entry decommissioned', type: 'success' });
      fetchData();
    } catch (err) {
      setToast({ message: 'Deletion request rejected', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title, desc, onAction, actionLabel }: any) => (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
      <div className="animate-fade-in-up">
        <h3 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center leading-none">
           <Icon className="h-8 w-8 mr-3 text-indigo-600" />
           {title}
        </h3>
        <p className="text-gray-500 font-medium italic mt-2">{desc}</p>
      </div>
      <button 
        onClick={onAction}
        disabled={actionLoading}
        className="btn-primary py-3 px-6 h-14 flex items-center text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-100 group"
      >
        {actionLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />}
        {actionLabel}
      </button>
    </div>
  );

  return (
    <div className="space-y-20 animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-3">
             System <span className="text-indigo-600">Config</span>
          </h1>
          <p className="text-gray-500 font-medium italic text-lg opacity-80">Refine your service offerings and global pricing models.</p>
        </div>
        <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 px-4 py-2 rounded-xl">
           <Layout className="h-4 w-4 mr-2 text-indigo-500" /> Catalog Version 2.0
        </div>
      </div>

      <section>
        <SectionHeader 
          icon={Tag} 
          title="DSC Categories" 
          desc="Manage primary service classifications for the application wizard." 
          onAction={handleAddCategory}
          actionLabel="Add Category"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <><Skeleton className="h-48 w-full"/><Skeleton className="h-48 w-full"/><Skeleton className="h-48 w-full"/></>
          ) : (
            categories.map((cat, idx) => (
              <div 
                key={cat.CategoryID} 
                className="card-premium p-8 group stagger-item"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000">
                   <FileBadge className="h-32 w-32" />
                </div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                   <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <FileBadge className="h-5 w-5" />
                   </div>
                   <button onClick={() => handleDeleteItem('deleteCategory', cat.CategoryID)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                   </button>
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-2 relative z-10">{cat.CategoryName}</h4>
                <p className="text-xs text-gray-400 font-medium italic leading-relaxed relative z-10">{cat.Description}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="pt-10 border-t border-gray-100">
        <SectionHeader 
          icon={CreditCard} 
          title="Pricing Plans" 
          desc="Define validity tiers and unit costs for each DSC category." 
          onAction={handleAddPricing}
          actionLabel="Create Plan"
        />
        <div className="card-premium p-10 overflow-hidden">
           {loading ? (
             <div className="space-y-4"><Skeleton className="h-14 w-full"/><Skeleton className="h-14 w-full"/></div>
           ) : (
             <div className="overflow-x-auto -mx-10 px-10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <th className="pb-6">Target Category</th>
                      <th className="pb-6">Plan Label</th>
                      <th className="pb-6">Unit Price</th>
                      <th className="pb-6 text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pricing.map((p, idx) => (
                      <tr 
                        key={p.PricingID} 
                        className="group hover:bg-gray-50/50 transition-colors stagger-item"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <td className="py-6 font-black text-gray-900">{p.Category}</td>
                        <td className="py-6">
                           <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ring-indigo-100">
                              {p.TierName}
                           </span>
                        </td>
                        <td className="py-6 text-lg font-black text-indigo-600 tracking-tight">₹{p.Price}</td>
                        <td className="py-6 text-right">
                           <button onClick={() => handleDeleteItem('deletePricing', p.PricingID)} className="p-3 text-gray-300 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-95">
                              <Trash2 className="h-4 w-4" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           )}
        </div>
      </section>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
