'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  MoreVertical,
  TrendingUp,
  Layout,
  ArrowRight
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Skeleton from '@/components/Skeleton';
import Link from 'next/link';

export default function AgentDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, appsRes] = await Promise.all([
          apiRequest('dashboard/stats', {}, token),
          apiRequest('application/list', {}, token)
        ]);
        setStats(statsRes.data);
        setApplications(appsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }
    if (token) fetchData();
  }, [token]);

  const StatSkeleton = () => (
    <div className="card-premium p-8">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-10 w-16" />
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">
          Agent <span className="text-indigo-600 underline decoration-indigo-100 decoration-8 underline-offset-4">Console</span>
        </h1>
        <p className="text-gray-500 font-medium italic">Manage client applications and monitor registration progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          <>
            <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
          </>
        ) : (
          <>
            <StatCard icon={Users} label="Total Clients" value={stats?.total || 0} color="indigo" />
            <StatCard icon={Clock} label="Pending Review" value={stats?.pending || 0} color="amber" />
            <StatCard icon={CheckCircle2} label="Processed" value={stats?.completed || 0} color="emerald" />
            <StatCard icon={TrendingUp} label="Success Rate" value="100%" color="violet" />
          </>
        )}
      </div>

      <div className="card-premium p-8 lg:p-12">
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-50">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Active Registrations</h3>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search applications..." className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <Link href="/dashboard/applications" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-24">
             <p className="text-gray-400 font-bold italic text-lg uppercase tracking-widest leading-loose">No active registrations <br/> currently assigned to you.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                  <th className="pb-4">Client Name</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Last Updated</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app) => (
                  <tr key={app.ApplicationID} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-6">
                      <p className="font-bold text-gray-900 tracking-tight">{app.FullName}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mt-1">{app.ApplicationID}</p>
                    </td>
                    <td className="py-6 text-sm font-medium text-gray-600">{app.DSCType}</td>
                    <td className="py-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black ring-1 ring-inset ${
                        app.ApplicationStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' :
                        'bg-amber-50 text-amber-600 ring-amber-100'
                      }`}>
                        {app.ApplicationStatus}
                      </span>
                    </td>
                    <td className="py-6 text-xs font-bold text-gray-500">
                      {new Date(app.UpdatedAt || app.CreatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-6 text-right">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
  };

  return (
    <div className="card-premium p-8 group">
      <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.1em] mb-1">{label}</p>
      <h4 className="text-4xl font-black text-gray-900 tracking-tighter">{value}</h4>
    </div>
  );
}
