import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, Moon, Sun, Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBlog } from '../../context/BlogContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const { logout } = useAuth();
  const { profile } = useBlog();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
    { label: '概览', icon: <LayoutDashboard size={18} />, path: '/admin' },
    { label: '写作', icon: <FileText size={18} />, path: '/admin/article/new' },
    { label: '偏好', icon: <Settings size={18} />, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-500 font-sans selection:bg-brand-primary selection:text-white">
      
      {/* Editorial Navigation Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-background border-r border-border transition-transform duration-700 ease-[0.16,1,0.3,1] lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-8 pt-12">
          {/* Brand */}
          <div className="mb-16">
            <Link to="/" className="group block">
              <span className="font-display text-2xl font-black tracking-tighter text-foreground group-hover:text-brand-primary transition-colors duration-300">
                编辑器<span className="text-brand-primary">.</span>
              </span>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mt-2 font-bold opacity-50">内容引擎</p>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-4 px-4 py-3 transition-all duration-300 relative ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <span className={`transition-transform duration-500 ${isActive ? 'scale-110 text-brand-primary' : 'group-hover:translate-x-1'}`}>
                    {item.icon}
                  </span>
                  <span className={`text-sm font-semibold tracking-wide transition-all duration-300 ${isActive ? 'translate-x-1' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-brand-primary rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Footer Area */}
          <div className="mt-auto space-y-8 pt-8 border-t border-border/50">
            <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 rounded-full border border-border overflow-hidden bg-muted/20 p-0.5">
                <img src={profile?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Admin"} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate tracking-tight">{profile?.name || '系统管理员'}</p>
                <button onClick={handleLogout} className="text-[0.6rem] uppercase tracking-wider text-muted-foreground hover:text-brand-primary transition-colors flex items-center gap-1 font-bold">
                  <LogOut size={10} /> 退出登录
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <button 
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <div className="text-[0.6rem] text-muted-foreground/30 font-bold tracking-[0.1em]">版本 2.0.4</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[280px] min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Subtle Background Texture/Glow */}
        <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
            <Menu size={20} />
          </button>
          <span className="font-display font-black tracking-tighter">编辑器.</span>
          <div className="w-8" /> {/* Placeholder for balance */}
        </header>

        {/* Desktop Top Bar (Minimalist) */}
        <header className="hidden lg:flex h-20 items-center justify-end px-12 z-20">
          <div className="flex items-center gap-6">
            <div className="relative group hidden xl:block">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="text" 
                placeholder="搜索..." 
                className="bg-transparent pl-7 pr-4 py-2 text-[0.65rem] font-bold tracking-[0.1em] focus:outline-none placeholder:text-muted-foreground/30 w-48 transition-all focus:w-64" 
              />
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-primary rounded-full border-2 border-background" />
            </button>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-6 lg:p-12 lg:pt-4 relative z-10 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden transition-all duration-500" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
