'use client';

import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle2, TrendingUp, Search, ArrowRight, PlusCircle, FileText } from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

const STATUS_STYLES: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700 border-green-100',
  Approved: 'bg-green-50 text-green-700 border-green-100',
  Pending: 'bg-orange-50 text-orange-700 border-orange-100',
  'Under Review': 'bg-blue-50 text-blue-700 border-blue-100',
  Rejected: 'bg-red-50 text-red-600 border-red-100',
};

export default function AgentDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const token = useAuthStore(s => s.token);

  useEffect(() => {
    async function load() {
      try {
        const [sRes, aRes] = await Promise.all([
          apiRequest('dashboard/stats', {}, token),
          apiRequest('application/list', {}, token),
        ]);
        setStats(sRes.data);
        setApplications(aRes.data || []);
      } catch (e) { console.error(e); }
      finally { setTimeout(() => setLoading(false), 600); }
    }
    if (token) load();
  }, [token]);

  const filtered = applications.filter(a =>
    !filter || a.FullName?.toLowerCase().includes(filter.toLowerCase()) ||
    a.ApplicationID?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Agent Portal</p>
          <h1 className="font-display text-3xl font-black text-gray-900">
            Welcome back, <span className="text-[--blue]">{user.Name?.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage client applications and track certificate issuance.</p>
        </div>
        <Link href="/dashboard/applications/new" className="btn btn-accent shadow-lg shadow-orange-100 shrink-0">
          <PlusCircle className="w-4 h-4" />
          New DSC Application
        </Link>
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
            {[
              { icon: Users, label: 'Total Clients', value: stats?.total ?? 0, color: 'blue' },
              { icon: Clock, label: 'Verification Pending', value: stats?.pending ?? 0, color: 'orange' },
              { icon: CheckCircle2, label: 'DSCs Issued', value: stats?.completed ?? 0, color: 'green' },
              { icon: TrendingUp, label: 'Success Rate', value: '100%', color: 'purple' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-6 group hover:border-blue-100 hover:shadow-md transition-all">
                <div className={`w-9 h-9 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform ${
                  s.color === 'orange' ? 'bg-orange-50' :
                  s.color === 'green' ? 'bg-green-50' :
                  s.color === 'purple' ? 'bg-purple-50' : 'bg-[--blue-light]'
                }`}>
                  <s.icon className={`w-4 h-4 ${
                    s.color === 'orange' ? 'text-orange-500' :
                    s.color === 'green' ? 'text-green-500' :
                    s.color === 'purple' ? 'text-purple-500' : 'text-[--blue]'
                  }`} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
                <p className="font-display text-3xl font-black text-gray-900">{s.value}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-gray-900">Active Registrations</h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{filtered.length} total applications</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search client or ID..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[--blue] w-56"
              />
            </div>
            <Link href="/dashboard/applications" className="text-xs font-semibold text-[--blue] hover:underline whitespace-nowrap">
              View All →
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No applications found</p>
            <Link href="/dashboard/applications/new" className="text-sm text-[--blue] font-semibold mt-2 inline-block hover:underline">
              Create your first application →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Applicant', 'Certificate Type', 'Status', 'Updated', ''].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(app => (
                  <tr key={app.ApplicationID} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{app.FullName}</p>
                      <p className="text-[10px] font-mono text-gray-400 mt-0.5">{app.ApplicationID}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{app.DSCType || 'Class 3'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLES[app.ApplicationStatus] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                        {app.ApplicationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                      {new Date(app.UpdatedAt || app.CreatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-[--blue-light] text-gray-400 hover:text-[--blue] transition-colors">
                        <ArrowRight className="w-4 h-4" />
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
