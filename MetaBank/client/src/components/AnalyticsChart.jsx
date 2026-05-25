import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const sample = [
  { name: 'Jan', uv: 400 },
  { name: 'Feb', uv: 600 },
  { name: 'Mar', uv: 900 },
  { name: 'Apr', uv: 800 },
  { name: 'May', uv: 1200 },
  { name: 'Jun', uv: 1600 }
];

export default function AnalyticsChart() {
  return (
    <div className="bank-card p-4">
      <div className="text-sm text-[var(--muted)]">Portfolio Growth</div>
      <div style={{ width: '100%', height: 220 }} className="mt-3">
        <ResponsiveContainer>
          <LineChart data={sample}>
            <XAxis dataKey="name" stroke="var(--muted)" />
            <YAxis stroke="var(--muted)" />
            <Tooltip />
            <Line type="monotone" dataKey="uv" stroke="var(--enterprise-accent)" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
