'use client';

import {
  Users,
  Settings,
  Activity,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  Zap,
  DollarSign,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

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
        setLoading(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  const adminStats = [
    { label: 'Total Revenue', value: '₹142,500', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Agents', value: '42', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending Apps', value: stats?.pending || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const QuickAction = ({ icon: Icon, title, desc, href }: any) => (
    <Link href={href} className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all flex items-start space-x-4">
      <div className="bg-indigo-50 p-3 rounded-2xl">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <div>
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">{desc}</p>
      </div>
    </Link>
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            Super Admin <ShieldCheck className="ml-2 h-6 w-6 text-indigo-600" />
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">Global system control and monitoring center.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className={`${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{loading ? '...' : stat.value}</p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Management</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickAction icon={Users} title="User Manager" desc="Create or disable agents and admin accounts." href="/dashboard/admin/users" />
        <QuickAction icon={Zap} title="Manage Pricing" desc="Update tiers and DSC category plans." href="/dashboard/admin/settings" />
        <QuickAction icon={FileSearch} title="Webhook Queue" desc="Monitor and retry failed payment notifications." href="/dashboard/admin/webhooks" />
        <QuickAction icon={Activity} title="System Logs" desc="Debug performance and security events." href="/dashboard/admin/logs" />
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Recent System Events</h3>
            <p className="text-sm text-gray-500 font-medium">Real-time activity from all users.</p>
          </div>
          <Link href="/dashboard/admin/logs" className="text-indigo-600 text-sm font-bold flex items-center hover:underline">
            Full Audit Trail
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {loading ? (
             <div className="py-4 text-center text-gray-400 italic">Streaming logs...</div>
          ) : logs.length === 0 ? (
            <div className="py-4 text-center text-gray-400 italic">No system events logged.</div>
          ) : logs.slice(0, 5).map((log, i) => (
            <div key={log.LogID || i} className="flex items-center px-4 py-3 rounded-2xl bg-gray-50/50 border border-gray-100">
              <div className={`w-2 h-2 rounded-full mr-4 ${log.Type === 'API_ERROR' ? 'bg-red-500' : log.Type === 'INFO' ? 'bg-indigo-500' : 'bg-green-500'}`}></div>
              <p className="text-sm text-gray-700 flex-1 font-medium">{log.Message}</p>
              <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(log.CreatedAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
