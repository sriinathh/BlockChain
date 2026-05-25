import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-cyber-cyan/20 border-t-cyber-cyan animate-spin" />
          <span className="text-sm text-cyber-cyan/80 font-mono tracking-widest">DECRYPTING SESSION...</span>
        </div>
      </div>
    );
  }

  // Route guard: Redirect to login if not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-white overflow-hidden">
      <Navbar />
      
      <div className="flex flex-grow relative">
        <Sidebar isCollapsed={sidebarCollapsed} />

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col h-[calc(100vh-80px)] overflow-y-auto relative p-6 md:p-8">
          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-4 left-4 p-2 bg-cyber-blue-light/50 hover:bg-cyber-blue-light border border-white/5 rounded-lg text-gray-400 hover:text-cyber-cyan transition-colors z-20 hidden md:block"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
          
          <div className="mt-4 md:mt-8 max-w-7xl w-full mx-auto z-10">
            {children}
          </div>

          {/* Background Ambient Glows */}
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyber-indigo/5 rounded-full filter blur-[100px] pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
