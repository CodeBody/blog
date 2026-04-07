import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { ArrowLeft, Save, Globe, Type, Palette, Hash } from 'lucide-react';
import { FaGithub as Github } from 'react-icons/fa';
import { motion } from 'framer-motion';
import MDEditor from '@uiw/react-md-editor';
import { fetchAdminProjectById } from '../../utils/api';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    addProject, updateProject, showToast, loading 
  } = useBlog();
  
  const isNew = !id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    githubUrl: '',
    demoUrl: '',
    color: 'from-blue-500/20 to-purple-500/20',
  });

  const [colorMode, setColorMode] = useState('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setColorMode(isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (!isNew) {
      const loadProject = async () => {
        const project = await fetchAdminProjectById(id);
        if (project) {
          setFormData({
            title: project.title || '',
            description: project.description || '',
            tags: project.tags || '',
            githubUrl: project.githubUrl || '',
            demoUrl: project.demoUrl || '',
            color: project.color || 'from-blue-500/20 to-purple-500/20',
          });
        }
      };
      loadProject();
    }
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast("项目标题与描述不能为空", "warning");
      return;
    }

    if (isNew) {
      const res = await addProject(formData);
      if (res.code === 200) {
        showToast('项目已成功创建', 'success');
        navigate('/admin/projects');
      } else {
        showToast(res.message, 'error');
      }
    } else {
      const res = await updateProject({ ...formData, id });
      if (res.code === 200) {
        showToast('项目信息已更新', 'success');
        navigate('/admin/projects');
      } else {
        showToast(res.message, 'error');
      }
    }
  };

  const colorPresets = [
    { name: '蓝色紫影', value: 'from-blue-500/20 to-purple-500/20' },
    { name: '翡翠之光', value: 'from-emerald-500/20 to-teal-500/20' },
    { name: '落日余晖', value: 'from-orange-500/20 to-red-500/20' },
    { name: '星空深邃', value: 'from-slate-600/20 to-slate-900/20' },
    { name: '赛博霓虹', value: 'from-pink-500/20 to-cyan-500/20' },
    { name: '极简灰调', value: 'from-gray-500/20 to-slate-500/20' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border py-4 mb-10"
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin/projects" className="w-10 h-10 flex items-center justify-center rounded-2xl bg-muted hover:bg-primary hover:text-white transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
               <h1 className="text-lg font-bold text-foreground tracking-tight">{isNew ? '🚀 新建项目' : '🛠️ 编辑项目'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={handleSubmit} 
               className="px-8 py-2.5 bg-primary text-white rounded-2xl text-xs font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
             >
               <Save size={18} />
               {isNew ? '创建项目' : '保存修改'}
             </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6">
        <form onSubmit={handleSubmit} className="bg-card rounded-[2.5rem] border border-border shadow-xl overflow-hidden mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
            
            <div className="lg:col-span-2 p-10 space-y-10">
              {/* Title Input */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Type size={18} />
                  </div>
                  <label className="text-sm font-bold text-foreground">项目名称</label>
                </div>
                <input 
                  type="text"
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="项目名称..."
                  className="w-full bg-muted/20 border-2 border-transparent focus:border-primary/20 focus:bg-card rounded-2xl px-6 py-4 text-xl font-bold text-foreground transition-all focus:outline-none placeholder:text-muted-foreground/30"
                />
              </section>

              {/* Description Editor */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Palette size={18} />
                  </div>
                  <label className="text-sm font-bold text-foreground">项目详细描述 (Markdown)</label>
                </div>
                <div data-color-mode={colorMode}>
                  <MDEditor
                    value={formData.description}
                    onChange={(val) => setFormData(p => ({...p, description: val || ''}))}
                    height={400}
                    preview="edit"
                    className="!bg-transparent !border-2 !border-muted/20 !rounded-2xl overflow-hidden"
                  />
                </div>
              </section>
            </div>

            <div className="p-10 bg-muted/5 space-y-10">
              {/* GitHub Link */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Github size={18} className="text-muted-foreground" />
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">GitHub URL</label>
                </div>
                <input 
                  type="text"
                  name="githubUrl" 
                  value={formData.githubUrl} 
                  onChange={handleChange} 
                  className="w-full bg-background border border-border px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="https://github.com/..."
                />
              </section>

              {/* Demo Link */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-muted-foreground" />
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Demo URL</label>
                </div>
                <input 
                  type="text"
                  name="demoUrl" 
                  value={formData.demoUrl} 
                  onChange={handleChange} 
                  className="w-full bg-background border border-border px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="https://test.com"
                />
              </section>

              {/* Tags */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Hash size={18} className="text-muted-foreground" />
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">技术标签 (英文逗号分隔)</label>
                </div>
                <input 
                  type="text"
                  name="tags" 
                  value={formData.tags} 
                  onChange={handleChange} 
                  className="w-full bg-background border border-border px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="React,Nodejs,Typescript"
                />
              </section>

              {/* Color Presets */}
              <section className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 block mb-4">卡片渐变氛围</label>
                <div className="grid grid-cols-2 gap-3">
                   {colorPresets.map(preset => (
                     <button
                       key={preset.value}
                       type="button"
                       onClick={() => setFormData(p => ({...p, color: preset.value}))}
                       className={`h-12 rounded-xl border-2 transition-all overflow-hidden relative ${formData.color === preset.value ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-80 hover:opacity-100'}`}
                     >
                        <div className={`absolute inset-0 bg-gradient-to-br ${preset.value}`} />
                        <span className="relative z-10 text-[0.6rem] font-bold text-white drop-shadow-sm">{preset.name}</span>
                     </button>
                   ))}
                </div>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
