import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { Plus, Edit3, Trash2, Eye, Search, AlertCircle, BarChart3, FileText, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils';

export default function Dashboard() {
  const { articles, deleteArticle } = useBlog();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("确定要删除这篇文章吗？操作不可逆。")) {
      deleteArticle(id);
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleBatchDelete = () => {
    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 篇文章吗？`)) {
      selectedIds.forEach(id => deleteArticle(id));
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
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(a => a.id));
    }
  };

  // Calculate Stats
  const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
  const publishedCount = articles.filter(a => a.status === 'published').length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-border pb-8"
      >
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight mb-3">系统概览</h1>
          <p className="text-muted-foreground text-sm font-sans tracking-wide font-bold opacity-60">欢迎回来。这是今日动态。</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBatchDelete}
              className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              删除 ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={() => navigate('/admin/article/new')} 
            className="btn-primary flex items-center gap-2 group"
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90 duration-500" />
            新建文章
          </button>
        </div>
      </motion.div>

      {/* Editorial Analytics Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          { label: '文章总数', value: articles.length, icon: <FileText size={24}/>, color: 'text-foreground' },
          { label: '已发布', value: publishedCount, icon: <CheckCircle2 size={24}/>, color: 'text-brand-primary' },
          { label: '累计访问', value: totalViews.toLocaleString(), icon: <BarChart3 size={24}/>, color: 'text-foreground' }
        ].map((stat, idx) => (
          <motion.div key={idx} variants={item} className="editorial-card p-10 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
               {stat.icon}
             </div>
             <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest mb-4">{stat.label}</p>
             <h3 className={`text-5xl font-display font-black tracking-tighter ${stat.color}`}>{stat.value}</h3>
             <div className="mt-6 w-12 h-[1px] bg-border group-hover:w-full transition-all duration-700" />
          </motion.div>
        ))}
      </motion.div>

      {/* Content Management Ledger */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-background border border-border overflow-hidden"
      >
        <div className="px-8 py-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 bg-muted/5">
          <h2 className="font-display text-xl font-bold tracking-tight">内容管理</h2>
          <div className="relative group max-w-sm w-full">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/40 w-4 h-4 group-focus-within:text-brand-primary transition-colors" />
            <input
              placeholder="检索文章..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent pl-8 pr-4 py-2 text-[0.65rem] font-bold tracking-widest focus:outline-none border-b border-transparent focus:border-brand-primary transition-all placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[0.65rem] text-muted-foreground uppercase tracking-widest font-black border-b border-border bg-muted/10">
                <th className="p-8 w-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded-none border-border bg-transparent text-brand-primary focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-6 border-l border-border/50">文章标题</th>
                <th className="px-6 py-6 border-l border-border/50">状态</th>
                <th className="px-6 py-6 border-l border-border/50">记录日期</th>
                <th className="px-8 py-6 text-right border-l border-border/50">快速操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.length > 0 ? filtered.map((article) => (
                <tr key={article.id} className="group hover:bg-muted/5 transition-all duration-300">
                  <td className="p-8 w-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(article.id)}
                      onChange={() => toggleSelect(article.id)}
                      className="w-4 h-4 rounded-none border-border bg-transparent text-brand-primary focus:ring-0 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-8 align-top">
                    <Link to={`/admin/article/edit/${article.id}`} className="font-display text-lg font-bold hover:text-brand-primary transition-all duration-300 block mb-1">
                      {article.title}
                    </Link>
                    <div className="flex gap-2">
                       {article.tags?.slice(0, 3).map(tag => (
                         <span key={tag} className="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-widest px-2 py-0.5 border border-border/50">{tag}</span>
                       ))}
                    </div>
                  </td>
                  <td className="px-6 py-8 align-top">
                    <span className={`inline-block px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest ${article.status === 'published' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-muted/30 text-muted-foreground border border-border'}`}>
                      {article.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-8 align-top text-[0.7rem] font-bold text-muted-foreground tracking-widest">
                    {formatDate(article.date)}
                  </td>
                  <td className="px-8 py-8 text-right align-top group">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => window.open(`/article/${article.id}`, '_blank')} title="预览" className="p-2 border border-border hover:border-foreground hover:bg-foreground hover:text-background transition-all">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => navigate(`/admin/article/edit/${article.id}`)} title="编辑" className="p-2 border border-border hover:border-brand-primary hover:bg-brand-primary hover:text-white transition-all">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(article.id)} title="删除" className="p-2 border border-border hover:border-red-500 hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="group-hover:hidden text-muted-foreground/20">
                      <MoreHorizontal size={20} className="ml-auto" />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center">
                     <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                       <AlertCircle className="h-10 w-10" />
                       <p className="text-xs font-bold tracking-widest uppercase">未发现相关内容记录</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
