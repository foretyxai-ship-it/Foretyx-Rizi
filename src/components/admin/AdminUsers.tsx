import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, X, UserPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { USERS, ORG } from '@/data/mockData';
import api from '@/api/axios';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('employee');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setLoading(true);
    setStatus('idle');
    setErrorMessage(null);
    const org_id = localStorage.getItem('org_id');

    try {
      await api.post(`/orgs/${org_id}/users`, {
        email: inviteEmail,
        role: inviteRole
      });
      
      setStatus('success');
      setInviteEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.response?.data?.detail || error.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const seatsUsed = ORG.seats.used;
  const seatsTotal = ORG.seats.total;
  const seatPercent = (seatsUsed / seatsTotal) * 100;

  return (
    <div className="space-y-6 animate-fade-in p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-1 rounded-md border border-border/50">{USERS.length} total users</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Inline Invite Form */}
          <div className="glass-card rounded-xl p-6 border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-widest">Invite New User</h2>
            </div>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Email Address</label>
                <input 
                  type="email"
                  required
                  value={inviteEmail} 
                  onChange={(e) => setInviteEmail(e.target.value)} 
                  placeholder="name@company.com" 
                  className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Access Level</label>
                <select 
                  value={inviteRole} 
                  onChange={(e) => setInviteRole(e.target.value)} 
                  className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Organization Owner</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Send Invitation
              </button>

              {status === 'success' && (
                <div className="flex items-center gap-2 p-3 bg-success/10 text-success text-xs font-bold rounded-lg border border-success/20 animate-in fade-in slide-in-from-top-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Invite sent to inbox
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-xs font-bold rounded-lg border border-destructive/20 animate-in shake">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}
            </form>
          </div>

          {/* Seat usage */}
          <div className="glass-card rounded-xl p-5 border-border/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Seat Allocation</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${seatPercent > 90 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                {seatPercent.toFixed(0)}% FULL
              </span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground tracking-tighter">{seatsUsed}</span>
                <span className="text-sm text-muted-foreground">/ {seatsTotal}</span>
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${seatPercent > 90 ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${seatPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search team members..." className="w-full h-11 pl-10 pr-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
          </div>

        <div className="glass-card rounded-xl overflow-hidden border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {['Member', 'Access', 'Last Seen', 'Activity', ''].map(h => (
                  <th key={h} className="text-left py-4 px-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-foreground font-bold leading-tight">{u.name}</p>
                        <p className="text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      u.role === 'owner' ? 'bg-primary/10 border-primary/20 text-primary' :
                      u.role === 'admin' ? 'bg-primary/10 border-primary/20 text-primary' :
                      'bg-muted border-border text-muted-foreground'
                    }`}>{u.role.toUpperCase()}</span>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground text-[11px] font-medium">{u.lastSeen}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'online' ? 'bg-success animate-pulse' : 'bg-muted-foreground/30'}`} />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{u.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
