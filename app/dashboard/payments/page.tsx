'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  ArrowUpRight, 
  FileText,
  ShieldCheck,
  History,
  Info
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

export default function BillingsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiRequest('application/list', {}, token);
        setPayments(res.data?.filter((a: any) => a.PaymentStatus === 'Paid') || []);
      } catch (err) {
        setToast({ message: 'Fiscal records sync failed', type: 'error' });
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }
    if (token) fetchData();
  }, [token]);

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3">
             Fiscal <span className="text-indigo-600">History</span>
          </h1>
          <p className="text-gray-500 font-medium italic text-lg opacity-80">Trace your registered transactions and secure billing history.</p>
        </div>
      </div>

      <div className="card-premium p-10 lg:p-14 bg-indigo-600 text-white border-none relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-150 transition-transform duration-1000">
            <History className="h-48 w-48" />
         </div>
         <div className="relative z-10 max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-4">Account Billing Summary</p>
            <h2 className="text-4xl font-black tracking-tighter mb-6 leading-tight">You have <span className="text-indigo-200">{payments.length}</span> settled transactions in your history vault.</h2>
            <div className="p-6 bg-black/10 rounded-3xl ring-1 ring-white/10 flex items-start space-x-4">
               <Info className="h-5 w-5 text-indigo-200 mt-1 shrink-0" />
               <p className="text-xs font-bold text-indigo-100 leading-relaxed uppercase tracking-tight">
                  Invoices are automatically generated and secured via RSA-SHA-256 signatures for every confirmed registration payment.
               </p>
            </div>
         </div>
      </div>

      <div className="card-premium p-10 lg:p-12 overflow-hidden">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-24">
             <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-400 font-bold italic text-lg uppercase tracking-widest leading-loose">No billing records found <br/> for your current environment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-10 lg:-mx-12 px-10 lg:px-12">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-6">
                  <th className="pb-6">Billing Record</th>
                  <th className="pb-6">Registration Service</th>
                  <th className="pb-6">Billing Type</th>
                  <th className="pb-6">Net Amount</th>
                  <th className="pb-6 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p.ApplicationID} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-8">
                       <p className="font-extrabold text-gray-900 tracking-tight leading-none mb-1">INV-TXN-{p.ApplicationID.slice(-6)}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{new Date(p.CreatedAt).toLocaleDateString()}</p>
                    </td>
                    <td className="py-8">
                       <div className="flex items-center text-sm font-bold text-gray-700">
                          <FileText className="h-4 w-4 mr-2 text-indigo-500 opacity-60" />
                          {p.DSCType}
                       </div>
                    </td>
                    <td className="py-8">
                       <span className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {p.PlanTier}
                       </span>
                    </td>
                    <td className="py-8 text-xl font-black text-gray-900 tracking-tighter">₹{p.Price}</td>
                    <td className="py-8 text-right">
                       <button className="px-5 py-3 bg-gray-50 text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest h-12 inline-flex items-center group-hover:bg-white hover:text-indigo-600 transition-all border border-transparent group-hover:border-gray-100">
                          View Invoice <ArrowUpRight className="ml-2 h-4 w-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
