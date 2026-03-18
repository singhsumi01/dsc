'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Shield, 
  Menu, 
  X,
  CreditCard,
  History,
  Activity,
  PlusCircle,
  Gem,
  Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  roles: string[];
}

const navigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Admin', 'Agent', 'Client'] },
  { name: 'My Applications', href: '/dashboard/applications', icon: FileText, roles: ['Agent', 'Client'] },
  { name: 'Global Inventory', href: '/dashboard/admin/applications', icon: Gem, roles: ['Super Admin', 'Admin'] },
  { name: 'New Request', href: '/dashboard/applications/new', icon: PlusCircle, roles: ['Agent', 'Client'] },
  { name: 'Identity Vault', href: '/dashboard/admin/users', icon: Users, roles: ['Super Admin', 'Admin'] },
  { name: 'System Config', href: '/dashboard/admin/settings', icon: Settings, roles: ['Super Admin', 'Admin'] },
  { name: 'Payment Trace', href: '/dashboard/admin/payments', icon: CreditCard, roles: ['Super Admin', 'Admin'] },
  { name: 'Billings', href: '/dashboard/payments', icon: History, roles: ['Agent', 'Client'] },
  { name: 'Kernel Logs', href: '/dashboard/admin/logs', icon: Activity, roles: ['Super Admin'] },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const filteredNav = navigation.filter(item => item.roles.includes(user.Role));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex hero-gradient">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-72 bg-white pt-5 pb-4 shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="flex items-center px-8 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 mr-3">
               <Shield className="h-6 w-6" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tighter">DSC <span className="text-indigo-600">Portal</span></span>
          </div>
          <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
            {filteredNav.map((item) => (
              <NavLink key={item.name} item={item} active={pathname === item.href} />
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-80 bg-white/70 backdrop-blur-2xl border-r border-gray-100 shadow-xl shadow-indigo-50/20 relative z-20">
          <div className="flex items-center h-24 px-10 border-b border-gray-50/50">
             <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 mr-4">
               <Shield className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">DSC <span className="text-indigo-600">SaaS</span></span>
          </div>
          
          <div className="flex-1 flex flex-col pt-10 pb-4 overflow-y-auto">
            <nav className="flex-1 px-8 space-y-3">
              {filteredNav.map((item) => (
                <NavLink key={item.name} item={item} active={pathname === item.href} />
              ))}
            </nav>
          </div>

          <div className="p-8 border-t border-gray-50/50">
            <div className="p-6 bg-white rounded-3xl border border-gray-50 shadow-sm relative overflow-hidden group mb-6">
              <div className="absolute top-0 right-0 p-3 opacity-[0.05] group-hover:scale-150 transition-transform duration-1000">
                 <Gem className="h-10 w-10 text-indigo-600" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Authenticated Identity</p>
              <p className="text-base font-black text-gray-900 truncate tracking-tight">{user.Name}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ring-indigo-100">
                 {user.Role}
              </span>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Terminate Session
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="h-24 bg-white/70 backdrop-blur-2xl border-b border-gray-50 flex items-center justify-between px-10">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-900 mr-6">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <Shield className="h-4 w-4 mr-2 text-indigo-600" /> Secure Protocol v4.0
            </div>
          </div>
          <div className="flex items-center space-x-6">
             <button className="p-3 text-gray-400 hover:text-indigo-600 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
             </button>
             <div className="h-10 w-10 bg-gray-100 rounded-2xl border-2 border-white shadow-sm overflow-hidden">
                <div className="w-full h-full flex items-center justify-center font-black text-xs text-gray-500">
                   {user.Name.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 lg:p-14 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavLink({ item, active }: { item: SidebarItem, active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex items-center px-5 py-4 text-xs font-black uppercase tracking-[0.15em] rounded-2xl transition-all duration-300 group ${
        active 
          ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 translate-x-1.5' 
          : 'text-gray-400 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-50'
      }`}
    >
      <item.icon className={`mr-4 h-5 w-5 transition-transform duration-500 ${active ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600 group-hover:scale-110'}`} />
      {item.name}
    </Link>
  );
}
