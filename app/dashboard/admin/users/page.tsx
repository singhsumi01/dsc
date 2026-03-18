'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert,
  Loader2,
  Filter
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await apiRequest('admin/users', {}, token);
        setUsers(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchUsers();
  }, [token]);

  const filteredUsers = users.filter(u => 
    u.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiRequest('admin/deleteUser', { targetUserId: userId }, token);
      setUsers(users.filter(u => u.UserID !== userId));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const roles = ['Client', 'Agent', 'Admin', 'Super Admin'];
    const newRole = prompt(`Change role from ${currentRole} to:`, currentRole);
    if (!newRole || !roles.includes(newRole) || newRole === currentRole) return;
    
    try {
      await apiRequest('admin/updateRole', { targetUserId: userId, newRole }, token);
      setUsers(users.map(u => u.UserID === userId ? { ...u, Role: newRole } : u));
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage system users, roles and permissions.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <UserPlus className="mr-2 h-5 w-5" />
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-3 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-8 py-5">User</th>
                <th className="px-4 py-5">Role</th>
                <th className="px-4 py-5">Status</th>
                <th className="px-4 py-5">Last Login</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400 font-medium italic">No users found.</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.UserID} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-4">
                        {user.Name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-none mb-1">{user.Name}</p>
                        <p className="text-xs text-gray-500 font-medium">{user.Email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ring-1 ring-inset ${
                      user.Role === 'Super Admin' ? 'bg-indigo-50 text-indigo-600 ring-indigo-200' :
                      user.Role === 'Admin' ? 'bg-violet-50 text-violet-600 ring-violet-200' :
                      user.Role === 'Agent' ? 'bg-emerald-50 text-emerald-600 ring-emerald-200' :
                      'bg-gray-50 text-gray-600 ring-gray-200'
                    }`}>
                      {user.Role === 'Super Admin' && <ShieldCheck className="h-3 w-3 mr-1" />}
                      {user.Role}
                    </span>
                  </td>
                  <td className="px-4 py-6">
                    <span className="flex items-center text-sm font-bold text-gray-700">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-6 text-sm text-gray-500 font-medium">
                    {new Date(user.LastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleUpdateRole(user.UserID, user.Role)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.UserID)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
