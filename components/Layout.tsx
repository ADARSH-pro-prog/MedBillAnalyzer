import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  LogOut, 
  Moon, 
  Sun, 
  Menu,
  X,
  Activity,
  UserCircle
} from 'lucide-react';
import { ROUTES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: { username: string } | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
          isActive 
            ? 'text-white shadow-lg shadow-primary-500/20' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
        }`}
      >
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-100 transition-opacity duration-300" />
        )}
        <Icon size={20} className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="relative z-10 font-medium tracking-wide">{label}</span>
      </Link>
    );
  };

  // Ambient Background Components
  const AmbientBackground = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] rounded-full bg-teal-500/5 blur-[80px] animate-pulse-slow" />
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
        <AmbientBackground />
        <div className="absolute top-6 right-6 z-50">
           <button
            onClick={toggleTheme}
            className="p-3 rounded-full glass text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300 shadow-lg"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden relative selection:bg-primary-500/30">
      <AmbientBackground />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 
        transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full p-4 lg:py-6 lg:pl-6">
          <div className="h-full glass-card rounded-2xl flex flex-col overflow-hidden border border-white/20 shadow-2xl">
            {/* Logo Area */}
            <div className="p-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                  <Activity size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">MediBill</h1>
                  <span className="text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold">Analyst</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">Menu</div>
              <NavItem to={ROUTES.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
              <NavItem to={ROUTES.UPLOAD} icon={UploadCloud} label="Upload & Analyze" />
              <NavItem to={ROUTES.RESULTS} icon={FileText} label="Analysis Reports" />
            </nav>

            {/* User Footer */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.username}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Pro Account</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>
              
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 glass border-b border-slate-200/50 dark:border-slate-700/50 flex items-center px-4 justify-between z-30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <Activity size={18} />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">MediBill</span>
            </div>
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                <Menu size={24} />
            </button>
        </header>
        
        <div className="flex-1 overflow-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;