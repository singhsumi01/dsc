'use client';

import { 
  FileText, 
  Users, 
  PlusCircle, 
  ArrowRight,
  UserPlus,
  Send,
  PieChart
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

export default function AgentDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiRequest('dashboard/stats', {}, token);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [token]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Agent Portal</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your clients and their DSC applications.</p>
        </div>
        <div className="flex space-x-4">
          <Link href="/dashboard/clients/new" className="bg-white text-gray-900 px-6 py-3.5 rounded-2xl font-bold flex items-center border border-gray-200 hover:bg-gray-50 transition-all">
            <UserPlus className="mr-2 h-5 w-5 text-indigo-600" />
            Add Client
          </Link>
          <Link href="/dashboard/applications/new" className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Application
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <PieChart className="h-8 w-8 text-indigo-600 mb-4" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Applications</p>
          <p className="text-2xl font-black text-gray-900">{loading ? '...' : stats?.total || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <Send className="h-8 w-8 text-amber-600 mb-4" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Pending Sync</p>
          <p className="text-2xl font-black text-gray-900">{loading ? '...' : stats?.pending || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <Users className="h-8 w-8 text-emerald-600 mb-4" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Clients</p>
          <p className="text-2xl font-black text-gray-900">12</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900">Client Applications</h3>
          <Link href="/dashboard/applications" className="text-indigo-600 text-sm font-bold flex items-center hover:underline">
            Manage All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="pb-4 pl-4">Application ID</th>
                <th className="pb-4">Client Name</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-5 pl-4 font-bold text-gray-900">DSC_APP_240318_10{i}</td>
                  <td className="py-5 text-sm text-gray-600 font-medium">Rahul Sharma</td>
                  <td className="py-5 text-sm text-gray-500 font-medium italic">Class 3 Ind.</td>
                  <td className="py-5">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold ring-1 ring-amber-100">Pending</span>
                  </td>
                  <td className="py-5 pr-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
