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
import ConfirmModal from '../../components/common/ConfirmModal';
import { getCategoryColor } from '../../components/common/KnowledgePlanet';

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories, showToast } = useBlog();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = (categories || []).filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('分类名称不能为空', 'warning');
      return;
    }
    const res = editingId ? await updateCategory({ ...formData, id: editingId }) : await addCategory(formData);
    if (res.code === 200) {
      showToast(editingId ? '分类更新完成' : '新分类已创建', 'success');
      setFormData({ name: '', description: '' });
      setEditingId(null);
      setIsAdding(false);
    } else {
      showToast(res.message, 'error');
    }
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '' });
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    setModal({
      isOpen: true,
      title: "确定移除此分类吗？",
      message: "该分类及其相关属性将从系统中移除。如果该分类下仍有文章，系统将拦截操作并给予警告提示。",
      onConfirm: async () => {
        const res = await deleteCategory(id);
        if (res.code !== 200) {
          showToast(res.message, 'error');
        } else {
          showToast('该分类已从系统移除', 'success');
        }
      }
    });
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
            <form onSubmit={handleSubmit} className="bg-card rounded-[2.5rem] border border-border shadow-xl overflow-hidden mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
              {/* Form Title Header */}
              <div className="px-10 py-6 bg-muted/30 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Plus size={16} strokeWidth={3} />
                   </div>
                   <h2 className="text-sm font-black uppercase tracking-widest">{editingId ? '编辑分类详情' : '创建新分类专栏'}</h2>
                </div>
                <div className="flex gap-2">
                   <button type="button" onClick={cancel} className="px-4 py-2 rounded-xl text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all">取消</button>
                   <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl text-[0.65rem] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                     <Check size={14} strokeWidth={3} /> {editingId ? '同步更新' : '立即创建'}
                   </button>
                </div>
              </div>

              {/* Section 1: Name */}
              <section className="px-10 py-8 space-y-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Layers size={18} />
                  </div>
                  <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-foreground/50">分类名称</label>
                </div>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="例如: 技术架构, 设计灵感..."
                  className="w-full bg-muted/10 border border-transparent focus:border-primary/20 focus:bg-card rounded-2xl px-6 py-4 text-xl font-bold text-foreground transition-all focus:outline-none placeholder:text-muted-foreground/20"
                />
              </section>

              {/* Section 2: Description */}
              <section className="px-10 py-8 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                       <FileText size={18} />
                    </div>
                     <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-foreground/50">分类描述 (Context)</label>
                 </div>
                 <textarea 
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="简短描述该分类包含的内容，帮助你在创作时保持焦点..."
                  className="w-full bg-muted/10 border border-transparent focus:border-primary/20 focus:bg-card rounded-2xl px-6 py-4 text-sm font-semibold text-foreground/70 transition-all focus:outline-none placeholder:text-muted-foreground/20 resize-none"
                />
              </section>
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
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? filtered.map((cat, idx) => {
              return (
                <motion.div 
                  key={cat.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-10 rounded-[2.5rem] border border-border/40 hover:border-primary/40 hover:bg-primary/[0.02] shadow-premium hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-8">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:rotate-6 shadow-sm transition-all duration-700"
                      style={{ 
                        backgroundColor: `${getCategoryColor(cat.id, cat.name)}20`, // 20% opacity for background
                        color: getCategoryColor(cat.id, cat.name)
                      }}
                    >
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
            }) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center opacity-40 flex flex-col items-center justify-center gap-8"
              >
                 <div className="w-28 h-28 rounded-[3rem] bg-muted/20 flex items-center justify-center relative shadow-inner">
                   <Layers size={48} className="relative z-10 text-muted-foreground/30" />
                 </div>
                 <div className="space-y-2">
                   <p className="text-lg font-black uppercase tracking-[0.5em] text-muted-foreground/60">未发现分类</p>
                   <p className="text-xs font-bold opacity-40 tracking-wider">尝试更换搜索关键词或新增一个分类专栏</p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmModal 
        isOpen={modal.isOpen}
        onClose={() => setModal(p => ({ ...p, isOpen: false }))}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
}
