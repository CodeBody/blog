import React, { useState, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Users as UsersIcon, 
  ShieldCheck, 
  Mail, 
  Check,
  X,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

export default function Users() {
  const { users, addUser, updateUser, deleteUser, fetchUsers } = useBlog();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ username: '', nickname: '', role: 'USER', email: '', avatar: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = (users || []).filter(u => 
    u.username?.toLowerCase().includes(search.toLowerCase()) || 
    (u.nickname && u.nickname.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateUser({ ...formData, id: editingId });
      setEditingId(null);
    } else {
      await addUser(formData);
      setIsAdding(false);
    }
    setFormData({ username: '', nickname: '', role: 'USER', email: '', avatar: '' });
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      nickname: user.nickname || '',
      role: user.role || 'USER',
      email: user.email || '',
      avatar: user.avatar || ''
    });
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("确定要删除这个用户吗？")) {
      await deleteUser(id);
    }
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ username: '', nickname: '', role: 'USER', email: '', avatar: '' });
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight mb-2 text-gradient">用户管理</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] opacity-40">Identity & Access Management</p>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold tracking-wide shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2 group"
          >
            <Plus size={16} strokeWidth={3} className="transition-transform group-hover:rotate-90 duration-500" />
            新增成员
          </button>
        )}
      </div>

      {/* Editor / Form */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="glass-card p-10 rounded-[2.5rem] border-primary/20 bg-primary/[0.02] shadow-2xl shadow-primary/5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">用户名 (登录凭据)</label>
                  <input
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Login username"
                    className="w-full bg-transparent border-b-2 border-border/50 focus:border-primary py-3 text-2xl font-display font-black focus:outline-none placeholder:opacity-10 transition-all"
                  />
                </div>
                <div className="space-y-3">
                   <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">显示昵称</label>
                   <input
                    value={formData.nickname}
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                    placeholder="Display name"
                    className="w-full bg-transparent border-b-2 border-border/50 focus:border-primary py-3 text-xl font-semibold focus:outline-none placeholder:opacity-10 transition-all"
                  />
                </div>
                <div className="space-y-3">
                   <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">权限角色</label>
                   <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-border/50 focus:border-primary py-3 text-sm font-black uppercase tracking-[0.2em] focus:outline-none cursor-pointer"
                   >
                     <option value="USER" className="bg-background text-foreground font-black">AUTHOR / EDITOR</option>
                     <option value="ADMIN" className="bg-background text-foreground font-black">SUPER ADMINISTRATOR</option>
                   </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-10 pt-8 border-t border-border/20">
                 <button type="button" onClick={cancel} className="px-6 py-2.5 rounded-xl border border-border/50 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/50 transition-all">取消</button>
                 <button type="submit" className="px-8 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                   <Check size={16} strokeWidth={3} /> 保存成员信息
                 </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Directory */}
      <div className="space-y-8">
      {/* Search & Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
        <div className="relative group flex-1 max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input
            placeholder="搜索用户标识或邮箱地址..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-border/20 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 transition-all placeholder:text-muted-foreground/30"
          />
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-muted/5 rounded-2xl border border-border/30 backdrop-blur-sm">
           <UsersIcon size={14} className="text-primary/50" />
           <span className="text-[0.65rem] font-black uppercase tracking-widest opacity-40">{users.length} Active System Accounts</span>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filtered.map((user, idx) => (
            <motion.div 
              key={user.id} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 rounded-[2.5rem] border border-border/40 hover:border-primary/40 hover:bg-primary/[0.02] shadow-premium hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-20">
                <div className="flex gap-2">
                   <button onClick={() => handleEdit(user)} className="w-9 h-9 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"><Edit3 size={14}/></button>
                   <button onClick={() => handleDelete(user.id)} className="w-9 h-9 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-all shadow-sm"><Trash2 size={14}/></button>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-6 mb-10 pt-4">
                <div className="relative">
                   <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors duration-700" />
                   <div className="w-24 h-24 rounded-[2.5rem] border-2 border-background overflow-hidden bg-muted/20 p-1 project-shadow relative z-10">
                    <img src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`} alt="Avatar" className="w-full h-full object-cover rounded-[2rem] grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" />
                  </div>
                </div>
                <div className="overflow-hidden flex-1 relative z-10 w-full">
                  <h3 className="font-display font-black text-3xl tracking-tighter truncate group-hover:text-primary transition-colors">{user.nickname || user.username}</h3>
                  <p className="text-[0.65rem] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-30 mt-1">@{user.username}</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-border/40 relative z-10">
                <div className="flex items-center justify-between">
                   <span className="text-[0.6rem] font-black text-muted-foreground/30 uppercase tracking-[0.1em]">Permission</span>
                   <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 ${user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      <ShieldCheck size={12} strokeWidth={3} />
                      <span className="text-[0.55rem] font-black uppercase tracking-[0.1em]">{user.role}</span>
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[0.6rem] font-black text-muted-foreground/30 uppercase tracking-[0.1em]">Identity</span>
                   <div className="flex items-center gap-2 text-muted-foreground/60 max-w-[140px]">
                      <Mail size={12} className="opacity-50 shrink-0" />
                      <span className="text-[0.6rem] font-bold truncate tracking-tight">{user.email || '未绑定邮箱'}</span>
                   </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between relative z-10">
                <div className="flex gap-4">
                  <FaGithub size={16} className="text-muted-foreground/20 hover:text-foreground cursor-pointer transition-all hover:scale-110" />
                  <MoreHorizontal size={16} className="text-muted-foreground/20 hover:text-foreground cursor-pointer transition-all hover:scale-110" />
                </div>
                <div className="text-[0.55rem] font-black text-muted-foreground/10 uppercase tracking-[0.3em] italic">ROOT_ID_{user.id}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
