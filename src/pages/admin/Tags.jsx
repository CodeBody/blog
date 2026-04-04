import React, { useState } from 'react';
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
  const { tags, articles, addTag, updateTag, deleteTag } = useBlog();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [search, setSearch] = useState('');

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

      <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-premium">
        <div className="p-8 border-b border-border/30 flex items-center justify-between bg-muted/10">
           <div className="relative group flex-1 max-w-sm">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/30 w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input
                placeholder="搜索全局标签..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent pl-8 pr-4 py-2 text-xs font-bold tracking-wide focus:outline-none border-b border-transparent focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
              />
            </div>
            <div className="flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-[0.1em] opacity-30">
               <Hash size={14} className="text-primary/50" /> {tags.length} 标签库记录
            </div>
        </div>

        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.length > 0 ? filtered.map((tag, idx) => (
            <motion.div 
              key={tag.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              className="p-5 rounded-2xl border border-border/40 hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-lg transition-all duration-300 group flex items-center justify-between relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex-1 overflow-hidden relative z-10">
                <span className="text-[0.7rem] font-black uppercase tracking-widest truncate block group-hover:text-primary transition-colors"># {tag.name}</span>
                <span className="text-[0.55rem] font-black text-muted-foreground/30 uppercase tracking-tighter mt-0.5 block italic">UID: {tag.id}</span>
              </div>
              <div className="flex gap-1 relative z-10">
                 <button onClick={() => handleEdit(tag)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-primary/10 transition-all"><Edit3 size={12} /></button>
                 <button onClick={() => handleDelete(tag.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"><Trash2 size={12} /></button>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-20 text-center opacity-20 flex flex-col items-center justify-center gap-4">
               <div className="w-20 h-20 rounded-[2rem] bg-muted/50 flex items-center justify-center mb-2">
                 <TagIcon size={40} />
               </div>
               <p className="text-xs font-black uppercase tracking-[0.3em]">未发现匹配标签</p>
            </div>
          )}
        </div>
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
