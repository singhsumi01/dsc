'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Calendar,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiRequest('application/list', {}, token);
        setApplications(res.data || []);
      } catch (err) {
        setToast({ message: 'Sync failed. Please check connection.', type: 'error' });
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }
    if (token) fetchData();
  }, [token]);

  const filteredApps = applications.filter(app => 
    app.ApplicationID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.DSCType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3">
             Application <span className="text-indigo-600">Vault</span>
          </h1>
          <p className="text-gray-500 font-medium italic text-lg opacity-80">Track the lifecycle of your digital signature registrations.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Find application..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-50/50 outline-none w-64 shadow-sm" 
              />
           </div>
           <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 text-gray-400" />
           </button>
        </div>
      </div>

      <div className="card-premium p-10 lg:p-12 overflow-hidden">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
             <Layers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-400 font-bold italic text-lg uppercase tracking-widest leading-loose">No registration records <br/> match your search criteria.</p>
             <Link href="/dashboard/applications/new" className="text-indigo-600 font-black mt-6 inline-block hover:underline">Register New DSC &rarr;</Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-10 lg:-mx-12 px-10 lg:px-12">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-6">
                  <th className="pb-6">Application</th>
                  <th className="pb-6">Category</th>
                  <th className="pb-6">Service Level</th>
                  <th className="pb-6">Current Status</th>
                  <th className="pb-6 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredApps.map((app) => (
                  <tr key={app.ApplicationID} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-8">
                       <p className="font-extrabold text-gray-900 tracking-tight leading-none mb-1">{app.ApplicationID}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{app.FullName}</p>
                    </td>
                    <td className="py-8">
                       <div className="flex items-center text-sm font-bold text-gray-700">
                          <FileText className="h-4 w-4 mr-2 text-indigo-500 opacity-60" />
                          {app.DSCType}
                       </div>
                    </td>
                    <td className="py-8">
                       <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ring-indigo-100">
                          {app.PlanTier}
                       </span>
                    </td>
                    <td className="py-8">
                       <StatusBadge status={app.ApplicationStatus} />
                    </td>
                    <td className="py-8 text-right">
                       <div className="flex items-center justify-end space-x-6">
                          <div className="text-right">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                             <p className={`text-xs font-black uppercase tracking-tight ${app.PaymentStatus === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {app.PaymentStatus}
                             </p>
                          </div>
                          <button className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-95">
                             <ArrowRight className="h-4 w-4" />
                          </button>
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

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    'Completed': 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    'Rejected': 'bg-red-50 text-red-600 ring-red-100',
    'Active': 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    'New': 'bg-violet-50 text-violet-600 ring-violet-100',
    'Pending': 'bg-amber-50 text-amber-600 ring-amber-100'
  };

  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ring-1 ring-inset ${styles[status] || styles['Pending']}`}>
       <Clock className="h-3 w-3 mr-1.5" />
       {status}
    </span>
  );
}
