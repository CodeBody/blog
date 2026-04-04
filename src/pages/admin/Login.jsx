import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(username, password);
    if (success) {
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } else {
      setError('身份验证失败。请检查账号和密码。');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full relative"
        >
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
            alt="Atmospheric Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-transparent to-[#050505]/80" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </motion.div>
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="max-w-7xl w-full px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left Side: Editorial Branding */}
        <motion.div
           initial={{ opacity: 0, x: -60 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
           className="hidden lg:flex flex-col space-y-10"
        >
          <div className="space-y-6">
            <div className="w-16 h-1 rounded-full bg-primary mb-10" />
            <h1 className="font-display text-7xl font-black tracking-tighter text-white leading-[0.9]">
              Creative<br/><span className="text-primary">Sanctuary.</span>
            </h1>
            <p className="text-white/40 font-black tracking-[0.4em] text-xs uppercase pt-2">
              The Architecture of Digital Expression
            </p>
          </div>
          
          <div className="flex flex-col gap-8 text-white/30 font-semibold text-sm tracking-tight leading-relaxed max-w-md">
            <p>Welcome back to your digital studio. Beyond this gateway lies the tools to shape your narrative and influence the digital frontier.</p>
            <div className="flex items-center gap-4 text-primary/80">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Quantum Secure Entry Protocol</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[480px] mx-auto lg:ml-auto lg:mr-0"
        >
          <div className="glass-card p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group border-white/5 bg-white/[0.02] backdrop-blur-3xl">
            {/* Animated border glow */}
            <div className="absolute -inset-[100%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_0deg,transparent,transparent,rgba(99,102,241,0.3),transparent,transparent)] opacity-30" />
            
            <div className="relative z-10">
              <div className="mb-12">
                <h2 className="font-display text-4xl font-black tracking-tight text-white mb-3">Authenticate</h2>
                <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em]">Enter your access credentials</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-10">
                <div className="space-y-6">
                  <div className="relative group">
                    <label className="text-[0.6rem] font-black text-white/20 uppercase tracking-[0.3em] mb-3 block px-1">Authority Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="ADMIN_ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl py-4 px-6 text-white font-bold text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/5 uppercase tracking-[0.1em] shadow-inner"
                      />
                      <User className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="text-[0.6rem] font-black text-white/20 uppercase tracking-[0.3em] mb-3 block px-1">Access Cipher</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl py-4 px-6 text-white font-bold text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/5 tracking-[0.5em] shadow-inner"
                      />
                      <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-primary transition-colors" />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3"
                      >
                        <X size={16} className="text-destructive" />
                        <p className="text-[0.6rem] text-destructive font-black uppercase tracking-widest">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black tracking-[0.3em] text-xs uppercase flex items-center justify-center gap-4 transition-all duration-500 hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.5)] active:scale-95 disabled:opacity-50 relative group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {isLoading ? 'VERIFYING...' : 'INITIALIZE ACCESS'}
                    {!isLoading && <ArrowRight size={20} strokeWidth={3} className="transition-transform duration-500 group-hover:translate-x-2" />}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </form>

              <div className="mt-12 flex justify-center opacity-10">
                <div className="w-12 h-1 bg-white rounded-full" />
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 1.5 }}
            className="mt-10 text-center"
          >
             <p className="text-[0.6rem] font-black uppercase tracking-[0.5em] text-white">
               © 2026 夏了个天 STUDIO · CORE v2.5.0
             </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
