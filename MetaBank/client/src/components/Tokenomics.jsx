import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Staking', value: 40 },
  { name: 'Team', value: 15 },
  { name: 'Treasury', value: 25 },
  { name: 'Public', value: 20 }
];

const COLORS = ['var(--enterprise-accent)', 'var(--success)', 'var(--gold)', 'var(--muted)'];

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-3xl font-bold">MBT Tokenomics</h2>
          <p className="text-[var(--muted)] mt-2">MBT powers staking, governance and fees across the ecosystem.</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bank-card p-4">
                  <div className="text-sm text-[var(--muted)]">Total Supply</div>
                  <div className="font-semibold text-[var(--text-900)]">1,000,000,000 MBT</div>
                </div>
                <div className="bank-card p-4">
                  <div className="text-sm text-[var(--muted)]">Staking Rewards</div>
                  <div className="font-semibold text-[var(--text-900)]">40% of supply</div>
                </div>
              </div>
        </div>

        <div className="bank-card p-6">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data} innerRadius={50} outerRadius={90} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
