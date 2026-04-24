import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { PII_TYPES_DATA, BLOCK_REASONS_DISTRIBUTION, MODEL_USAGE } from '@/data/mockData';

const timelineData = Array.from({ length: 30 }, (_, i) => ({
  date: `Mar ${i + 1}`,
  totalPrompts: Math.floor(Math.random() * 500) + 200,
  blocked: Math.floor(Math.random() * 50),
  piiEvents: Math.floor(Math.random() * 30),
  injectionAttempts: Math.floor(Math.random() * 10),
}));

export default function AdminAnalytics() {
  const [range, setRange] = useState('30d');

  return (
    <div className="space-y-6 animate-fade-in p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Security Analytics</h1>
        <div className="flex bg-muted rounded-lg p-0.5 border border-border">
          {['7d', '30d', '90d'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${range === r ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card/30 rounded-2xl p-6 backdrop-blur-md shadow-sm">
        <h2 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest">Activity Timeline</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, color: 'hsl(var(--foreground))', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 20 }} />
            <Line 
              type="monotone" 
              dataKey="totalPrompts" 
              name="Total Prompts" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={2000}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="blocked" 
              name="Blocked" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={2000}
              animationBegin={500}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="piiEvents" 
              name="PII Events" 
              stroke="#eab308" 
              strokeWidth={2} 
              dot={false} 
              strokeDasharray="5 5" 
              isAnimationActive={true}
              animationDuration={2000}
              animationBegin={800}
            />
            <Line 
              type="monotone" 
              dataKey="injectionAttempts" 
              name="Injection Attempts" 
              stroke="#a89f8c" 
              strokeWidth={2} 
              dot={false} 
              strokeDasharray="3 3" 
              isAnimationActive={true}
              animationDuration={2000}
              animationBegin={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card/30 rounded-2xl p-6 backdrop-blur-md shadow-sm">
          <h2 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest">PII Types Detected</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={PII_TYPES_DATA} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} opacity={0.3} />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--primary))" 
                radius={[0, 4, 4, 0]} 
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {PII_TYPES_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fillOpacity={0.8 + (index * 0.05)} className="hover:fill-opacity-100 transition-all duration-300 cursor-pointer" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card/30 rounded-2xl p-6 backdrop-blur-md shadow-sm">
          <h2 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest">Block Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={BLOCK_REASONS_DISTRIBUTION}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                style={{ fontSize: 11 }}
                isAnimationActive={true}
                animationDuration={1500}
                animationBegin={200}
                paddingAngle={5}
              >
                {BLOCK_REASONS_DISTRIBUTION.map((entry, i) => (
                  <Cell 
                    key={i} 
                    fill={entry.color} 
                    stroke="none"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {BLOCK_REASONS_DISTRIBUTION.map(b => (
              <div key={b.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                {b.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card/30 rounded-2xl p-6 backdrop-blur-md shadow-sm">
        <h2 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest">Model Performance Metrics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Model Name</th>
                <th className="text-right py-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Requests</th>
                <th className="text-right py-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Blocked</th>
                <th className="text-right py-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Pass Rate</th>
                <th className="text-right py-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Avg Latency</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_USAGE.map((m, index) => (
                <tr 
                  key={m.model} 
                  className="border-b border-border/50 hover:bg-primary/5 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationFillMode: 'both', animationDelay: `${index * 100}ms` }}
                >
                  <td className="py-4 text-foreground font-semibold group-hover:translate-x-1 transition-transform">{m.model}</td>
                  <td className="py-4 text-right text-foreground font-mono text-xs">{m.requests}</td>
                  <td className="py-4 text-right text-destructive font-mono text-xs">{m.blocked}</td>
                  <td className="py-4 text-right text-success font-mono text-xs">{m.passRate}</td>
                  <td className="py-4 text-right text-muted-foreground font-mono text-xs">{m.avgLatency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}