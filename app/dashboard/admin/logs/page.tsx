'use client';

import { useState, useEffect } from 'react';
import { 
  Terminal, 
  Activity, 
  Search, 
  Filter, 
  RefreshCcw,
  AlertCircle,
  Database,
  Cpu
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const token = useAuthStore(state => state.token);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('admin/logs', {}, token);
      setLogs(res.data || []);
    } catch (err) {
      setToast({ message: 'Failed to access system kernel logs', type: 'error' });
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    if (token) fetchLogs();
  }, [token]);

  const filteredLogs = logs.filter(log => 
    log.Message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.Type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3">
             Kernel <span className="text-indigo-600">Logs</span>
          </h1>
          <p className="text-gray-500 font-medium italic text-lg opacity-80">Real-time system diagnostics and event stream auditing.</p>
        </div>
        <div className="flex items-center space-x-3">
           <button onClick={fetchLogs} className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
              <RefreshCcw className={`h-5 w-5 text-gray-400 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
           </button>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search event stream..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-50/50 outline-none w-64 shadow-sm" 
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 card-premium p-10 bg-[#0f172a] text-emerald-400 font-mono shadow-2xl border-indigo-900">
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-800">
               <div className="flex items-center">
                  <Terminal className="h-5 w-5 mr-3" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">System Execution Stream</span>
               </div>
               <div className="flex items-center text-[10px] space-x-4">
                  <span className="flex items-center"><Database className="h-3 w-3 mr-1" /> 120GB/s</span>
                  <span className="flex items-center text-emerald-500"><Cpu className="h-3 w-3 mr-1" /> 18.4% Load</span>
               </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar-dark pr-4">
               {loading ? (
                  Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-4 bg-gray-800 w-full rounded-sm opacity-20" />)
               ) : filteredLogs.length === 0 ? (
                  <p className="text-gray-600 italic py-20 text-center">Buffer empty. No recent system signals.</p>
               ) : (
                  filteredLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start text-xs border-b border-gray-800/50 pb-3 last:border-0">
                       <span className="text-gray-600 mr-4 shrink-0">[{new Date(log.Timestamp).toLocaleTimeString()}]</span>
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase mr-4 shrink-0 ${
                         log.Type === 'API_ERROR' ? 'bg-red-500/20 text-red-500' :
                         log.Type === 'AUTH_SUCCESS' ? 'bg-emerald-500/20 text-emerald-500' :
                         'bg-indigo-500/20 text-indigo-400'
                       }`}>{log.Type}</span>
                       <p className="leading-relaxed text-gray-300 break-all">{log.Message}</p>
                    </div>
                  ))
               )}
            </div>
         </div>

         <div className="space-y-8">
            <div className="card-premium p-8 bg-indigo-600 text-white border-none shadow-indigo-100">
               <h4 className="text-xl font-black mb-4 tracking-tight">Diagnostics Module</h4>
               <p className="text-sm font-medium opacity-80 leading-relaxed italic mb-8">System health is checked every 300ms against the core Google Sheets infrastructure.</p>
               <div className="flex items-center text-[10px] font-black uppercase tracking-widest bg-black/10 p-4 rounded-2xl ring-1 ring-white/10">
                  <Activity className="h-4 w-4 mr-2" /> All Nodes Connected
               </div>
            </div>

            <div className="card-premium p-8">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Error Distribution</h4>
               <div className="space-y-6">
                  <ProgressItem label="Auth Layer" value={2} color="bg-emerald-500" />
                  <ProgressItem label="API Interface" value={84} color="bg-indigo-600" />
                  <ProgressItem label="Database I/O" value={14} color="bg-amber-500" />
               </div>
            </div>
         </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function ProgressItem({ label, value, color }: any) {
  return (
    <div>
       <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter mb-2">
          <span className="text-gray-500">{label}</span>
          <span className="text-gray-900">{value}%</span>
       </div>
       <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }}></div>
       </div>
    </div>
  );
}
