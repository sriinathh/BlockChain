import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { WalletProvider } from '../contexts/WalletContext';

export default function DashboardLayout({ children }) {
  return (
    <WalletProvider>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col dashboard-bg">
          <div className="h-16" />
          <main className="p-6 md:p-8">{children}</main>
        </div>
      </div>
    </WalletProvider>
  );
}
