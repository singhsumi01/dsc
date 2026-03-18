'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  ArrowRight,
  Zap,
  Lock,
  Globe
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const appId = searchParams.get('appId');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = useAuthStore(state => state.token);

  const handlePayment = async (gateway: 'Razorpay' | 'PayU') => {
    setLoading(true);
    // Simulate payment gateway initialization
    setTimeout(async () => {
      try {
        // In real integration, we'd trigger the Rpay SDK here.
        // For now, we simulate a successful payment trigger to our GAS webhook.
        alert(`Redirecting to ${gateway} secure terminal...`);
        
        // Mock successful payment redirect back to dashboard
        router.push(`/dashboard/applications?status=paid&id=${appId}`);
      } catch (err) {
        alert('Payment failed');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-full mb-6">
          <CreditCard className="h-10 w-10 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Complete Payment</h1>
        <p className="text-gray-500 mt-2 font-medium">Secure payment for Application ID: <span className="text-indigo-600 font-bold">{appId}</span></p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-indigo-50 overflow-hidden">
        <div className="p-10">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-50">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Amount</p>
              <p className="text-4xl font-extrabold text-gray-900">₹4,999</p>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-bold ring-1 ring-green-100">
                Tax Included
              </span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Select Gateway</h3>
          <div className="space-y-4">
            <button 
              onClick={() => handlePayment('Razorpay')}
              disabled={loading}
              className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-gray-50 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-indigo-600 fill-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-lg">Razorpay</p>
                  <p className="text-xs text-gray-500 font-medium italic">Cards, UPI, Netbanking</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-600 transition-colors" />
            </button>

            <button 
              onClick={() => handlePayment('PayU')}
              disabled={loading}
              className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-gray-50 hover:border-violet-600 hover:bg-violet-50/30 transition-all group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-6 w-6 text-violet-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-lg">PayU Biz</p>
                  <p className="text-xs text-gray-500 font-medium italic">Enterprise Payment Terminal</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-violet-600 transition-colors" />
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center space-x-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-1.5 text-green-500" />
              SSL Encrypted
            </div>
            <div className="flex items-center">
              <ShieldCheck className="h-4 w-4 mr-1.5 text-indigo-500" />
              PCI-DSS Secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
