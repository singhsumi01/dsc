'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api-client';
import InputField from '@/components/InputField';
import Toast from '@/components/Toast';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('auth/signup', formData);
      if (res.success) {
        setToast({ message: 'Account created! Redirecting to login...', type: 'success' });
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setToast({ message: res.error || 'Signup failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Connection lost. Try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden hero-gradient">
      {/* Background Orbs */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[120px] animate-slow-spin"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-violet-200/20 rounded-full blur-[120px] animate-slow-spin" style={{ animationDirection: 'reverse' }}></div>

      <div className="w-full max-w-xl animate-fade-in-up relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-gray-100 mb-6 group hover:scale-110 transition-transform">
            <UserPlus className="h-10 w-10 text-indigo-600 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-2">Join DSC</h1>
          <p className="text-gray-500 font-medium italic text-lg">Your gateway to trusted digital signatures.</p>
        </div>

        <div className="card-premium p-10 lg:p-12 premium-glass">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Full Name" 
                type="text" 
                placeholder="Rahul K." 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                icon={User} 
                required 
              />
              <InputField 
                label="Email Address" 
                type="email" 
                placeholder="rahul@enterprise.com" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                icon={Mail} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Create Password" 
                type="password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                icon={Lock} 
                required 
              />
              <InputField 
                label="Confirm Secret" 
                type="password" 
                placeholder="••••••••" 
                value={formData.confirmPassword} 
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                icon={ShieldCheck} 
                required 
              />
            </div>
            
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start space-x-3">
              <Zap className="h-5 w-5 text-indigo-600 mt-1 shrink-0 animate-pulse" />
              <p className="text-xs font-bold text-indigo-900 leading-relaxed uppercase tracking-tight">
                Instantly gain access to Class 3, DGFT and Document Signer certificates upon registration.
              </p>
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
                  Create Account 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-gray-400">
              Already have an identity? {' '}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 underline decoration-indigo-200 decoration-2 underline-offset-4">Sign In securely</Link>
            </p>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
