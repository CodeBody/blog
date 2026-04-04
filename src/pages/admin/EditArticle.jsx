import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { ArrowLeft, Save, Image as ImageIcon, X, Command, Eye, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import MDEditor from '@uiw/react-md-editor';

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    articles, categories, tags: allTags, 
    fetchTags, fetchCategories, fetchSingleArticle, 
    loading, addArticle, updateArticle, profile 
  } = useBlog();
  
  const isNew = !id;

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (!id) {
      // Clear data if new
    } else {
      fetchSingleArticle(id);
    }
  }, [id]);
  
  const existingArticle = !isNew ? articles.find(a => String(a.id) === String(id)) : null;

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    tags: [],
    status: 'published',
    content: '',
  });

  const [colorMode, setColorMode] = useState('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setColorMode(isDark ? 'dark' : 'light');
    
    const observer = new MutationObserver(() => {
      setColorMode(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (existingArticle) {
       setFormData({
         title: existingArticle.title,
         categoryId: existingArticle.categoryId || '',
         tags: existingArticle.tags || [],
         status: existingArticle.status === 1 ? 'published' : 'draft',
         content: existingArticle.content,
       });
    } else if (!isNew && !loading && articles.length > 0) {
       // Only navigate away if it's NOT a new draft AND we're done loading AND the article really doesn't exist
       navigate('/admin/posts');
    }
  }, [existingArticle, isNew, navigate, loading, articles.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("请填写标题和内容。");
      return;
    }

    if (isNew) {
      addArticle({
        id: Date.now().toString(),
        ...formData,
        author: profile?.name || 'Admin',
        date: new Date().toISOString(),
        views: 0
      });
    } else {
      updateArticle({
        ...existingArticle,
        ...formData
      });
    }

    navigate('/admin/posts');
  };


  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Boutique Studio Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4 mb-10"
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin/posts" className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-primary hover:text-white transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
               <h1 className="text-lg font-bold text-slate-900 tracking-tight">{isNew ? '✨ 新建文章' : '📝 编辑文章'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {!isNew && (
               <button onClick={() => window.open(`/article/${id}`, '_blank')} className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary transition-all font-bold text-xs">
                 预览文章
               </button>
             )}
             <button 
               onClick={handleSubmit} 
               className="px-8 py-2.5 bg-primary text-white rounded-2xl text-xs font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
             >
               <Save size={18} />
               {isNew ? '立即发布' : '同步更新'}
             </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* 1. Title Section */}
          <section className="px-10 py-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Command size={18} />
              </div>
              <label className="text-sm font-bold text-slate-800">文章标题</label>
            </div>
            <input 
              type="text"
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="请输入极具吸引力的标题..."
              className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 py-4 text-xl font-bold text-slate-900 transition-all focus:outline-none placeholder:text-slate-300"
            />
          </section>

          {/* 2. Category Section */}
          <section className="px-10 py-6 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                   <Zap size={18} />
                </div>
                <label className="text-sm font-bold text-slate-800">选择分类</label>
             </div>
             <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData(p => ({...p, categoryId: cat.id}))}
                    className={`px-4 py-2 rounded-xl text-[0.65rem] font-bold tracking-tight transition-all border-2 
                      ${formData.categoryId === cat.id 
                        ? 'bg-slate-800 text-white border-slate-800 shadow-sm' 
                        : 'bg-white text-slate-400 border-slate-100 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
             </div>
          </section>

          {/* 3. Tags Section */}
          <section className="px-10 py-6 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                   <ImageIcon size={18} />
                </div>
                <label className="text-sm font-bold text-slate-800">设定标签</label>
             </div>
             <div className="flex flex-wrap gap-2">
                {allTags.map(tag => {
                  const isSelected = formData.tags.includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setFormData(p => ({
                          ...p,
                          tags: isSelected ? p.tags.filter(t => t !== tag.name) : [...p.tags, tag.name]
                        }))
                      }}
                      className={`px-4 py-2 rounded-xl text-[0.65rem] font-bold tracking-tight transition-all border-2
                        ${isSelected 
                          ? 'bg-slate-800 text-white border-slate-800 shadow-sm' 
                          : 'bg-white text-slate-400 border-slate-100 hover:text-slate-600 hover:bg-slate-50'}`}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
             </div>
          </section>

          {/* 4. The Content Canvas */}
          <section className="min-h-[850px] relative flex flex-col">
             <div className="px-10 py-6">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Zap size={18} />
                   </div>
                   <label className="text-sm font-bold text-slate-800">正文内容创作</label>
                </div>
             </div>
             <div className="flex-1 px-2">
               <MDEditor
                 value={formData.content}
                 onChange={(val) => setFormData(p => ({...p, content: val || ''}))}
                 height={800}
                 preview="edit"
                 className="!bg-transparent !border-none !shadow-none h-full"
                 visibleDragbar={false}
               />
             </div>
             
             <div className="p-10 flex items-center justify-between">
                <p className="text-[0.65rem] font-bold text-slate-300 uppercase tracking-[0.3em]">
                   Crafting Excellence
                </p>
                <div className="text-[0.6rem] font-medium text-slate-400 italic">
                   "Quality of thought determines quality of life."
                </div>
             </div>
          </section>
        </form>

        <footer className="py-12 text-center text-slate-300 text-[0.6rem] font-bold tracking-[0.5em] uppercase">
           The Atelier Framework v2.0
        </footer>
      </div>
    </div>
  );
}
