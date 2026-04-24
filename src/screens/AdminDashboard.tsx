import React, { useState } from 'react';
import { Shield, LayoutGrid, BarChart3, Laptop, ShieldCheck, Users, ClipboardList, Settings, LogOut, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminDevices from '@/components/admin/AdminDevices';
import AdminPolicy from '@/components/admin/AdminPolicy';
import AdminApplications from '@/components/admin/AdminApplications';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminAuditLog from '@/components/admin/AdminAuditLog';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminChat from '@/components/admin/AdminChat';
import { MessageSquare } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'chat', label: 'Secure Chat', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'devices', label: 'Devices', icon: Laptop },
  { id: 'applications', label: 'Applications', icon: Globe },
  { id: 'policy', label: 'Policy', icon: ShieldCheck },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'audit', label: 'Audit Log', icon: ClipboardList },
] as const;

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('overview');

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <AdminOverview />;
      case 'chat': return <AdminChat />;
      case 'analytics': return <AdminAnalytics />;
      case 'devices': return <AdminDevices />;
      case 'applications': return <AdminApplications />;
      case 'policy': return <AdminPolicy />;
      case 'users': return <AdminUsers />;
      case 'audit': return <AdminAuditLog />;
      case 'settings': return <AdminSettings />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-[220px] flex flex-col border-r border-border bg-card shrink-0">
        <div className="p-4 border-b border-border flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">Foretyx</span>
          </div>
          <p className="text-[11px] text-muted-foreground text-center">{user?.org_name}</p>
          <p className="text-[11px] text-primary text-center font-medium">Admin Portal</p>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${activeView === item.id
                  ? 'bg-primary/10 text-primary border-l-2 border-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          <div className="my-3 border-t border-border" />
          <button
            onClick={() => setActiveView('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${activeView === 'settings' ? 'bg-primary/10 text-primary border-l-2 border-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              {user?.display_name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{user?.display_name}</p>
              <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] font-medium rounded capitalize">{user?.role}</span>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderView()}
      </div>
    </div>
  );
}
