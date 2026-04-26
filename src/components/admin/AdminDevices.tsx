import React, { useState, useEffect, useCallback } from 'react';
import { Search, Laptop, Monitor, Terminal, Info } from 'lucide-react';
import api from '@/api/axios';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDevices() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const org_id = localStorage.getItem('org_id');
    try {
      const res = await api.get(`/dashboard/devices?org_id=${org_id}`);
      setDevices(res.data.devices);
      setError(null);
    } catch (err) {
      console.error('Device fetch error:', err);
      setError('Connection to device fleet lost. Retrying...');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const onlineCount = devices.filter(d => d.status.toUpperCase() === 'ONLINE').length;
  const offlineCount = devices.filter(d => d.status.toUpperCase() === 'OFFLINE').length;

  const filtered = devices.filter(d => {
    const statusMatch = filter === 'all' || d.status.toLowerCase() === filter;
    const searchMatch = !search || 
      d.user_id.toLowerCase().includes(search.toLowerCase()) || 
      d.device_id.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Fleet Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading && devices.length === 0 ? (
              <Skeleton className="h-4 w-48 bg-muted/30" />
            ) : (
              <span className="font-medium">
                {devices.length} devices · <span className="text-success">{onlineCount} online</span> · <span className="text-muted-foreground">{offlineCount} offline</span>
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search devices..."
            className="w-full h-9 pl-9 pr-3 rounded-md bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative grid grid-cols-3 bg-muted rounded-lg p-1 isolate w-[240px]">
          <div 
            className="absolute top-1 bottom-1 bg-card rounded-md shadow-sm transition-transform duration-300 ease-out -z-10"
            style={{ 
              left: '0.25rem',
              width: 'calc((100% - 0.5rem) / 3)',
              transform: `translateX(calc(${['all', 'online', 'offline'].indexOf(filter)} * 100%))` 
            }}
          />
          {(['all', 'online', 'offline'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`py-1.5 text-sm text-center rounded-md capitalize transition-colors duration-300 ${filter === f ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Device ID', 'User', 'Version', 'Status', 'Last Seen'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && devices.length === 0 ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-4 px-4"><Skeleton className="h-4 w-24 bg-muted/20" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-4 w-32 bg-muted/20" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-4 w-16 bg-muted/20" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-4 w-20 bg-muted/20" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-4 w-24 bg-muted/20" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center h-[50vh] text-muted-foreground">
                <Laptop className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-base">No devices found matching your filters.</p>
              </td></tr>
            ) : (
              filtered.map(d => (
                <tr key={d.device_id} className="border-b border-border/50 hover:bg-muted/30 transition group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">{d.device_id.slice(0, 16)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-foreground">{d.user_id}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-muted-foreground font-mono text-xs bg-muted/50 px-2 py-1 rounded">v{d.app_version}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {d.status.toUpperCase() === 'ONLINE' ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                          </span>
                          <span className="text-xs font-bold text-success tracking-tight">ONLINE</span>
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/40"></span>
                          <span className="text-xs font-bold text-muted-foreground tracking-tight">OFFLINE</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground text-xs font-medium">
                    {formatDistanceToNow(new Date(d.last_seen), { addSuffix: true })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
