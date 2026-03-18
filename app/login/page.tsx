'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Loader2, 
  ShieldCheck, 
  ShieldQuestion,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import InputField from '@/components/InputField';
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
        setToast({ message: 'Welcome back! Redirecting...', type: 'success' });
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        setToast({ message: res.error || 'Invalid credentials', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Failed to connect to security server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden hero-gradient">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[120px] animate-slow-spin"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-200/20 rounded-full blur-[120px] animate-slow-spin" style={{ animationDirection: 'reverse' }}></div>

      <div className="w-full max-w-lg animate-fade-in-up relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-gray-100 mb-6 group hover:scale-110 transition-transform">
            <LogIn className="h-10 w-10 text-indigo-600 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-2">Paperless <span className="text-indigo-600">DSC</span></h1>
          <p className="text-gray-500 font-medium italic">CCA Licensed Digital Signature Infrastructure.</p>
        </div>

        <div className="card-premium p-10 lg:p-12 premium-glass">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
              label="Email Address" 
              type="email" 
              placeholder="name@company.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              icon={Mail} 
              required 
            />
            <InputField 
              label="Secret Password" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              icon={Lock} 
              required 
            />
            
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
              <label className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors">
                <input type="checkbox" className="mr-2 rounded border-gray-200 text-indigo-600 focus:ring-indigo-500/20" />
                Stay Secured
              </label>
              <Link href="/forgot" className="hover:text-indigo-600 transition-colors">Restore Access</Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center py-5 group"
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <>
                  Connect Securely 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-center space-x-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" /> AES-256
             </div>
             <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                <ShieldQuestion className="h-4 w-4 mr-2 text-violet-500" /> SSL-Cert
             </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-bold text-gray-400">
          New to specialized DSC? {' '}
          <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 underline decoration-indigo-200 decoration-2 underline-offset-4">Create Enterprise Account</Link>
        </p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
