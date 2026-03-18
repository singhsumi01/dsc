'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Layout
} from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Skeleton from '@/components/Skeleton';

export default function ClientDashboard({ user }: { user: any }) {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">
            Welcome, <span className="text-indigo-600 underline decoration-indigo-100 decoration-8 underline-offset-4">{user.Name}</span>
          </h1>
          <p className="text-gray-500 font-medium italic">Track your Digital Signature Certificate status in real-time.</p>
        </div>
        <Link 
          href="/dashboard/applications/new" 
          className="btn-primary flex items-center group"
        >
          <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
          New Application
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          <>
            <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
          </>
        ) : (
          <>
            <StatCard icon={Layout} label="Total Apps" value={stats?.total || 0} color="indigo" />
            <StatCard icon={Clock} label="Pending" value={stats?.pending || 0} color="amber" />
            <StatCard icon={CheckCircle2} label="Completed" value={stats?.completed || 0} color="emerald" />
            <StatCard icon={TrendingUp} label="Payments" value={stats?.payments || 0} color="violet" />
          </>
        )}
      </div>

      <div className="card-premium p-8 lg:p-12">
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-50">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Applications</h3>
          <Link href="/dashboard/applications" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center group">
            View All Applications <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 font-bold italic text-lg uppercase tracking-widest">No applications found.</p>
            <Link href="/dashboard/applications/new" className="text-indigo-600 font-black mt-4 inline-block hover:underline">Start your first one &rarr;</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                  <th className="pb-4">Application ID</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Payment</th>
                  <th className="pb-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.ApplicationID} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-6 font-bold text-gray-900 tracking-tight">{app.ApplicationID}</td>
                    <td className="py-6 text-sm font-medium text-gray-600">{app.DSCType}</td>
                    <td className="py-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black ring-1 ring-inset ${
                        app.ApplicationStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' :
                        app.ApplicationStatus === 'Rejected' ? 'bg-red-50 text-red-600 ring-red-100' :
                        'bg-amber-50 text-amber-600 ring-amber-100'
                      }`}>
                        {app.ApplicationStatus}
                      </span>
                    </td>
                    <td className="py-6 text-sm font-bold text-gray-900">
                      {app.PaymentStatus === 'Paid' ? '₹' + app.Price : 'Unpaid'}
                    </td>
                    <td className="py-6 text-right text-xs font-bold text-gray-400">
                      {new Date(app.CreatedAt).toLocaleDateString()}
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
