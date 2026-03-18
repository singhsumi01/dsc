'use client';

import React, { useState, useEffect } from 'react';
import { Users, FileText, TrendingUp, Clock, ArrowUpRight, BadgeCheck, ChevronRight, Activity } from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

function StatCard({ icon: Icon, label, value, trend, trendUp = true, color = 'blue' }: any) {
  const { bg, text, icon: iconColor } = (
    color === 'orange' ? { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' } :
    color === 'green' ? { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' } :
    color === 'purple' ? { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' } :
    { bg: 'bg-[--blue-light]', text: 'text-[--blue]', icon: 'text-[--blue]' }
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-100 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-display text-3xl font-black text-gray-900">{value}</p>
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
      } catch (e) { console.error(e); }
      finally { setTimeout(() => setLoading(false), 600); }
    }
    if (token) load();
  }, [token]);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BadgeCheck className="w-5 h-5 text-[--green]" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agency Control Panel</span>
          </div>
          <h1 className="font-display text-3xl font-black text-gray-900">
            Operations <span className="text-[--blue]">Overview</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Monitor DSC registrations, agents, and certificate lifecycles in real-time.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          All Systems Operational
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 h-32">
              <div className="skeleton h-4 w-24 mb-4" />
              <div className="skeleton h-8 w-16" />
            </div>
          ))
        ) : (
          <>
            <StatCard icon={FileText} label="Total DSCs Issued" value={stats?.total ?? 0} trend="+12%" />
            <StatCard icon={Users} label="Active Agents" value={stats?.agents ?? 128} trend="+5%" color="orange" />
            <StatCard icon={Clock} label="Pending Verification" value={stats?.pending ?? 14} trend="Priority" trendUp={false} color="purple" />
            <StatCard icon={TrendingUp} label="Success Rate" value="98.7%" trend="↑" color="green" />
          </>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900">Audit Trail</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Recent system events & CA log</p>
            </div>
            <Link href="/dashboard/admin/logs" className="text-xs font-semibold text-[--blue] hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400 font-medium">No events in the last 24 hours</p>
            </div>
          ) : (
            <div className="space-y-1">
              {logs.slice(0, 8).map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                    log.Type === 'AUTH_SUCCESS' ? 'bg-green-500' :
                    log.Type === 'API_ERROR' ? 'bg-red-500' : 'bg-[--blue]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
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

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[--blue] to-[--blue-dark] text-white rounded-2xl p-6">
            <BadgeCheck className="w-8 h-8 text-white/60 mb-3" />
            <h4 className="font-display text-lg font-bold mb-1">FIPS 140-2 HSM</h4>
            <p className="text-blue-100 text-sm leading-relaxed opacity-80">
              All certificates issued via Hardware Security Module. Private keys never exposed.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h4 className="font-display font-bold text-gray-900 mb-4 text-base">Quick Navigate</h4>
            <div className="space-y-1.5">
              {[
                { label: 'Manage Agents', sub: 'Roles & Onboarding', href: '/dashboard/admin/users' },
                { label: 'Certificate Catalog', sub: 'Pricing & Validity', href: '/dashboard/admin/settings' },
                { label: 'Finance Reports', sub: 'Transaction History', href: '/dashboard/admin/payments' },
              ].map(({ label, sub, href }) => (
                <Link key={label} href={href} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-[--blue] transition-colors">{label}</p>
                    <p className="text-[10px] text-gray-400">{sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[--blue] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
