'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  PlusCircle, 
  Trash2, 
  Edit2, 
  Save, 
  Zap, 
  Layers,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

export default function AdminSettingsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, prices] = await Promise.all([
          apiRequest('categories/list', {}, token),
          apiRequest('pricing/list', {}, token)
        ]);
        setCategories(cats.data || []);
        setPricing(prices.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  const handleAddCategory = async () => {
    const name = prompt('Category Name:');
    const description = prompt('Description:');
    if (!name) return;
    try {
      await apiRequest('admin/addCategory', { name, description }, token);
      window.location.reload(); // Refresh to see new ID
    } catch (e) { alert('Failed'); }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete category?')) return;
    try {
      await apiRequest('admin/deleteCategory', { id }, token);
      setCategories(categories.filter(c => c.CategoryID !== id));
    } catch (e) { alert('Failed'); }
  };

  const handleAddPricing = async () => {
    const category = prompt('Category Name (Must match exactly):');
    const tierName = prompt('Tier Name (e.g. Basic, Pro):');
    const price = prompt('Price (Numeric):');
    if (!category || !tierName || !price) return;
    try {
      await apiRequest('admin/addPricing', { category, tierName, price: Number(price) }, token);
      window.location.reload();
    } catch (e) { alert('Failed'); }
  };

  const handleDeletePricing = async (id: string) => {
    if (!confirm('Delete pricing?')) return;
    try {
      await apiRequest('admin/deletePricing', { id }, token);
      setPricing(pricing.filter(p => p.TierID !== id));
    } catch (e) { alert('Failed'); }
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          System Configuration <Settings className="ml-3 h-7 w-7 text-indigo-600 animate-spin-slow" />
        </h1>
        <p className="text-gray-500 mt-1 font-medium italic">Configure DSC categories, service pricing and feature tiers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Category Management */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Layers className="mr-3 h-5 w-5 text-indigo-600" />
              DSC Categories
            </h3>
            <button 
              onClick={handleAddCategory}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {categories.length === 0 && !loading && (
              <p className="text-sm text-gray-400 italic">No categories defined.</p>
            )}
            {categories.map((cat) => (
              <div key={cat.CategoryID} className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-900 leading-none mb-1">{cat.CategoryName}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Status: Active</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleDeleteCategory(cat.CategoryID)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Management */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Zap className="mr-3 h-5 w-5 text-amber-500" />
              Service Pricing
            </h3>
            <button 
              onClick={handleAddPricing}
              className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {pricing.map((price) => (
              <div key={price.TierID} className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mr-4">
                    <span className="font-black text-indigo-600 text-xs">₹</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{price.TierName}</h4>
                    <p className="text-[10px] text-gray-500 font-medium mb-1">{price.Category}</p>
                    <p className="text-lg font-black text-indigo-600">₹{price.Price}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeletePricing(price.TierID)}
                  className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:text-red-500 transition-all active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-indigo-100 group">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Publish Changes</h3>
          <p className="text-indigo-100 max-w-md opacity-80 text-sm leading-relaxed">
            Updated settings will be instantly available across the public landing page and client dashboards.
          </p>
        </div>
        <button className="mt-8 md:mt-0 bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center shadow-lg hover:shadow-indigo-500/20 transition-all group-hover:scale-105">
          <Save className="mr-2 h-5 w-5" />
          Sync to Production
        </button>
      </div>
    </div>
  );
}
