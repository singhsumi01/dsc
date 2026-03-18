'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Users,
  Settings2
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const token = useAuthStore(state => state.token);

  const fetchApps = async () => {
    try {
      const res = await apiRequest('application/list', {}, token);
      setApplications(res.data || []);
    } catch (err) {
      setToast({ message: 'Global sync failed', type: 'error' });
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    if (token) fetchApps();
  }, [token]);

  const handleUpdateStatus = async (appId: string, currentStatus: string) => {
    const statuses = ['New', 'Pending', 'In Progress', 'Completed', 'Rejected'];
    const newStatus = prompt(`Current: ${currentStatus}\nNew Status (${statuses.join(', ')}):`);
    if (!newStatus || !statuses.includes(newStatus)) return;

    setActionLoading(appId);
    try {
      const res = await apiRequest('application/updateStatus', { applicationId: appId, status: newStatus }, token);
      if (res.success) {
        setToast({ message: `Status escalated to ${newStatus}`, type: 'success' });
        fetchApps();
      }
    } catch (err) {
      setToast({ message: 'Update failed', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredApps = applications.filter(app => 
    app.ApplicationID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.CreatedByUserID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3">
             Global <span className="text-indigo-600">Inventory</span>
          </h1>
          <p className="text-gray-500 font-medium italic text-lg opacity-80">Full administrative visibility into all system registrations.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Audit identity or App ID..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-50/50 outline-none w-64 shadow-sm" 
              />
           </div>
        </div>
      </div>

      <div className="card-premium p-10 lg:p-12 overflow-hidden">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto -mx-10 lg:-mx-12 px-10 lg:px-12">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-6">
                  <th className="pb-6">Application / Owner</th>
                  <th className="pb-6">Service Spec</th>
                  <th className="pb-6">Current Flow</th>
                  <th className="pb-6">Payment Ledger</th>
                  <th className="pb-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredApps.map((app, idx) => (
                  <tr 
                    key={app.ApplicationID} 
                    className="group hover:bg-gray-50/50 transition-colors stagger-item"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <td className="py-8">
                       <p className="font-extrabold text-gray-900 tracking-tight leading-none mb-1">{app.ApplicationID}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{app.FullName}</p>
                    </td>
                    <td className="py-8">
                       <p className="text-sm font-bold text-gray-700 leading-none mb-1">{app.DSCType}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{app.PlanTier}</p>
                    </td>
                    <td className="py-8">
                       <StatusBadge status={app.ApplicationStatus} />
                    </td>
                    <td className="py-8">
                       <div className="flex items-center">
                          <p className={`text-sm font-black tracking-tight mr-2 ${app.PaymentStatus === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                             {app.PaymentStatus}
                          </p>
                          <span className="text-[10px] font-bold text-gray-400">₹{app.Price}</span>
                       </div>
                    </td>
                    <td className="py-8 text-right">
                       <button 
                          onClick={() => handleUpdateStatus(app.ApplicationID, app.ApplicationStatus)}
                          disabled={actionLoading === app.ApplicationID}
                          className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-95"
                       >
                          <Settings2 className={`h-4 w-4 ${actionLoading === app.ApplicationID ? 'animate-spin' : ''}`} />
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
