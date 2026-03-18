'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  ArrowUpRight, 
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiRequest('application/list', {}, token);
        // Filter those with payment status
        setPayments(res.data?.filter((a: any) => a.PaymentStatus === 'Paid') || []);
      } catch (err) {
        setToast({ message: 'Financial ledger sync failed', type: 'error' });
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
             Payment <span className="text-indigo-600">Trace</span>
          </h1>
          <p className="text-gray-500 font-medium italic text-lg opacity-80">Full administrative ledger of all global transactions and revenue.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Find transaction..." 
                className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-50/50 outline-none w-64 shadow-sm" 
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <MetricCard label="Total Revenue" value="₹12.4K" growth="+18%" color="indigo" icon={DollarSign} />
         <MetricCard label="Processed" value={payments.length} growth="+4" color="emerald" icon={ShieldCheck} />
         <MetricCard label="Pending" value="₹4.9K" growth="-2%" color="amber" icon={CreditCard} />
      </div>

      <div className="card-premium p-10 lg:p-12 overflow-hidden">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
             <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-400 font-bold italic text-lg uppercase tracking-widest leading-loose">No confirmed transactions <br/> recorded in the current billing cycle.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-10 lg:-mx-12 px-10 lg:px-12">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-6">
                  <th className="pb-6">Reference ID</th>
                  <th className="pb-6">Payer Identity</th>
                  <th className="pb-6">Category</th>
                  <th className="pb-6">Amount</th>
                  <th className="pb-6 text-right">Gateway Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p.ApplicationID} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-8">
                       <p className="font-extrabold text-gray-900 tracking-tight leading-none mb-1">TXN-{p.ApplicationID.slice(-6)}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">APP-REG: {p.ApplicationID}</p>
                    </td>
                    <td className="py-8">
                       <p className="text-sm font-bold text-gray-700 leading-none mb-1">{p.FullName}</p>
                       <p className="text-[10px] font-bold text-gray-400">{p.Email}</p>
                    </td>
                    <td className="py-8">
                       <span className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {p.DSCType}
                       </span>
                    </td>
                    <td className="py-8 text-xl font-black text-gray-900 tracking-tighter">₹{p.Price}</td>
                    <td className="py-8 text-right">
                       <div className="flex items-center justify-end space-x-3">
                          <span className="flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase ring-1 ring-emerald-100">
                             <ShieldCheck className="h-3 w-3 mr-1.5" /> Settled
                          </span>
                       </div>
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

function MetricCard({ label, value, growth, color, icon: Icon }: any) {
   const colors: any = {
      indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
      emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
      amber: 'bg-amber-50 text-amber-600 ring-amber-100',
   };

   return (
      <div className="card-premium p-8 group">
         <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${colors[color]}`}>
               <Icon className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black text-emerald-500 flex items-center bg-emerald-50 px-2 py-1 rounded-lg ring-1 ring-emerald-100">
               <TrendingUp className="h-3 w-3 mr-1" /> {growth}
            </span>
         </div>
         <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
         <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{value}</h3>
      </div>
   );
}
