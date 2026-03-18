'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Shield, 
  MoreVertical,
  ArrowUpDown,
  Loader2,
  Mail,
  UserCheck
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const token = useAuthStore(state => state.token);

  const fetchUsers = async () => {
    try {
      const res = await apiRequest('admin/users', {}, token);
      setUsers(res.data || []);
    } catch (err) {
      setToast({ message: 'Failed to sync with user directory', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently revoke access for this user?')) return;
    setActionLoading(userId);
    try {
      const res = await apiRequest('admin/deleteUser', { targetUserId: userId }, token);
      if (res.success) {
        setToast({ message: 'User identity purged successfully', type: 'success' });
        setUsers(users.filter(u => u.UserID !== userId));
      } else {
        setToast({ message: res.error || 'Access revocation failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error during revocation', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const roles = ['Client', 'Agent', 'Admin', 'Super Admin'];
    const newRole = prompt(`Current role: ${currentRole}\nEnter new role (${roles.join(', ')}):`);
    if (!newRole || !roles.includes(newRole)) return;

    setActionLoading(userId);
    try {
      const res = await apiRequest('admin/updateRole', { targetUserId: userId, newRole }, token);
      if (res.success) {
        setToast({ message: `Role escalated to ${newRole}`, type: 'success' });
        fetchUsers();
      } else {
        setToast({ message: res.error || 'Role update rejected', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Failed to update user permissions', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3">
             User <span className="text-indigo-600">Directory</span>
          </h1>
          <p className="text-gray-500 font-medium italic">Manage system identities, roles and global access permissions.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Filter identities..." className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-50/50 outline-none w-64 shadow-sm" />
           </div>
           <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 text-gray-400" />
           </button>
        </div>
      </div>

      <div className="card-premium p-10 lg:p-12 overflow-hidden">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto -mx-10 lg:-mx-12 px-10 lg:px-12">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                  <th className="pb-6">Identity</th>
                  <th className="pb-6">Role / Access</th>
                  <th className="pb-6">Contact Record</th>
                  <th className="pb-6">Status</th>
                  <th className="pb-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((row) => (
                  <tr key={row.UserID} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-8">
                       <div className="flex items-center">
                          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-sm mr-4 shadow-sm">
                             {row.Name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-extrabold text-gray-900 tracking-tight leading-none mb-1">{row.Name}</p>
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{row.UserID}</p>
                          </div>
                       </div>
                    </td>
                    <td className="py-8">
                       <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ring-1 ring-inset ${
                         row.Role === 'Super Admin' ? 'bg-indigo-600 text-white ring-indigo-600' :
                         row.Role === 'Admin' ? 'bg-indigo-50 text-indigo-600 ring-indigo-200' :
                         row.Role === 'Agent' ? 'bg-amber-50 text-amber-600 ring-amber-200' :
                         'bg-gray-50 text-gray-600 ring-gray-200'
                       }`}>
                         <Shield className="h-3 w-3 mr-1.5" />
                         {row.Role}
                       </span>
                    </td>
                    <td className="py-8">
                       <div className="flex items-center text-sm font-bold text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-300" />
                          {row.Email}
                       </div>
                    </td>
                    <td className="py-8">
                       <div className="flex items-center text-xs font-black text-emerald-600 uppercase tracking-tight">
                          <UserCheck className="h-4 w-4 mr-1.5 opacity-60" /> Verified
                       </div>
                    </td>
                    <td className="py-8 text-right">
                       <div className="flex items-center justify-end space-x-2">
                          <button 
                             onClick={() => handleUpdateRole(row.UserID, row.Role)}
                             disabled={!!actionLoading}
                             className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm group-hover:shadow-md active:scale-95 disabled:opacity-50"
                          >
                             {actionLoading === row.UserID ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit className="h-4 w-4" />}
                          </button>
                          <button 
                             onClick={() => handleDelete(row.UserID)}
                             disabled={!!actionLoading}
                             className="p-3 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm group-hover:shadow-md active:scale-95 disabled:opacity-50"
                          >
                             {actionLoading === row.UserID ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
