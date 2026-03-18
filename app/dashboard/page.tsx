'use client';

import { useAuthStore } from '@/lib/store';
import ClientDashboard from '@/components/dashboards/ClientDashboard';
import AgentDashboard from '@/components/dashboards/AgentDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Render dashboard based on role
  switch (user.Role) {
    case 'Super Admin':
    case 'Admin':
      return <AdminDashboard user={user} />;
    case 'Agent':
      return <AgentDashboard user={user} />;
    case 'Client':
      return <ClientDashboard user={user} />;
    default:
      return <div>Unified Dashboard for {user.Role}</div>;
  }
}
