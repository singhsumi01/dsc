'use client';

import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

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
        setLoading(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  const statCards = [
    { name: 'Total Applications', value: stats?.total || 0, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Pending Review', value: stats?.pending || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Success Rate', value: '100%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Recent Payments', value: stats?.payments || 0, icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Hi, {user.Name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Welcome back to your DSC dashboard.</p>
        </div>
        <Link 
          href="/dashboard/applications/new" 
          className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Application
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-bold text-gray-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +12%
              </span>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.name}</p>
            <p className="text-3xl font-extrabold text-gray-900">{loading ? '...' : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Recent Applications</h3>
            <Link href="/dashboard/applications" className="text-indigo-600 text-sm font-bold flex items-center hover:underline">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-6">
            {loading ? (
              <div className="py-10 text-center text-gray-400 font-medium animate-pulse italic">Loading your records...</div>
            ) : applications.length === 0 ? (
              <div className="py-10 text-center text-gray-400 font-medium italic">No applications found.</div>
            ) : applications.slice(0, 5).map((app) => (
              <div key={app.ApplicationID} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{app.ApplicationID}</h4>
                    <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">{app.DSCType} • {app.PlanTier}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ring-1 ${
                    app.ApplicationStatus === 'New' ? 'bg-indigo-50 text-indigo-600 ring-indigo-100' :
                    app.ApplicationStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' :
                    'bg-amber-50 text-amber-600 ring-amber-100'
                  }`}>{app.ApplicationStatus}</span>
                  <span className="text-[10px] text-gray-400 mt-2 font-medium">Updated {new Date(app.UpdatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl shadow-indigo-100 relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Complete your <br />pending documents</h3>
              <p className="text-indigo-100 text-sm leading-relaxed mb-8 opacity-80">
                You have 2 applications waiting for document upload. Finish now to avoid processing delays.
              </p>
            </div>
            <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors">
              Continue Application
            </button>
          </div>
          {/* Abstract circles */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
}
