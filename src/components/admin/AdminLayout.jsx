import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, Moon, Sun, Search, Bell, Layers, Tag as TagIcon, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBlog } from '../../context/BlogContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const { logout } = useAuth();
  const { profile, fetchProfile } = useBlog();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: '看板', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { label: '写作', icon: <FileText size={20} />, path: '/admin/posts' },
    { label: '分类', icon: <Layers size={20} />, path: '/admin/categories' },
    { label: '标签', icon: <TagIcon size={20} />, path: '/admin/tags' },
    { label: '用户', icon: <Users size={20} />, path: '/admin/users' },
    { label: '设置', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 font-sans selection:bg-primary selection:text-primary-foreground">

      {/* Floating Sidebar Navigation */}
      <aside className={`fixed inset-y-4 left-4 z-50 w-[260px] rounded-3xl border border-border/50 bg-card/60 backdrop-blur-2xl shadow-xl transition-all duration-700 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}>
        <div className="h-full flex flex-col p-6">
          {/* Brand */}
          <div className="px-2 mb-10 mt-2">
            <Link to="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform duration-500">
                <FileText size={22} strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-display text-xl font-black tracking-tight block leading-none">
                  博客后台管理<span className="text-primary">.</span>
                </span>
                <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground font-bold opacity-60 mt-1">Content Hub</p>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                >
                  <span className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:translate-x-1'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold tracking-wide">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Footer Area */}
          <div className="mt-6 pt-6 border-t border-border/40">
            <div className="flex items-center gap-3 px-2 mb-6">
              <div className="w-10 h-10 rounded-2xl border-2 border-background overflow-hidden bg-muted p-0 shadow-sm">
                <img src={profile?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.name || 'Admin'}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.7rem] font-bold truncate tracking-tight">{profile?.name || '管理员'}</p>
                <p className="text-[0.55rem] text-muted-foreground truncate uppercase tracking-[0.05em] font-black opacity-40">{profile?.role || '超级管理员'}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                title="退出登录"
              >
                <LogOut size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between px-1">
              <button
                onClick={toggleTheme}
                className="group flex-1 flex items-center justify-center gap-2 h-10 rounded-2xl border border-border/50 bg-background/50 hover:bg-accent hover:border-accent transition-all duration-300"
              >
                {darkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-500" />}
                <span className="text-[0.6rem] font-bold uppercase tracking-widest">{darkMode ? '浅色' : '深色'}</span>
              </button>
              <div className="ml-4 text-[0.55rem] text-muted-foreground/30 font-black tracking-widest uppercase italic">V 2.1.0</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[280px] min-h-screen flex flex-col relative transition-all duration-500">

        {/* Ambient Glows */}
        <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
        <div className="fixed bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40 bg-background/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 rounded-2xl bg-card border border-border/50 text-muted-foreground hover:text-foreground shadow-sm">
              <Menu size={20} />
            </button>
            <div className="hidden lg:block">
               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">Workspace / Admin</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 h-10 rounded-2xl bg-card border border-border/50 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search size={16} className="text-muted-foreground/50" />
              <input 
                type="text" 
                placeholder="搜索全局记录..." 
                className="bg-transparent border-none outline-none text-xs font-semibold w-40 placeholder:text-muted-foreground/30 focus:w-56 transition-all"
              />
              <span className="px-1.5 py-0.5 rounded-md bg-muted text-[0.55rem] font-black text-muted-foreground/50 border border-border/50">⌘ K</span>
            </div>
            
            <button className="relative w-10 h-10 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:shadow-md transition-all">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-card animate-pulse" />
            </button>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-6 lg:px-12 lg:pb-12 relative z-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm lg:hidden transition-all duration-500" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
