'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, TrendingUp, Plus, ArrowRight, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

const STATUS_STYLES: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700 border-green-100',
  Approved: 'bg-green-50 text-green-700 border-green-100',
  Pending: 'bg-orange-50 text-orange-700 border-orange-100',
  'Under Review': 'bg-blue-50 text-blue-700 border-blue-100',
  Rejected: 'bg-red-50 text-red-600 border-red-100',
};

export default function ClientDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Certificate Portal</p>
          <h1 className="font-display text-3xl font-black text-gray-900">
            Hello, <span className="text-[--blue]">{user.Name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track your Digital Signature Certificate status in real-time.</p>
        </div>
        <Link href="/dashboard/applications/new" className="btn btn-accent shadow-lg shadow-orange-100 shrink-0">
          <Plus className="w-4 h-4" />
          Apply for New DSC
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Total Requests', value: stats?.total ?? 0, color: 'blue' },
          { icon: Clock, label: 'Under Review', value: stats?.pending ?? 0, color: 'orange' },
          { icon: CheckCircle2, label: 'Issued DSCs', value: stats?.completed ?? 0, color: 'green' },
          { icon: TrendingUp, label: 'Total Paid', value: `₹${stats?.payments ?? 0}`, color: 'purple' },
        ].map(s => (
          <div key={s.label} className={`bg-white border rounded-2xl p-6 group hover:shadow-md transition-all ${loading ? '' : 'hover:border-blue-100'}`}>
            {loading ? (
              <>
                <div className="skeleton h-9 w-9 rounded-xl mb-4" />
                <div className="skeleton h-3 w-24 mb-3" />
                <div className="skeleton h-8 w-16" />
              </>
            ) : (
              <>
                <div className={`w-9 h-9 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform ${
                  s.color === 'orange' ? 'bg-orange-50' : s.color === 'green' ? 'bg-green-50' : s.color === 'purple' ? 'bg-purple-50' : 'bg-[--blue-light]'
                }`}>
                  <s.icon className={`w-4.5 h-4.5 w-[18px] h-[18px] ${
                    s.color === 'orange' ? 'text-orange-500' : s.color === 'green' ? 'text-green-500' : s.color === 'purple' ? 'text-purple-500' : 'text-[--blue]'
                  }`} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
                <p className="font-display text-3xl font-black text-gray-900">{s.value}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900">My Applications</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{applications.length} applications total</p>
            </div>
            <Link href="/dashboard/applications" className="text-xs font-semibold text-[--blue] hover:underline flex items-center gap-1">
              Track All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-14 w-full" />)}
            </div>
          ) : applications.length === 0 ? (
            <div className="py-20 text-center">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium mb-2">No applications yet</p>
              <Link href="/dashboard/applications/new" className="text-sm text-[--blue] font-semibold hover:underline">
                Start your first DSC application →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['Application ID', 'Type', 'Status', 'Paid', 'Date'].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.slice(0, 6).map(app => (
                    <tr key={app.ApplicationID} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-600">{app.ApplicationID}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{app.DSCType || 'Class 3'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLES[app.ApplicationStatus] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                          {app.ApplicationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {app.PaymentStatus === 'Paid'
                          ? <span className="text-green-600">₹{app.Price}</span>
                          : <span className="text-red-500 font-bold text-[10px] uppercase">Unpaid</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(app.CreatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar panels */}
        <div className="space-y-5">
          {/* Info card */}
          <div className="bg-gradient-to-br from-[--blue] to-[--blue-dark] text-white rounded-2xl p-6">
            <Shield className="w-8 h-8 text-white/50 mb-3" />
            <h4 className="font-display text-lg font-bold mb-1.5">Your DSC is Secure</h4>
            <p className="text-blue-100 text-sm leading-relaxed opacity-90">
              All certificates are issued via FIPS 140-2 Hardware Security Modules. Your key is always protected.
            </p>
          </div>

          {/* Quick actions */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h4 className="font-display font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider text-gray-500">Quick Actions</h4>
            <div className="space-y-2">
              {[
                { label: 'Apply for New DSC', icon: Plus, href: '/dashboard/applications/new', primary: true },
                { label: 'View All Applications', icon: FileText, href: '/dashboard/applications' },
                { label: 'Payment History', icon: TrendingUp, href: '/dashboard/payments' },
              ].map(({ label, icon: Icon, href, primary }) => (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    primary
                      ? 'bg-[--blue] text-white hover:bg-[--blue-dark]'
                      : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <h4 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-[--orange]" />
              10-Minute Process
            </h4>
            <ol className="space-y-2 text-xs text-gray-500 font-medium">
              {['Fill application details', 'Complete Video eKYC', 'Pay the fee online', 'Receive DSC instantly'].map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[--blue-light] text-[--blue] text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
