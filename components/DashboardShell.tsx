'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  LayoutDashboard, FileText, Users, Settings, LogOut, Shield,
  Menu, X, CreditCard, Activity, PlusCircle, Bell, ChevronRight, BadgeCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Admin', 'Agent', 'Client'] },
  { label: 'New Application', href: '/dashboard/applications/new', icon: PlusCircle, roles: ['Agent', 'Client'] },
  { label: 'My Applications', href: '/dashboard/applications', icon: FileText, roles: ['Agent', 'Client'] },
  { label: 'Payments', href: '/dashboard/payments', icon: CreditCard, roles: ['Agent', 'Client'] },
  { label: 'All Applications', href: '/dashboard/admin/applications', icon: FileText, roles: ['Super Admin', 'Admin'] },
  { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users, roles: ['Super Admin', 'Admin'] },
  { label: 'Finance', href: '/dashboard/admin/payments', icon: CreditCard, roles: ['Super Admin', 'Admin'] },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings, roles: ['Super Admin', 'Admin'] },
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
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">
            DSC<span className="text-orange-500">Portal</span>
          </span>
        </Link>
        <div className="mt-2.5 flex items-center gap-1.5">
          <BadgeCheck className="w-3 h-3 text-green-500" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CCA Licensed CA</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-5 pb-4 space-y-0.5 overflow-y-auto">
        {filtered.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`nav-item ${active ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-sm">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-30" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer user info */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.Name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.Name}</p>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">{user.Role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-60 border-r border-gray-100 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 h-full shadow-2xl">
            <button className="absolute top-3 right-3 p-1.5 z-50 text-gray-400 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col lg:pl-60">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-4 px-5 sm:px-6 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-medium">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Paperless DSC Infrastructure
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                {user.Name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.Name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
