import React, { useState, useEffect, useCallback } from 'react';
import { Download, Shield, Terminal, ArrowRight, Activity, Clock } from 'lucide-react';
import api from '@/api/axios';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export default function AdminAuditLog() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudit = useCallback(async () => {
    setLoading(true);
    const org_id = localStorage.getItem('org_id');
    try {
      const res = await api.get(`/dashboard/audit?org_id=${org_id}&limit=50`);
      setEntries(res.data.entries || []);
      setError(null);
    } catch (err) {
      console.error('Audit fetch error:', err);
      setError('Audit server connection interrupted');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Audit Log</h1>
        <button className="h-9 px-4 border border-border rounded-md text-sm text-foreground flex items-center gap-2 hover:bg-muted transition">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>


      <div className="glass-card rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">SOC2 Audit Trail · Immutable · {entries.length} entries</span>
          </div>
          {loading && (
            <div className="flex items-center gap-1.5 text-[10px] text-primary animate-pulse font-bold">
              <Clock className="w-3 h-3" />
              SYNCING...
            </div>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {['Changed By', 'Version', 'When', 'What Changed'].map(h => (
                <th key={h} className="text-left py-3.5 px-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && entries.length === 0 ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-4 px-4"><Skeleton className="h-4 w-32 bg-muted/20" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-4 w-20 bg-muted/20" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-4 w-24 bg-muted/20" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-4 w-64 bg-muted/20" /></td>
                </tr>
              ))
            ) : entries.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-20 text-muted-foreground">
                <Activity className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No security events recorded yet.</p>
              </td></tr>
            ) : entries.map((entry, idx) => (
              <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition group">
                <td className="py-4 px-4">
                  <div className="font-medium text-foreground">{entry.changed_by}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-muted-foreground">v{entry.policy_version_before}</span>
                    <ArrowRight className="w-3 h-3 text-amber-500" />
                    <span className="text-amber-500 font-bold">v{entry.policy_version_after}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-muted-foreground text-xs font-medium">
                  {formatDistanceToNow(new Date(entry.changed_at), { addSuffix: true })}
                </td>
                <td className="py-4 px-4">
                  <p className="text-foreground text-xs leading-relaxed max-w-sm">{entry.diff_summary}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
