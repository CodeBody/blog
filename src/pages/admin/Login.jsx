import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const success = login(password);
      if (success) {
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        setError('身份验证失败。请尝试 "admin123"');
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full relative"
        >
          <img 
            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2667&auto=format&fit=crop" 
            alt="Atmospheric Background" 
            className="w-full h-full object-cover opacity-60 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
      </div>

      <div className="max-w-6xl w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Editorial Branding */}
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
           className="hidden lg:flex flex-col space-y-8 border-l-[3px] border-brand-primary pl-10"
        >
          <div className="space-y-4">
            <h1 className="font-display text-5xl font-black tracking-widest text-foreground leading-tight">
              管理<br/>控制台
            </h1>
            <p className="text-muted-foreground font-sans tracking-[0.2em] text-sm uppercase">
              数字创意人的安全网关
            </p>
          </div>
          
          <div className="flex flex-col gap-6 text-muted-foreground/60 font-sans text-xs tracking-widest leading-loose max-w-sm">
            <p>在这里，每一篇文章都是一次数字世界的重塑。极简的界面设计，只为更专注的创作体验。</p>
            <div className="flex items-center gap-2 text-brand-primary/60">
              <ShieldCheck size={14} />
              <span>AES-256 加密安全访问</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-auto lg:ml-auto lg:mr-0"
        >
          <div className="bg-background/80 backdrop-blur-2xl border border-border p-10 pt-12 shadow-2xl relative overflow-hidden group">
            {/* Subtle brand line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-primary via-transparent to-transparent opacity-50" />
            
            <div className="mb-10 space-y-2">
              <h2 className="font-display text-2xl font-bold tracking-tight">身份验证</h2>
              <p className="text-muted-foreground text-sm font-sans tracking-wide">请输入您的访问密码以继续</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="password"
                    placeholder="访问密钥"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-border py-4 px-0 text-foreground tracking-[0.3em] font-sans text-sm focus:outline-none focus:border-brand-primary transition-colors placeholder:text-muted/40 placeholder:tracking-widest"
                  />
                  <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/30 group-focus-within:text-brand-primary transition-colors" />
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-brand-primary font-medium tracking-widest pt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-5 bg-foreground text-background font-sans font-bold tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-3 group overflow-hidden relative transition-all duration-500 hover:tracking-[0.4em] disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isLoading ? '验证中...' : '初始化访问'}
                  {!isLoading && <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-2" />}
                </span>
                <motion.div 
                  className="absolute inset-0 bg-brand-primary z-0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </button>
            </form>

            <div className="mt-12 flex justify-center">
              <div className="w-8 h-[1px] bg-border/50" />
            </div>
          </div>
          
          <div className="mt-6 text-center lg:text-right">
             <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground/40 font-sans">
               © 2026 夏了个天 BLOG 系统 · 版本 2.0.4 - 高级版
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
