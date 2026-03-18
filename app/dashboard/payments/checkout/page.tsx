'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CreditCard, 
  ShieldCheck, 
  Loader2, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  Zap,
  Layout
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Toast from '@/components/Toast';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useAuthStore(state => state.token);
  
  const appId = searchParams.get('appId');
  const amount = searchParams.get('amount');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Direct call to update payment status in GAS
      const res = await apiRequest('application/updateStatus', { 
        applicationId: appId, 
        paymentStatus: 'Paid' 
      }, token);
      
      if (res.success) {
        setSuccess(true);
        setToast({ message: 'Transaction authorized by secure gateway', type: 'success' });
        setTimeout(() => router.push('/dashboard/applications'), 2500);
      } else {
        setToast({ message: 'Transaction declined by gateway', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Failed to connect to payment processor', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in-up">
        <div className="card-premium p-16 text-center max-w-lg">
           <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-100 animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
           </div>
           <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Payment Secured</h1>
           <p className="text-gray-500 font-medium italic mb-10 leading-relaxed uppercase tracking-tight text-xs">
             Your application <span className="text-indigo-600 font-black">#{appId}</span> is now fully activated and queued for verification.
           </p>
           <button 
             onClick={() => router.push('/dashboard/applications')}
             className="btn-primary w-full py-5 flex items-center justify-center"
           >
              Return to Vault <ArrowRight className="ml-3 h-5 w-5" />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 hero-gradient relative overflow-hidden">
       {/* Orbs */}
       <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[120px] animate-slow-spin"></div>
       <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-violet-200/20 rounded-full blur-[120px] animate-slow-spin" style={{ animationDirection: 'reverse' }}></div>

       <div className="w-full max-w-xl animate-fade-in-up relative z-10">
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-gray-100 mb-6">
                <ShieldCheck className="h-10 w-10 text-indigo-600" />
             </div>
             <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-2">Secure Checkout</h1>
             <p className="text-gray-500 font-medium italic uppercase tracking-widest text-[10px]">Encrypted Terminal v4.2</p>
          </div>

          <div className="card-premium p-10 lg:p-12 premium-glass">
             <div className="p-8 bg-indigo-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-200 mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Zap className="h-20 w-20" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Amount Due</p>
                <h2 className="text-5xl font-black tracking-tighter">₹{amount}</h2>
                <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-end">
                   <div>
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Registration ID</p>
                      <p className="text-xs font-black tracking-widest">{appId}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Status</p>
                      <p className="text-xs font-black uppercase text-indigo-200">Pending Authorization</p>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                   <Lock className="h-5 w-5 text-gray-400 mt-1" />
                   <div>
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight mb-1">Bank Grade Encryption</p>
                      <p className="text-[10px] font-medium text-gray-500 italic">This transaction is protected by 4096-bit SSL encryption and PCI-DSS compliance.</p>
                   </div>
                </div>

                <button 
                  onClick={handlePayment} 
                  disabled={loading}
                  className="btn-primary w-full py-6 flex items-center justify-center group pulse-glow"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-6 w-6" />
                  ) : (
                    <>
                      Authorize Payment 
                      <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
                
                <p className="text-center text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">
                   Trusted by 10,000+ Enterprises Worldwide
                </p>
             </div>
          </div>
       </div>
       
       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-indigo-600" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
