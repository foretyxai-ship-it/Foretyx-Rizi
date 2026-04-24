import React, { useEffect, useState, useCallback } from 'react';
import { Shield, Eye, AlertTriangle, Clock, Users, ShieldCheck, Tag, Laptop } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { RECENT_BLOCKS, BLOCK_REASONS_DISTRIBUTION, MOCK_TIMELINE } from '@/data/mockData';
import api from '@/api/axios';

export default function AdminOverview() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const org_id = localStorage.getItem('org_id') || 'org_f6720847';
    try {
      const res = await api.get(`/dashboard/summary?org_id=${org_id}`);
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen text-white">
      <header>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-zinc-500 text-xs font-mono">ORG: {localStorage.getItem('org_id') || 'org_f6720847'}</p>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Blocks Today" value={summary?.total_blocks_today ?? 0} icon={Shield} color="text-red-500" />
        <StatCard label="PII Events" value={summary?.pii_events_today ?? 0} icon={Eye} color="text-yellow-500" />
        <StatCard label="Injections" value={summary?.injection_attempts_today ?? 0} icon={AlertTriangle} color="text-orange-500" />
        <StatCard label="Latency" value={`${summary?.avg_guard_latency_ms ?? 0}ms`} icon={Clock} color="text-blue-400" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h2 className="text-xs font-bold text-zinc-500 uppercase mb-6">Activity Timeline</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={MOCK_TIMELINE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="totalPrompts" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h2 className="text-xs font-bold text-zinc-500 uppercase mb-6">Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={BLOCK_REASONS_DISTRIBUTION} innerRadius={60} outerRadius={80} dataKey="value" nameKey="name">
                {BLOCK_REASONS_DISTRIBUTION.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase">{label}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}