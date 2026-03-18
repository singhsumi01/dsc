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
  Activity,
  PlusCircle,
  Bell,
  ChevronRight,
  BadgeCheck,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Admin', 'Agent', 'Client'] },
  { label: 'New Application', href: '/dashboard/applications/new', icon: PlusCircle, roles: ['Agent', 'Client'] },
  { label: 'My Applications', href: '/dashboard/applications', icon: FileText, roles: ['Agent', 'Client'] },
  { label: 'Payment History', href: '/dashboard/payments', icon: CreditCard, roles: ['Agent', 'Client'] },
  { label: 'All Applications', href: '/dashboard/admin/applications', icon: FileText, roles: ['Super Admin', 'Admin'] },
  { label: 'User Management', href: '/dashboard/admin/users', icon: Users, roles: ['Super Admin', 'Admin'] },
  { label: 'Finance Audit', href: '/dashboard/admin/payments', icon: CreditCard, roles: ['Super Admin', 'Admin'] },
  { label: 'Portal Settings', href: '/dashboard/admin/settings', icon: Settings, roles: ['Super Admin', 'Admin'] },
  { label: 'System Logs', href: '/dashboard/admin/logs', icon: Activity, roles: ['Super Admin'] },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  const filtered = navItems.filter(i => i.roles.includes(user.Role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[--blue] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-[--navy]">
            DSC<span className="text-[--orange]">Portal</span>
          </span>
        </Link>
        <div className="mt-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <BadgeCheck className="w-3 h-3 text-[--green]" />
          CCA Licensed CA
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-6 pb-4 overflow-y-auto space-y-0.5">
        {filtered.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-item ${active ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-40" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-3">
          <div className="w-9 h-9 rounded-full bg-[--blue] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user.Name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.Name}</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{user.Role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-72 h-full bg-white shadow-xl">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-4 px-6 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 hidden md:flex">
            <Shield className="w-4 h-4 text-[--blue]" />
            <span>Paperless DSC Infrastructure</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[--orange] rounded-full" />
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-gray-50 hover:bg-[--blue-light] rounded-xl px-3 py-1.5 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[--blue] flex items-center justify-center text-white text-[10px] font-bold">
                {user.Name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.Name}</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
