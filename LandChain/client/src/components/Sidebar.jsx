import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Building,
  ArrowLeftRight,
  ShieldCheck,
  Bell,
  Skull,
  Settings,
  LogOut,
  ShieldAlert
} from 'lucide-react';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Register Land', path: '/register-land', icon: FileSpreadsheet },
    { name: 'My Properties', path: '/my-lands', icon: Building },
    { name: 'Transfer Ownership', path: '/transfer-ownership', icon: ArrowLeftRight },
    { name: 'Verification Status', path: '/dashboard#verification', icon: ShieldCheck },
    { name: 'Fraud Reports', path: '/fraud-detection', icon: ShieldAlert },
    { name: 'Settings', path: '/profile', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Console', path: '/admin', icon: LayoutDashboard },
    { name: 'Register Land', path: '/register-land', icon: FileSpreadsheet },
    { name: 'Properties', path: '/my-lands', icon: Building },
    { name: 'Transfer Assets', path: '/transfer-ownership', icon: ArrowLeftRight },
    { name: 'Fraud Watch', path: '/fraud-detection', icon: Skull },
    { name: 'Verification Board', path: '/admin#approvals', icon: ShieldCheck },
    { name: 'Settings', path: '/profile', icon: Settings },
  ];

  const links = currentUser?.role === 'Admin' ? adminLinks : userLinks;

  return (
    <aside
      className={`glass-panel border-r border-white/5 h-[calc(100vh-80px)] flex flex-col justify-between transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col gap-4 py-6 overflow-y-auto overflow-x-hidden">
        
        {/* User Mini-Profile Card */}
        {!isCollapsed && currentUser && (
          <div className="px-4 mb-4">
            <div className="p-3 bg-cyber-blue-light/30 border border-white/5 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyber-indigo to-cyber-cyan flex items-center justify-center font-display font-bold text-white shadow-md">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyber-cyan font-semibold">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Links Navigation */}
        <nav className="flex flex-col gap-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-medium tracking-wide uppercase transition-all group ${
                    isActive
                      ? 'bg-cyber-cyan/10 border border-cyber-cyan/35 text-cyber-cyan shadow-[0_0_12px_rgba(6,182,212,0.06)]'
                      : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="relative">
                  <Icon size={18} className="transition-transform group-hover:scale-110 duration-200" />
                  {link.name === 'Notifications' && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {!isCollapsed && <span className="truncate">{link.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-3.5 rounded-xl text-sm font-medium tracking-wide uppercase text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent transition-all"
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
