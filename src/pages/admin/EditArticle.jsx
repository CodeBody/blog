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
  const { articles, categories, addArticle, updateArticle, profile } = useBlog();
  
  const isNew = !id;
  const existingArticle = !isNew ? articles.find(a => a.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    categoryId: '',
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
         abstract: existingArticle.abstract || '',
         categoryId: existingArticle.categoryId || '',
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

    navigate('/admin/posts');
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
    <div className="max-w-7xl mx-auto pb-32">
      {/* Editor Header Overlay */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-12 sticky top-0 z-50 bg-background/80 backdrop-blur-xl py-6 border-b border-border/50"
      >
        <div className="flex items-center gap-6">
          <Link to="/admin/posts" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/50 hover:bg-muted transition-all group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-[0.65rem] font-black text-primary uppercase tracking-[0.2em]">{isNew ? 'New Draft' : 'Refining Masterpiece'}</h1>
            <p className="text-sm font-bold text-muted-foreground opacity-40 italic">
               {formData.status === 'published' ? '✨ Ready for the world' : '⏳ Private reflection'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button onClick={() => window.open('/articles', '_blank')} className="w-12 h-12 flex items-center justify-center rounded-2xl border border-border/50 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all group" title="预览">
             <Eye size={20} />
           </button>
           <button 
             onClick={handleSubmit} 
             className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
           >
             <Save size={18} strokeWidth={2.5} />
             {isNew ? 'Publish Now' : 'Save Changes'}
           </button>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-20">
        {/* Cinematic Cover Area */}
        <section className="relative h-[480px] group overflow-hidden rounded-[3rem] border border-border/30 bg-muted/10 shadow-2xl">
          {formData.coverImage ? (
            <>
              <img src={formData.coverImage} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="Cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center backdrop-blur-sm">
                 <button type="button" onClick={() => setFormData(p => ({...p, coverImage: ''}))} className="px-10 py-4 bg-destructive text-destructive-foreground rounded-2xl text-xs font-black tracking-widest uppercase transition-all hover:scale-110 hover:shadow-2xl shadow-destructive/20">
                   REMOVE COVER IMAGE
                 </button>
              </div>
            </>
          ) : (
            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/5 transition-all group">
               <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150 group-hover:bg-primary/20 transition-all" />
                  <div className="w-24 h-24 rounded-[2.5rem] border-2 border-dashed border-border/60 group-hover:border-primary/50 transition-all flex items-center justify-center relative z-10">
                    <ImageIcon size={40} className="text-muted-foreground/20 group-hover:text-primary transition-all duration-500" />
                  </div>
               </div>
               <span className="mt-8 text-[0.7rem] font-black tracking-[0.3em] text-muted-foreground/30 group-hover:text-primary transition-all uppercase">Stage your visual masterpiece</span>
               <input type="file" className="hidden" onChange={handleImageUpload} />
            </label>
          )}
          <div className="absolute bottom-10 left-10 p-1">
             <div className="glass-card rounded-2xl px-6 py-3 flex items-center gap-4 bg-background/30 border-white/10 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[0.65rem] font-black tracking-[0.2em] text-white/70 uppercase">Cinematic Experience Enabled</span>
             </div>
          </div>
        </section>

        {/* Writing Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
           <div className="lg:col-span-8 space-y-16">
              <div className="space-y-6">
                <label className="text-[0.65rem] font-black text-muted-foreground/30 tracking-[0.4em] uppercase">Title of the Story</label>
                <textarea 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="The genesis of a new perspective..."
                  rows={2}
                  className="w-full bg-transparent text-6xl font-display font-black tracking-tighter focus:outline-none placeholder:opacity-5 resize-none leading-tight"
                />
              </div>

              <div className="space-y-6 pt-12 border-t border-border/30" data-color-mode={colorMode}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[0.65rem] font-black text-muted-foreground/30 tracking-[0.4em] uppercase flex items-center gap-3">
                    <Command size={14} className="text-primary/50" />
                    Narrative Canvas
                  </label>
                  <div className="flex items-center gap-2 text-[0.6rem] font-black text-primary/40 uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                    <Zap size={10} /> Markdown Live
                  </div>
                </div>
                <div className="glass-card rounded-[2.5rem] overflow-hidden border-border/20 shadow-xl min-h-[600px]">
                  <MDEditor
                    value={formData.content}
                    onChange={(val) => setFormData(p => ({...p, content: val || ''}))}
                    height={700}
                    preview="edit"
                    className="!bg-transparent !border-none !shadow-none markdown-editor-custom"
                    visibleDragbar={false}
                  />
                </div>
              </div>
           </div>

           {/* Insights Sidebar */}
           <div className="lg:col-span-4 space-y-12">
              <div className="sticky top-32 space-y-8">
                <div className="glass-card p-10 rounded-[3rem] space-y-12 border-border/20 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                   
                   <div className="space-y-4">
                      <label className="text-[0.65rem] font-black text-muted-foreground/40 tracking-[0.3em] uppercase">Status</label>
                      <div className="relative">
                        <select 
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-4 text-xs font-black tracking-widest focus:outline-none focus:border-primary appearance-none transition-all cursor-pointer uppercase shadow-inner"
                        >
                          <option value="draft">📁 Hidden Draft</option>
                          <option value="published">🚀 Public Launch</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                           <ArrowLeft size={16} className="-rotate-90" />
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[0.65rem] font-black text-muted-foreground/40 tracking-[0.3em] uppercase">Taxonomy</label>
                      <div className="space-y-4">
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleChange}
                          className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-4 text-xs font-black tracking-widest focus:outline-none focus:border-primary appearance-none transition-all cursor-pointer uppercase shadow-inner"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>

                        <Select 
                          isMulti
                          options={TAG_OPTIONS}
                          value={TAG_OPTIONS.filter(o => formData.tags.includes(o.value))}
                          onChange={(s) => setFormData(p => ({...p, tags: s ? s.map(v => v.value) : []}))}
                          unstyled
                          classNames={{
                            control: (state) => `flex min-h-[56px] w-full bg-muted/30 border-2 rounded-2xl px-4 text-[0.65rem] font-black transition-all ${state.isFocused ? 'border-primary border-2 shadow-glow-sm' : 'border-border/50 shadow-inner'}`,
                            multiValue: () => "bg-primary/10 border border-primary/20 text-primary px-3 py-1 mr-1.5 mb-1.5 rounded-lg text-[0.6rem] tracking-[0.1em] uppercase font-black",
                            placeholder: () => "text-muted-foreground/20 uppercase tracking-[0.2em]",
                            input: () => "text-foreground",
                            menu: () => "bg-background/90 backdrop-blur-xl border border-border/50 mt-4 rounded-2xl overflow-hidden shadow-2xl p-2",
                            option: (state) => `p-4 rounded-xl text-[0.6rem] font-black tracking-[0.2em] uppercase transition-all ${state.isFocused ? 'bg-primary/10 text-primary' : 'text-muted-foreground'} ${state.isSelected ? 'bg-primary text-primary-foreground' : ''}`
                          }}
                          placeholder="Select Identity Tags"
                        />
                      </div>
                   </div>

                   <div className="space-y-4 pb-4">
                      <label className="text-[0.65rem] font-black text-muted-foreground/40 tracking-[0.3em] uppercase">Summary</label>
                      <textarea 
                        name="abstract" 
                        value={formData.abstract} 
                        onChange={handleChange} 
                        placeholder="Distill the essence of your thoughts..."
                        className="w-full bg-muted/30 border-2 border-border/50 rounded-[2rem] p-6 min-h-[160px] text-xs font-semibold leading-relaxed focus:outline-none focus:border-primary transition-all custom-scrollbar shadow-inner placeholder:italic placeholder:opacity-20"
                      />
                   </div>
                </div>

                <div className="p-8 border-2 border-dashed border-border/30 rounded-[3rem] text-center bg-muted/5 opacity-50">
                   <p className="text-[0.6rem] font-black text-muted-foreground/40 uppercase tracking-[0.2em] leading-loose">
                      Your words matter. <br />Every draft is a step towards clarity.
                   </p>
                </div>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
