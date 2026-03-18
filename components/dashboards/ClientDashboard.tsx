'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, TrendingUp, Plus, ArrowRight, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

const STATUS: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700 border border-green-100',
  Approved:  'bg-green-50 text-green-700 border border-green-100',
  Pending:   'bg-orange-50 text-orange-700 border border-orange-100',
  'Under Review': 'bg-blue-50 text-blue-700 border border-blue-100',
  Rejected:  'bg-red-50 text-red-600 border border-red-100',
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
      } catch { }
      finally { setTimeout(() => setLoading(false), 600); }
    }
    if (token) load();
  }, [token]);

  return (
    <div className="space-y-8 anim-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Certificate Portal</p>
          <h1 className="font-display text-3xl font-extrabold text-gray-900">
            Hello, <span className="text-blue-600">{user.Name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Track your Digital Signature Certificate status in real-time.</p>
        </div>
        <Link
          href="/dashboard/applications/new"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Apply for New DSC
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Total Requests', key: 'total', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
          { icon: Clock,    label: 'Under Review',   key: 'pending', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
          { icon: CheckCircle2, label: 'Issued DSCs', key: 'completed', iconBg: 'bg-green-50', iconColor: 'text-green-600' },
          { icon: TrendingUp, label: 'Total Paid',   key: 'payments', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', prefix: '₹' },
        ].map(({ icon: Icon, label, key, iconBg, iconColor, prefix }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-6 group hover:shadow-md hover:border-blue-100 transition-all">
            {loading ? (
              <><div className="skeleton h-9 w-9 rounded-xl mb-5" /><div className="skeleton h-3 w-24 mb-3" /><div className="skeleton h-8 w-16" /></>
            ) : (
              <>
                <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="font-display text-3xl font-extrabold text-gray-900">{prefix ?? ''}{stats?.[key] ?? 0}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications table */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900">My Applications</h3>
              <p className="text-xs text-gray-400 mt-0.5">{applications.length} total</p>
            </div>
            <Link href="/dashboard/applications" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Track All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-14 w-full" />)}</div>
          ) : applications.length === 0 ? (
            <div className="py-20 text-center">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium text-sm mb-2">No applications yet</p>
              <Link href="/dashboard/applications/new" className="text-sm text-blue-600 font-semibold hover:underline">
                Start your first DSC →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['App ID', 'Type', 'Status', 'Paid', 'Date'].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.slice(0, 6).map(app => (
                    <tr key={app.ApplicationID} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">{app.ApplicationID}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{app.DSCType || 'Class 3'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS[app.ApplicationStatus] || 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                          {app.ApplicationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-sm">
                        {app.PaymentStatus === 'Paid'
                          ? <span className="text-green-600">₹{app.Price}</span>
                          : <span className="text-red-500 text-[10px] font-bold uppercase">Unpaid</span>}
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

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6">
            <Shield className="w-8 h-8 text-white/40 mb-3" />
            <h4 className="font-display text-lg font-bold mb-2">Your DSC is Secure</h4>
            <p className="text-blue-100/80 text-sm leading-relaxed">Issued via FIPS 140-2 Hardware Security Modules. Your private key is always protected.</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h4>
            <div className="space-y-1.5">
              {[
                { label: 'Apply for New DSC', icon: Plus, href: '/dashboard/applications/new', primary: true },
                { label: 'View All Applications', icon: FileText, href: '/dashboard/applications' },
                { label: 'Payment History', icon: TrendingUp, href: '/dashboard/payments' },
              ].map(({ label, icon: Icon, href, primary }) => (
                <Link
                  key={label} href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    primary
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <h4 className="font-bold text-orange-800 text-sm flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" />
              10-Minute Process
            </h4>
            <ol className="space-y-2">
              {['Fill application details', 'Complete Video eKYC', 'Pay online securely', 'Receive DSC instantly'].map((s, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs text-orange-700 font-medium">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
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
