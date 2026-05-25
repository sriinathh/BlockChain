import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const sample = [
  { name: 'Jan', uv: 400 },
  { name: 'Feb', uv: 600 },
  { name: 'Mar', uv: 900 },
  { name: 'Apr', uv: 800 },
  { name: 'May', uv: 1200 },
  { name: 'Jun', uv: 1600 }
];

export default function SpendingChart() {
  return (
    <div className="bank-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-[var(--muted)]">Monthly Spending</div>
          <div className="font-semibold text-[var(--text-900)]">This Year</div>
        </div>
        <div className="text-sm text-[var(--muted)]">USD</div>
      </div>

      <div style={{ width: '100%', height: 220 }} className="mt-3">
        <ResponsiveContainer>
          <AreaChart data={sample}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--enterprise-accent)" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="var(--enterprise-accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="var(--muted)" />
            <YAxis stroke="var(--muted)" />
            <Tooltip />
            <Area type="monotone" dataKey="uv" stroke="var(--enterprise-accent)" fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
