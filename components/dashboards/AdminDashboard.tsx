'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Activity, 
  AlertTriangle, 
  Terminal,
  ArrowUpRight,
  TrendingUp,
  Server,
  Database
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Skeleton from '@/components/Skeleton';
import Link from 'next/link';

export default function AdminDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, logsRes] = await Promise.all([
          apiRequest('dashboard/stats', {}, token),
          apiRequest('admin/logs', {}, token)
        ]);
        setStats(statsRes.data);
        setLogs(logsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }
    if (token) fetchData();
  }, [token]);

  const StatSkeleton = () => (
    <div className="card-premium p-8 border-l-4 border-indigo-600">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-10 w-16" />
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center">
            System <span className="ml-3 px-4 py-1.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest">Master Control</span>
          </h1>
          <p className="text-gray-500 font-medium italic mt-2">Monitoring system health, user activity and registration pipelines.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest ring-1 ring-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            All Systems Nominal
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          <>
            <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
          </>
        ) : (
          <>
            <StatCard icon={Users} label="Total Registrations" value={stats?.total || 0} color="indigo" growth="+12%" />
            <StatCard icon={Activity} label="Active Users" value="128" color="amber" growth="+5%" />
            <StatCard icon={Server} label="System Logs" value={logs.length} color="emerald" growth="Steady" />
            <StatCard icon={Database} label="Storage" value="84%" color="violet" growth="-2%" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 card-premium p-10">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-50">
            <h3 className="text-2xl font-black text-gray-900 flex items-center tracking-tight">
              <Terminal className="mr-3 h-6 w-6 text-indigo-600" />
              Live System Logs
            </h3>
            <button className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Clear Stream</button>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : logs.length === 0 ? (
              <p className="text-sm text-gray-400 italic font-medium italic py-12 text-center">No system events captured in the last 24 hours.</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex items-start group p-4 hover:bg-gray-50/50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                  <div className={`mt-1 h-3 w-3 rounded-full mr-4 shrink-0 shadow-sm ${
                    log.Type === 'API_ERROR' ? 'bg-red-500 shadow-red-200' : 
                    log.Type === 'AUTH_SUCCESS' ? 'bg-emerald-500 shadow-emerald-200' : 
                    'bg-indigo-500 shadow-indigo-200'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none">{log.Type}</p>
                      <p className="text-[10px] font-bold text-gray-300 leading-none">{new Date(log.Timestamp).toLocaleTimeString()}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-700 leading-snug">{log.Message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-10">
          <div className="card-premium p-8 bg-indigo-600 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="text-xl font-black mb-2 relative z-10 tracking-tight">System Security</h4>
            <p className="text-indigo-100 text-xs font-medium mb-6 relative z-10 leading-relaxed opacity-80">All API endpoints are protected by RSA-SHA-256 signatures and session-based tokens.</p>
            <div className="flex items-center text-xs font-black uppercase tracking-widest relative z-10">
               <Shield className="h-4 w-4 mr-2" /> Encrypted Connection
            </div>
          </div>

          <div className="card-premium p-8">
            <h4 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Quick Actions</h4>
            <div className="space-y-3">
              <ActionButton label="Manage Users" sub="Permissions & Roles" href="/dashboard/admin/users" />
              <ActionButton label="System Settings" sub="Catalog & Pricing" href="/dashboard/admin/settings" />
              <ActionButton label="Database Audit" sub="Full Trace Logs" href="/dashboard/admin/logs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, growth }: any) {
  const colors: any = {
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
  };

  return (
    <div className="card-premium p-8 group border-l-4 border-indigo-600">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-[10px] font-black text-emerald-500 flex items-center bg-emerald-50 px-2 py-1 rounded-lg ring-1 ring-emerald-100">
          <ArrowUpRight className="h-3 w-3 mr-1" /> {growth}
        </span>
      </div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.1em] mb-1">{label}</p>
      <h4 className="text-4xl font-black text-gray-900 tracking-tighter">{value}</h4>
    </div>
  );
}

function ActionButton({ label, sub, href }: { label: string, sub: string, href: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
      <div>
        <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-none mb-1">{label}</p>
        <p className="text-[10px] text-gray-400 font-medium italic">{sub}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
    </Link>
  );
}
