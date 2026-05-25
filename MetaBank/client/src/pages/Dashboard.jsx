import React, { useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import WalletCard from '../components/WalletCard';
import AnalyticsChart from '../components/AnalyticsChart';
import AIInsightCard from '../components/AIInsightCard';
import { useWallet } from '../contexts/WalletContext';
import AccountSummary from '../components/AccountSummary';
import SpendingChart from '../components/SpendingChart';
import SendMoneyModal from '../components/SendMoneyModal';
import TransactionList from '../components/TransactionList';

const sampleTx = [
  { title: 'Payment to Alice', amount: '-$120.00', to: 'Alice', date: '2026-05-01', status: 'success' },
  { title: 'Salary', amount: '+$4,200.00', to: 'Employer', date: '2026-04-28', status: 'success' }
];

export default function Dashboard() {
  const { balance, mbtBalance, ethUsd } = useWallet();
  const [sendOpen, setSendOpen] = useState(false);

  const accounts = [
    { type: 'Checking', number: '•••• 4242', balance: '$12,420.50', footer: 'Available for immediate use' },
    { type: 'Savings', number: 'Savings', balance: '$8,300.00', footer: 'Goal: Emergency Fund' },
    { type: 'Investments', number: 'Portfolio', balance: '$4,120.50', footer: 'Stocks & Crypto' }
  ];

  const handleSend = (data) => {
    console.log('Send', data);
    // TODO: wire to backend/blockchain service
  };

  return (
    <div className="dashboard-bg grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 rounded-md">
      <div className="lg:col-span-2">
        <AccountSummary accounts={accounts} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SpendingChart />
          </div>
          <div>
            <div className="bank-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[var(--muted)]">Total Balance</div>
                  <div className="text-lg font-bold text-[var(--text-900)]">{balance ? `$${Number(balance).toFixed(2)}` : '—'}</div>
                </div>
                <div>
                  <button onClick={() => setSendOpen(true)} className="btn-primary">Send Money</button>
                </div>
              </div>
              <div className="mt-4">
                <DashboardCard title="ETH Balance" value={balance ? `${Number(balance).toFixed(4)} ETH` : '—'} />
                <DashboardCard title="MBT Balance" value={mbtBalance ? `${Number(mbtBalance).toLocaleString()} MBT` : '—'} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <TransactionList txs={sampleTx} />
        </div>
      </div>

      <aside>
        <WalletCard />
        <div className="mt-4">
          <AIInsightCard title="Spending Pattern" desc="You spent 12% less this month." />
        </div>
      </aside>

      <SendMoneyModal open={sendOpen} onClose={() => setSendOpen(false)} onSend={handleSend} />
    </div>
  );
}
