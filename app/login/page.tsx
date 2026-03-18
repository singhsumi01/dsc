'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Mail, Lock, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Toast from '@/components/Toast';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore(s => s.setAuth);
  const setSelection = useAuthStore(state => state.setSelection);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest('auth/login', { email, password });
      if (res.success) {
        const plan = searchParams.get('plan');
        const service = searchParams.get('service');
        if (plan || service) {
          setSelection(plan, service);
        }
        
        setAuth(res.user, res.token);
        setToast({ message: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        setToast({ message: res.error || 'Invalid credentials', type: 'error' });
      }
    } catch {
      setToast({ message: 'Connection error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Left panel (branding) ── */}
      <div className="hidden lg:flex lg:w-[44%] relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#0B1C3D] via-[#0F2860] to-[#1251DB]">
        <div className="absolute inset-0 mesh-grid" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl">DSC<span className="text-orange-400">Portal</span></span>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-blue-100 font-semibold tracking-wider uppercase">All systems operational</span>
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white mb-5 leading-snug">
            India&apos;s Fastest<br />
            DSC Issuance<br />
            <span className="text-orange-400">Platform.</span>
          </h2>
          <p className="text-blue-100/80 text-base leading-relaxed mb-10 max-w-sm">
            Apply for Class 3, DGFT, and Document Signer certificates in under 10 minutes via 100% paperless video eKYC.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[{ n: '2M+', l: 'DSCs Issued' }, { n: '15K+', l: 'Partners' }, { n: '<10 min', l: 'Issuance' }, { n: '99.9%', l: 'Uptime' }].map(({ n, l }) => (
              <div key={l} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 backdrop-blur-sm">
                <p className="font-display text-2xl font-extrabold text-white leading-none">{n}</p>
                <p className="text-xs text-blue-300 font-medium mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">DSC<span className="text-orange-500">Portal</span></span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500 text-sm">
              New here?{' '}
              <Link href="/signup" className="text-blue-600 font-semibold hover:underline">Create an account</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs text-blue-600 font-semibold hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white placeholder-gray-400"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {['CCA Licensed', 'FIPS 140-2 HSM', 'IT Act 2000'].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
