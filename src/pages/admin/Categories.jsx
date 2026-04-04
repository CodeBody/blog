import React, { useState, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Layers, 
  Check, 
  X,
  FileText,
  Search
} from 'lucide-react';

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories } = useBlog();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = (categories || []).filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateCategory({ ...formData, id: editingId });
      setEditingId(null);
    } else {
      await addCategory(formData);
      setIsAdding(false);
    }
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '' });
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("确定要删除这个分类吗？")) {
      await deleteCategory(id);
    }
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight mb-2 text-gradient">分类管理</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] opacity-40">Content Taxonomy & Structure</p>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold tracking-wide shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            新增分类
          </button>
        )}
      </div>

      {/* Editor / Form (Inline) */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-[2rem] border-primary/20 bg-primary/[0.02] shadow-2xl shadow-primary/5">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-3 w-full">
                  <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">分类名称</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="例如: 技术架构, 设计灵感..."
                    className="w-full bg-transparent border-b-2 border-border/50 focus:border-primary py-3 text-2xl font-display font-black focus:outline-none placeholder:opacity-10 transition-all"
                  />
                </div>
                <div className="flex-1 space-y-3 w-full">
                   <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">描述 (可选)</label>
                   <input
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="简短描述该分类包含的内容..."
                    className="w-full bg-transparent border-b-2 border-border/50 focus:border-primary py-3 text-lg font-semibold focus:outline-none placeholder:opacity-10 transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 pt-8">
                   <button type="submit" className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                     <Check size={20} strokeWidth={3} />
                   </button>
                   <button type="button" onClick={cancel} className="w-12 h-12 rounded-2xl bg-muted/50 text-muted-foreground flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-all">
                     <X size={20} strokeWidth={3} />
                   </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & List */}
      <div className="space-y-8">
      {/* Search & Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
        <div className="relative group flex-1 max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input
            placeholder="搜索全部分类..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-border/20 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 transition-all placeholder:text-muted-foreground/30"
          />
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-muted/5 rounded-2xl border border-border/30 backdrop-blur-sm">
           <Layers size={14} className="text-primary/50" />
           <span className="text-[0.65rem] font-black uppercase tracking-widest opacity-40">{categories.length} 分类记录</span>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filtered.map((cat, idx) => {
            return (
              <motion.div 
                key={cat.id} 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-10 rounded-[2.5rem] border border-border/40 hover:border-primary/40 hover:bg-primary/[0.02] shadow-premium hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-6 shadow-sm transition-all duration-700">
                    <Layers size={20} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="编辑"><Edit3 size={14}/></button>
                    <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all" title="删除"><Trash2 size={14}/></button>
                  </div>
                </div>
                
                <h3 className="font-display text-2xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-xs font-semibold text-muted-foreground/60 line-clamp-2 min-h-[2.5rem] mb-8 font-sans leading-relaxed tracking-tight">
                  {cat.description || "暂无分类描述信息"}
                </p>
                
                <div className="pt-6 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-[0.1em] text-muted-foreground/40">
                    <FileText size={12} className="text-primary/50" /> {cat.articleCount || 0} Articles
                  </div>
                  <div className="text-[0.6rem] font-black text-muted-foreground/20 italic tracking-widest uppercase">ID: {cat.id}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
