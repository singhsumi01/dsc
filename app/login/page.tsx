'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Toast from '@/components/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest('auth/login', { email, password });
      if (res.success) {
        setAuth(res.user, res.token);
        setToast({ message: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        setToast({ message: res.error || 'Invalid credentials', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Connection error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 hero-bg flex-col justify-between p-12 relative overflow-hidden">
        <div className="hero-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl">DSC<span className="text-orange-400">Portal</span></span>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="font-display text-4xl font-black text-white mb-4 leading-snug">
            India's Fastest<br />
            <span className="text-gradient">DSC Issuance</span><br />
            Platform.
          </h2>
          <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-md">
            Apply for Class 3, DGFT, and Document Signer certificates in under 10 minutes with 100% paperless video eKYC.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '2M+', label: 'DSCs Issued' },
              { num: '15K+', label: 'Partner Agents' },
              { num: '<10 min', label: 'Avg. Issuance' },
              { num: '99.9%', label: 'Uptime' },
            ].map(({ num, label }) => (
              <div key={label} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 backdrop-blur-sm">
                <p className="font-display text-xl font-black text-white">{num}</p>
                <p className="text-xs text-blue-200 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-lg bg-[--blue] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[--navy]">DSC<span className="text-[--orange]">Portal</span></span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-black text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-500 text-sm">
              New here?{' '}
              <Link href="/signup" className="text-[--blue] font-semibold hover:underline">
                Create a partner account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[--blue] transition-all bg-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs text-[--blue] font-semibold hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[--blue] transition-all bg-white placeholder-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center !py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              {['CCA Licensed', 'FIPS 140-2 HSM', 'IT Act 2000'].map(t => (
                <div key={t} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
