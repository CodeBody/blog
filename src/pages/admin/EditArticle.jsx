import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { ArrowLeft, Save, Image as ImageIcon, X, Command, Eye, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import MDEditor from '@uiw/react-md-editor';

const TAG_OPTIONS = [
  { value: 'React', label: 'React' },
  { value: 'Vue.js', label: 'Vue.js' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'Next.js', label: 'Next.js' },
  { value: 'TailwindCSS', label: 'TailwindCSS' },
  { value: 'AI', label: 'AI' },
  { value: 'LLM', label: 'LLM' },
  { value: 'Deep Dive', label: 'Deep Dive' },
  { value: 'Open Source', label: 'Open Source' },
  { value: 'Design', label: 'Design' },
  { value: 'Experience', label: 'Experience' },
];

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles, addArticle, updateArticle, profile } = useBlog();
  
  const isNew = !id;
  const existingArticle = !isNew ? articles.find(a => a.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    tags: [],
    status: 'draft',
    content: '',
    coverImage: ''
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
         abstract: existingArticle.abstract,
         tags: existingArticle.tags || [],
         status: existingArticle.status,
         content: existingArticle.content,
         coverImage: existingArticle.coverImage || ''
       });
    } else if (!isNew) {
       navigate('/admin');
    }
  }, [existingArticle, isNew, navigate]);

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

    navigate('/admin');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, coverImage: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Editorial Header Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-12 pb-6 border-b border-border"
      >
        <div className="flex items-center gap-6">
          <Link to="/admin" className="w-10 h-10 flex items-center justify-center border border-border hover:border-foreground transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">{isNew ? '新文稿' : '文稿润色'}</h1>
            <p className="text-xs font-bold tracking-widest text-foreground/40">{formData.status === 'published' ? '准备发布' : '草稿状态'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button onClick={() => window.open('/articles', '_blank')} className="w-10 h-10 flex items-center justify-center border border-border hover:border-foreground transition-colors group" title="预览">
             <Eye size={18} />
           </button>
           <button 
             onClick={handleSubmit} 
             className="btn-primary group flex items-center gap-3"
           >
             <Save size={16} />
             {isNew ? '发布文章' : '更新文章'}
           </button>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-16">
        {/* Cinematic Cover Upload */}
        <section className="relative h-[400px] group overflow-hidden border border-border bg-muted/5">
          {formData.coverImage ? (
            <>
              <img src={formData.coverImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                 <button type="button" onClick={() => setFormData(p => ({...p, coverImage: ''}))} className="px-6 py-3 bg-red-500 text-white text-xs font-bold tracking-widest uppercase transition-all hover:scale-105">
                   移除封面图
                 </button>
              </div>
            </>
          ) : (
            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/10 transition-colors group">
               <div className="p-6 border border-dashed border-border/60 group-hover:border-brand-primary/50 transition-colors flex flex-col items-center gap-4">
                  <ImageIcon size={32} className="text-muted-foreground/30 group-hover:text-brand-primary/50 transition-colors" />
                  <span className="text-[0.6rem] font-bold tracking-widest text-muted-foreground/40 group-hover:text-brand-primary transition-colors">设置封面图</span>
               </div>
               <input type="file" className="hidden" onChange={handleImageUpload} />
            </label>
          )}
          <div className="absolute bottom-0 left-0 p-8">
             <div className="bg-background/80 backdrop-blur-md border border-border px-4 py-2 flex items-center gap-3">
                <Zap size={12} className="text-brand-primary" />
                <span className="text-[0.6rem] font-bold tracking-wider text-foreground opacity-60 uppercase">已开启电影级背景集成</span>
             </div>
          </div>
        </section>

        {/* Editorial Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           <div className="lg:col-span-8 space-y-12">
              <div className="space-y-4">
                <label className="text-[0.6rem] font-bold text-muted-foreground tracking-widest uppercase">文章标题</label>
                <input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="一段非凡旅程的开始..."
                  className="w-full bg-transparent text-5xl font-display font-black tracking-tighter focus:outline-none placeholder:opacity-10"
                />
              </div>

              <div className="space-y-4 pt-8 border-t border-border/50" data-color-mode={colorMode}>
                <label className="text-[0.6rem] font-bold text-muted-foreground tracking-widest uppercase flex items-center gap-2">
                  <Command size={12} />
                  文稿内容
                </label>
                <div className="editorial-card overflow-hidden">
                  <MDEditor
                    value={formData.content}
                    onChange={(val) => setFormData(p => ({...p, content: val || ''}))}
                    height={600}
                    preview="edit"
                    className="!bg-transparent !border-none !shadow-none"
                  />
                </div>
              </div>
           </div>

           {/* Metadata Sidebar */}
           <div className="lg:col-span-4 space-y-12">
              <div className=" editorial-card p-8 space-y-10 sticky top-12">
                 <div className="space-y-4">
                    <label className="text-[0.6rem] font-bold text-muted-foreground tracking-widest uppercase">发布状态</label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-border py-2 text-xs font-bold tracking-widest focus:outline-none focus:border-brand-primary appearance-none transition-colors"
                    >
                      <option value="draft">仍在阴影中 (草稿)</option>
                      <option value="published">点亮星系 (公开发布)</option>
                    </select>
                 </div>

                 <div className="space-y-4 pt-6 border-t border-border/50">
                    <label className="text-[0.6rem] font-bold text-muted-foreground tracking-widest uppercase">分类与标签</label>
                    <Select 
                      isMulti
                      options={TAG_OPTIONS}
                      value={TAG_OPTIONS.filter(o => formData.tags.includes(o.value))}
                      onChange={(s) => setFormData(p => ({...p, tags: s ? s.map(v => v.value) : []}))}
                      unstyled
                      classNames={{
                        control: (state) => `flex min-h-[40px] w-full border-b border-border bg-transparent py-1 text-xs font-bold transition-all ${state.isFocused ? 'border-brand-primary' : ''}`,
                        multiValue: () => "bg-muted/30 border border-border px-2 py-0.5 mr-1 mb-1 text-[0.6rem] tracking-widest uppercase font-bold",
                        placeholder: () => "text-muted-foreground/30",
                        input: () => "text-foreground",
                        menu: () => "bg-background border border-border mt-2 p-1 overflow-hidden shadow-2xl",
                        option: (state) => `p-3 text-[0.65rem] font-bold tracking-widest uppercase transition-colors ${state.isFocused ? 'bg-muted' : ''} ${state.isSelected ? 'text-brand-primary' : ''}`
                      }}
                      placeholder="添加视角..."
                    />
                 </div>

                 <div className="space-y-4 pt-6 border-t border-border/50">
                    <label className="text-[0.6rem] font-bold text-muted-foreground tracking-widest uppercase">文章摘要 / 总结</label>
                    <textarea 
                      name="abstract" 
                      value={formData.abstract} 
                      onChange={handleChange} 
                      placeholder="浓缩此番思考的精华..."
                      className="w-full bg-transparent border border-border p-4 h-32 text-xs font-medium leading-loose focus:outline-none focus:border-brand-primary transition-colors custom-scrollbar"
                    />
                 </div>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
