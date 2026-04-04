import React, { useState, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Tag as TagIcon, 
  Check, 
  X,
  Search,
  Hash
} from 'lucide-react';

export default function Tags() {
  const { tags, addTag, updateTag, deleteTag, fetchTags } = useBlog();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const filtered = (tags || []).filter(t => 
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateTag({ ...formData, id: editingId });
      setEditingId(null);
    } else {
      await addTag(formData);
      setIsAdding(false);
    }
    setFormData({ name: '' });
  };

  const handleEdit = (tag) => {
    setEditingId(tag.id);
    setFormData({ name: tag.name });
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("确定要删除这个标签吗？")) {
      await deleteTag(id);
    }
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '' });
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight mb-2 text-gradient">标签管理</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] opacity-40">Fine-grained Content Metadata</p>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold tracking-wide shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2 group"
          >
            <Plus size={16} strokeWidth={3} className="transition-transform group-hover:rotate-90 duration-500" />
            新增标签
          </button>
        )}
      </div>

      {/* Inline Editor */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-8 rounded-[2rem] border-primary/20 bg-primary/[0.02] shadow-2xl shadow-primary/5"
          >
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-6">
              <div className="flex-1 space-y-3 w-full">
                <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">名称 (建议简短且唯一)</label>
                <div className="relative group">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-primary font-black text-2xl opacity-40">#</span>
                  <input
                    autoFocus
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value.replace(/\s/g, '-')})}
                    placeholder="例如: react-hooks, design-system..."
                    className="w-full bg-transparent pl-8 border-b-2 border-border/50 focus:border-primary py-2 text-2xl font-display font-black focus:outline-none placeholder:opacity-10 transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 w-full md:w-auto">
                 <button type="submit" className="flex-1 md:flex-none h-12 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest px-8 hover:scale-105 active:scale-95 transition-all">
                   <Check size={16} strokeWidth={3} /> 保存
                 </button>
                 <button type="button" onClick={cancel} className="h-12 w-12 rounded-2xl bg-muted/50 text-muted-foreground flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-all">
                   <X size={20} strokeWidth={3} />
                 </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
        <div className="relative group flex-1 max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input
            placeholder="搜索全局标签..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-border/20 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 transition-all placeholder:text-muted-foreground/30"
          />
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-muted/5 rounded-2xl border border-border/30 backdrop-blur-sm">
           <Hash size={14} className="text-primary/50" />
           <span className="text-[0.65rem] font-black uppercase tracking-widest opacity-40">{tags.length} 标签库记录</span>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? filtered.map((tag, idx) => (
            <motion.div 
              key={tag.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: idx * 0.01 
              }}
              className="glass-card p-6 rounded-[2.5rem] border border-border/40 hover:border-primary/40 hover:bg-primary/[0.03] shadow-premium hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg shadow-primary/5">
                    <TagIcon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                     <button 
                      onClick={() => handleEdit(tag)} 
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                      title="编辑标签"
                    >
                      <Edit3 size={16} strokeWidth={2.5} />
                    </button>
                     <button 
                      onClick={() => handleDelete(tag.id)} 
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      title="删除标签"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-display font-black tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-300 truncate">
                  {tag.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <span className="text-[0.6rem] font-black text-muted-foreground/30 uppercase tracking-widest">
                    ID: {tag.id}
                  </span>
                </div>
              </div>

              <div className="mt-10 pt-5 border-t border-border/30 relative z-10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[0.55rem] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Articles</span>
                  <span className="text-sm font-display font-black text-foreground/60">{tag.articleCount || 0}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-muted/50 text-[0.55rem] font-black text-muted-foreground/60 uppercase tracking-tighter ring-1 ring-border/50">
                  Global Tag
                </div>
              </div>
            </motion.div>
          )) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-32 text-center opacity-40 flex flex-col items-center justify-center gap-8"
            >
               <div className="w-28 h-28 rounded-[3rem] bg-muted/20 flex items-center justify-center relative shadow-inner">
                 <TagIcon size={48} className="relative z-10 text-muted-foreground/30" />
               </div>
               <div className="space-y-2">
                 <p className="text-lg font-black uppercase tracking-[0.5em] text-muted-foreground/60">未发现标签</p>
                 <p className="text-xs font-bold opacity-40 tracking-wider">尝试更换搜索关键词或新增一个标签</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="p-10 border-2 border-dashed border-border/30 flex items-center justify-center bg-muted/5 rounded-[2.5rem]"
      >
        <p className="text-[0.65rem] font-bold text-muted-foreground/40 italic tracking-wide text-center">
           <span className="text-primary/40 font-black not-italic mr-2 font-display uppercase tracking-[0.2em]">Note:</span>
           标签用于更灵活的文章分类检索，删除标签记录不会同步清理已分发的文章内容缓存。
        </p>
      </motion.div>
    </div>
  );
}
