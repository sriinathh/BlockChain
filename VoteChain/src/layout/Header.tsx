import { Link, useNavigate } from 'react-router-dom';
import { useVoteStore } from '../store/useVoteStore';
import { 
  Home, Database, BarChart3, LogIn, 
  LogOut, Settings, LayoutDashboard, UserCheck, ShieldCheck 
} from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, logout } = useVoteStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[#0A1F44] text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#00B4D8]" />
          <span>Vote<span className="text-[#00B4D8]">Chain</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-5">
          <Link to="/" className="flex items-center text-xs font-semibold hover:text-[#00B4D8] transition-colors gap-1">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link to="/about" className="text-xs font-semibold hover:text-[#00B4D8] transition-colors">
            About
          </Link>
          <Link to="/guidelines" className="text-xs font-semibold hover:text-[#00B4D8] transition-colors">
            Guidelines
          </Link>
          <Link to="/contact" className="text-xs font-semibold hover:text-[#00B4D8] transition-colors">
            Contact
          </Link>
          <Link to="/results" className="flex items-center text-xs font-semibold hover:text-[#00B4D8] transition-colors gap-1">
            <BarChart3 className="w-4 h-4" />
            Live Tally
          </Link>
          <Link to="/explorer" className="flex items-center text-xs font-semibold hover:text-[#00B4D8] transition-colors gap-1">
            <Database className="w-4 h-4" />
            Ledger Explorer
          </Link>
          {currentUser && (
            <Link to="/dashboard" className="flex items-center text-xs font-semibold hover:text-[#00B4D8] transition-colors gap-1">
              <LayoutDashboard className="w-4 h-4 text-[#00B4D8]" />
              Citizen Panel
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="flex items-center text-xs font-semibold hover:text-[#00B4D8] transition-colors gap-1">
              <Settings className="w-4 h-4 text-[#00B4D8]" />
              Admin Console
            </Link>
          )}
        </nav>

        {/* User Session Widget */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-gray-400 block font-semibold">Citizen ID</span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#00B4D8]" /> {currentUser.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${
                  currentUser.hasVoted 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }`}>
                  {currentUser.hasVoted ? 'Ballot Cast' : 'Not Voted'}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded border border-white/10 transition"
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : isAdmin ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-yellow-400 font-semibold block uppercase tracking-wide">Election Commission</span>
                <span className="text-xs font-bold text-white">Coordinators Panel</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/20 transition flex items-center gap-1"
                title="Logout Coordinator"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="py-1.5 px-4 bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-[#0A1F44] text-xs font-bold rounded shadow-sm transition flex items-center gap-1"
            >
              <LogIn className="w-4 h-4" /> Citizen Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

