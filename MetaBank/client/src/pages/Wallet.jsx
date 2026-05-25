import React from 'react';
import WalletCard from '../components/WalletCard';
import DashboardCard from '../components/DashboardCard';
// Wallet actions will be wired via WalletContext

export default function Wallet() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <WalletCard />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard title="Receive" value="QR & Address" />
          <DashboardCard title="Send" value="Fast Transfer" />
        </div>
      </div>

      <aside>
        <DashboardCard title="Wallet Stats" value="Active" />
      </aside>
    </div>
  );
}
