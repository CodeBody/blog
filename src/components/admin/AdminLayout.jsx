import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBlog } from '../../context/BlogContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const { profile } = useBlog();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { label: 'New Article', icon: <FileText size={20} />, path: '/admin/article/new' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-muted/10 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden fixed">
        <div className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] rounded-full blur-[120px] bg-brand-primary/10 animate-float mix-blend-screen" />
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] rounded-full blur-[150px] bg-brand-secondary/10 animate-float [animation-delay:3s] mix-blend-screen" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop Wrapper for Floating Island */}
      <div className="hidden md:flex flex-col w-[20rem] p-6 z-10 shrink-0 h-screen sticky top-0">
        <aside className="w-full h-full bg-background/60 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-3xl shadow-glow overflow-hidden flex flex-col transition-all duration-300">
          <div className="flex items-center justify-between h-20 px-8 border-b border-border/40">
            <Link to="/" className="text-xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-brand">Admin Console</Link>
          <button className="md:hidden text-muted-foreground hover:text-primary" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col justify-between h-[calc(100vh-5rem)]">
          <nav className="p-4 space-y-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[0.95rem] font-medium transition-all group overflow-hidden ${
                    isActive
                      ? 'text-foreground bg-primary/5 shadow-sm'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-brand-primary rounded-r-full shadow-glow" />
                  )}
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-50" />
                  )}
                  <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-brand-primary' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className="relative z-10 tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-5 border-t border-border/40 mt-auto bg-muted/10">
            <div className="flex items-center gap-3 mb-6 px-4">
              <img src={profile?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Alex"} alt="Avatar" className="w-11 h-11 rounded-xl border border-border/50 shadow-sm" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate tracking-tight">{profile?.name || 'Admin User'}</p>
                <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground truncate mt-0.5">Workspace Owner</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-3 px-4 py-3 border border-border/50 rounded-xl text-sm font-medium text-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all duration-300 group"
            >
              <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
              Sign Out
            </button>
          </div>
        </div>
        </aside>
      </div>

      {/* Mobile Sidebar (fallback) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-background/90 backdrop-blur-2xl border-r border-border transform transition-transform duration-500 md:hidden flex flex-col ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-border/40">
          <Link to="/" className="text-xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-brand">Admin Console</Link>
          <button className="text-muted-foreground hover:text-primary" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col justify-between h-[calc(100vh-5rem)]">
          <nav className="p-4 space-y-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl text-[0.95rem] font-medium transition-all group overflow-hidden ${isActive ? 'text-foreground bg-primary/5' : 'text-muted-foreground hover:bg-muted/40'}`}
                >
                  <span className={`relative z-10 ${isActive ? 'text-brand-primary' : ''}`}>{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-5 mt-auto">
            <button onClick={handleLogout} className="flex w-full items-center justify-center gap-3 px-4 py-4 bg-muted/50 rounded-xl text-sm font-medium text-foreground hover:bg-red-500/10 hover:text-red-500 transition-all">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <header className="h-16 flex items-center gap-4 px-4 sm:px-6 lg:px-8 border-b border-border bg-background md:hidden">
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-primary">
              <Menu size={24} />
            </button>
            <span className="font-semibold">Admin Panel</span>
        </header>

        <main className="flex-1 p-4 sm:p-8 lg:p-10 lg:pr-12 overflow-y-auto overflow-x-hidden custom-scrollbar max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
