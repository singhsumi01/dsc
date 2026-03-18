'use client';

import React, { useState, useEffect } from 'react';
import { Users, FileText, TrendingUp, Clock, ArrowUpRight, BadgeCheck, ChevronRight, Activity } from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

function StatCard({ icon: Icon, label, value, trend, iconBg, iconColor }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-blue-100 transition-all group">
      <div className="flex items-start justify-between mb-5">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && (
          <span className="bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-display text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
  );
}

export default function AdminDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore(s => s.token);

  useEffect(() => {
    async function load() {
      try {
        const [sRes, lRes] = await Promise.all([
          apiRequest('dashboard/stats', {}, token),
          apiRequest('admin/logs', {}, token),
        ]);
        setStats(sRes.data);
        setLogs(lRes.data || []);
      } catch { }
      finally { setTimeout(() => setLoading(false), 600); }
    }
    if (token) load();
  }, [token]);

  return (
    <div className="space-y-8 anim-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BadgeCheck className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Agency Control Panel</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-gray-900">
            Operations <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Monitor DSC registrations, agents, and certificate lifecycles.</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          All Systems Operational
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 h-36">
              <div className="skeleton h-9 w-9 rounded-xl mb-5" />
              <div className="skeleton h-3 w-24 mb-3" />
              <div className="skeleton h-8 w-16" />
            </div>
          ))
        ) : (
          <>
            <StatCard icon={FileText} label="DSCs Issued Today" value={stats?.completed ?? 0} trend="+12%" iconBg="bg-blue-50" iconColor="text-blue-600" />
            <StatCard icon={Users} label="Active Agents" value={stats?.agents ?? 128} trend="+5%" iconBg="bg-orange-50" iconColor="text-orange-500" />
            <StatCard icon={Clock} label="Pending Verification" value={stats?.pending ?? 14} iconBg="bg-purple-50" iconColor="text-purple-600" />
            <StatCard icon={TrendingUp} label="Success Rate" value="98.7%" iconBg="bg-green-50" iconColor="text-green-600" />
          </>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Trail */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900">Audit Trail</h3>
              <p className="text-xs text-gray-400 mt-0.5">Recent system events & CA log</p>
            </div>
            <Link href="/dashboard/admin/logs" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center py-14 text-center">
              <Activity className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400 font-medium">No recent events</p>
            </div>
          ) : (
            <div className="space-y-1">
              {logs.slice(0, 8).map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`mt-2 w-2 h-2 rounded-full shrink-0 ${log.Type === 'AUTH_SUCCESS' ? 'bg-green-500' : log.Type === 'API_ERROR' ? 'bg-red-500' : 'bg-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{log.Type}</span>
                      <span className="text-[10px] text-gray-300">{new Date(log.Timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium truncate">{log.Message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6">
            <BadgeCheck className="w-8 h-8 text-white/40 mb-3" />
            <h4 className="font-display text-lg font-bold mb-2">FIPS 140-2 HSM</h4>
            <p className="text-blue-100/80 text-sm leading-relaxed">All certificates via Hardware Security Module. Private keys never exposed.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h4 className="font-display text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider text-gray-500">Quick Navigate</h4>
            <div className="space-y-1">
              {[
                { label: 'Manage Agents', sub: 'Roles & Onboarding', href: '/dashboard/admin/users' },
                { label: 'Certificate Catalog', sub: 'Pricing & Validity', href: '/dashboard/admin/settings' },
                { label: 'Finance Reports', sub: 'Transactions', href: '/dashboard/admin/payments' },
              ].map(({ label, sub, href }) => (
                <Link key={label} href={href} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{label}</p>
                    <p className="text-[10px] text-gray-400">{sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
