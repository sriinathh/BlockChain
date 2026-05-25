import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import Staking from './pages/Staking';
import Loans from './pages/Loans';
import Analytics from './pages/Analytics';
import AIAssistant from './pages/AIAssistant';
import NFTIdentity from './pages/NFTIdentity';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="min-h-screen landing-bg">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/users" element={<AdminUsers />} />

        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/wallet" element={<DashboardLayout><Wallet /></DashboardLayout>} />
        <Route path="/transactions" element={<DashboardLayout><Transactions /></DashboardLayout>} />
        <Route path="/staking" element={<DashboardLayout><Staking /></DashboardLayout>} />
        <Route path="/loans" element={<DashboardLayout><Loans /></DashboardLayout>} />
        <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
        <Route path="/ai-assistant" element={<DashboardLayout><AIAssistant /></DashboardLayout>} />
        <Route path="/nft-identity" element={<DashboardLayout><NFTIdentity /></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
      </Routes>
    </div>
  );
}

export default App;
