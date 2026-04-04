import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  AlertCircle, 
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils';

export default function Posts() {
  const { articles, deleteArticle, fetchArticles } = useBlog();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("确定要删除这篇文章吗？操作不可逆。")) {
      await deleteArticle(id);
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleBatchDelete = async () => {
    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 篇文章吗？`)) {
      for (const id of selectedIds) {
        await deleteArticle(id);
      }
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length && filtered.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(a => a.id));
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight mb-2 text-gradient">文章列表</h1>
          <p className="text-muted-foreground text-xs font-semibold tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            管理、编辑及发布您的所有内容 · 共 {articles.length} 篇
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <motion.button 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleBatchDelete}
              className="px-5 py-2.5 bg-destructive/10 text-destructive rounded-xl text-xs font-bold tracking-wide hover:bg-destructive hover:text-destructive-foreground transition-all flex items-center gap-2 border border-destructive/20"
            >
              <Trash2 size={14} />
              删除已选 ({selectedIds.length})
            </motion.button>
          )}
          <button 
            onClick={() => navigate('/admin/article/new')} 
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold tracking-wide shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            新建文章
          </button>
        </div>
      </div>

      {/* Content Ledger Area */}
      <div className="bg-card/40 backdrop-blur-sm rounded-[2rem] border border-border/50 overflow-hidden shadow-premium">
        
        {/* Toolbar */}
        <div className="px-8 py-6 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-muted/20">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">内容库</h2>
            <div className="h-4 w-[1px] bg-border/60" />
            <span className="text-[0.65rem] font-black px-2.5 py-1 bg-primary/10 text-primary rounded-lg uppercase tracking-wider">{filtered.length} 发现项</span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto max-w-md">
            <div className="relative group w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input
                placeholder="检索文章标题..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background/50 pl-10 pr-4 h-10 rounded-xl text-xs font-semibold tracking-wide border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
              />
            </div>
            <button className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-background/50 border border-border/50 text-muted-foreground hover:text-foreground transition-all">
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* List Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em] font-black border-b border-border/30 bg-muted/5">
                <th className="px-8 py-5 w-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded-md border-border bg-transparent text-primary focus:ring-primary/20 cursor-pointer"
                    />
                  </div>
                </th>
                <th className="px-6 py-5">文章详情</th>
                <th className="px-6 py-5">状态</th>
                <th className="px-6 py-5">发布日期</th>
                <th className="px-8 py-5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filtered.length > 0 ? filtered.map((article, idx) => (
                <motion.tr 
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-primary/[0.02] transition-all duration-300"
                >
                  <td className="px-8 py-6">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(article.id)}
                      onChange={() => toggleSelect(article.id)}
                      className="w-4 h-4 rounded-md border-border bg-transparent text-primary focus:ring-primary/20 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-6 max-w-md">
                    <div className="flex flex-col gap-2">
                       <Link to={`/admin/article/edit/${article.id}`} className="font-display text-lg font-bold hover:text-primary transition-all duration-300 block leading-tight">
                         {article.title}
                       </Link>
                       <div className="flex flex-wrap gap-2">
                          {article.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[0.6rem] font-bold text-muted-foreground/60 uppercase tracking-widest px-2 py-0.5 rounded-md bg-muted/40 border border-border/50">
                              {tag}
                            </span>
                          ))}
                          <span className="text-[0.6rem] font-bold text-muted-foreground/40 flex items-center gap-1.5 ml-1">
                             <Eye size={12} strokeWidth={2.5} /> {article.views || 0}
                          </span>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-wider ${article.status === 'published' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                      <span className={`w-1 h-1 rounded-full ${article.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {article.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-muted-foreground tracking-tight">{formatDate(article.date).split(',')[0]}</span>
                       <span className="text-[0.6rem] text-muted-foreground opacity-40 font-black uppercase tracking-widest mt-0.5">{formatDate(article.date).split(',')[1] || 'Today'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2 opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => window.open(`/article/${article.id}`, '_blank')} 
                        className="w-9 h-9 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-lg transition-all"
                        title="预览"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/article/edit/${article.id}`)} 
                        className="w-9 h-9 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-lg transition-all"
                        title="编辑"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(article.id)} 
                        className="w-9 h-9 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:shadow-lg transition-all"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-32 text-center">
                     <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                       <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-2">
                         <AlertCircle className="h-8 w-8 text-muted-foreground" />
                       </div>
                       <p className="text-xs font-black tracking-[0.2em] uppercase">资源库内未发现相关匹配项</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="px-8 py-6 border-t border-border/30 bg-muted/10 text-center">
           <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-muted-foreground/30">End of Content Ledger</p>
        </div>
      </div>
    </div>
  );
}
