import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, X, Globe, Lock, ShieldAlert, ExternalLink, Activity, Users, Shield } from 'lucide-react';
import { APPLICATIONS } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminApplications() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [showAddApp, setShowAddApp] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');
  const [newAppCategory, setNewAppCategory] = useState('Engineering');

  const filtered = APPLICATIONS.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.url.toLowerCase().includes(search.toLowerCase()) ||
    app.category.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'protected') {
      return (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1 capitalize">
          <Lock className="w-3 h-3" /> {status}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1 capitalize">
        <ShieldAlert className="w-3 h-3" /> {status}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return <span className="text-primary font-medium">Low</span>;
      case 'medium': return <span className="text-warning font-medium">Medium</span>;
      case 'high': return <span className="text-destructive font-medium">High</span>;
      default: return <span className="text-muted-foreground">Unknown</span>;
    }
  };

  const handleAddApp = () => {
    if (!newAppName || !newAppUrl) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Application Added', description: `${newAppName} has been registered and is now being monitored.` });
    setShowAddApp(false);
    setNewAppName('');
    setNewAppUrl('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Applications</h1>
          <Button onClick={() => setShowAddApp(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Application
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Manage and secure internal applications integrated with Foretyx Guard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 border border-border/50">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Total Apps</p>
            <p className="text-xl font-bold text-foreground">{APPLICATIONS.length}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 border border-border/50">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Avg Response Time</p>
            <p className="text-xl font-bold text-foreground">142ms</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 border border-border/50">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">High Risk Apps</p>
            <p className="text-xl font-bold text-foreground">1</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search applications..."
          className="pl-9 bg-muted/50 border-border/50"
        />
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Application', 'Category', 'Status', 'Users', 'Risk Score', 'Last Sync', ''].map(h => (
                  <th key={h} className="py-4 px-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground font-semibold flex items-center gap-1.5 truncate">
                          {app.name}
                          <ExternalLink className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-primary" />
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">{app.url}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-[11px] font-medium border border-border/50">{app.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{app.usersCount}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${app.riskLevel === 'low' ? 'bg-primary' : app.riskLevel === 'medium' ? 'bg-warning' : 'bg-destructive'}`} />
                      <span className="text-xs font-semibold uppercase tracking-tight">{getRiskBadge(app.riskLevel)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground text-xs font-medium">{app.lastSync}</td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add App modal */}
      {showAddApp && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 animate-in fade-in duration-200" onClick={() => setShowAddApp(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="glass-card rounded-2xl p-6 max-w-md w-full border border-border/80 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Add New Application</h3>
                  <p className="text-xs text-muted-foreground mt-1">Register a new internal service to secure it.</p>
                </div>
                <button onClick={() => setShowAddApp(false)} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Application Name</label>
                  <Input
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    placeholder="e.g. Finance Dashboard"
                    className="bg-muted/30 h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Root URL</label>
                  <Input
                    value={newAppUrl}
                    onChange={(e) => setNewAppUrl(e.target.value)}
                    placeholder="e.g. https://finance.internal.com"
                    className="bg-muted/30 h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Category</label>
                  <select
                    value={newAppCategory}
                    onChange={(e) => setNewAppCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-md bg-muted/30 border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3">
                  <Shield className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-[11px] text-primary leading-relaxed font-medium">
                    Foretyx Guard will automatically intercept all traffic and apply PII scrubbing and prompt injection protection to this application.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowAddApp(false)} className="flex-1 h-11">Cancel</Button>
                  <Button onClick={handleAddApp} className="flex-1 h-11 font-bold shadow-lg shadow-primary/20">Register App</Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
