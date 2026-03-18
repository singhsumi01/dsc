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
  PlusCircle
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
  { name: 'All Applications', href: '/dashboard/admin/applications', icon: FileText, roles: ['Super Admin', 'Admin'] },
  { name: 'Apply Now', href: '/dashboard/applications/new', icon: PlusCircle, roles: ['Agent', 'Client'] },
  { name: 'User Management', href: '/dashboard/admin/users', icon: Users, roles: ['Super Admin', 'Admin'] },
  { name: 'Pricing & Categories', href: '/dashboard/admin/settings', icon: Settings, roles: ['Super Admin', 'Admin'] },
  { name: 'Payment Logs', href: '/dashboard/admin/payments', icon: CreditCard, roles: ['Super Admin', 'Admin'] },
  { name: 'Payment History', href: '/dashboard/payments', icon: History, roles: ['Agent', 'Client'] },
  { name: 'System Logs', href: '/dashboard/admin/logs', icon: Activity, roles: ['Super Admin'] },
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 pt-5 pb-4">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <Shield className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">DSC SaaS</span>
          </div>
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {filteredNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  pathname === item.href 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72 bg-white border-r border-gray-100 shadow-sm">
          <div className="flex items-center h-20 px-8 border-b border-gray-50">
            <Shield className="h-8 w-8 text-indigo-600 mr-2.5" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
              DSC Portal
            </span>
          </div>
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            <nav className="flex-1 px-6 space-y-2">
              {filteredNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all ${
                    pathname === item.href 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${pathname === item.href ? 'text-white' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-6 border-t border-gray-50">
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-sm font-bold text-gray-900 truncate">{user.Name}</p>
              <p className="text-xs text-indigo-600 font-medium">{user.Role}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 lg:hidden flex items-center px-6">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-600">
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-4 font-bold text-gray-900">Dashboard</span>
        </header>
        <main className="flex-1 overflow-y-auto focus:outline-none p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
