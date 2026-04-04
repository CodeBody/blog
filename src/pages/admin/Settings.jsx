import React, { useState, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Save, User, Link as LinkIcon, Camera, AtSign, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const { profile, updateProfile } = useBlog();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    github: '',
    twitter: '',
    linkedin: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        github: profile.socials?.github || '',
        twitter: profile.socials?.twitter || '',
        linkedin: profile.socials?.linkedin || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      bio: formData.bio,
      avatar: formData.avatar,
      socials: {
        github: formData.github,
        twitter: formData.twitter,
        linkedin: formData.linkedin
      }
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-border pb-8"
      >
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight mb-3">系统偏好</h1>
          <p className="text-muted-foreground text-sm font-sans tracking-wide font-bold opacity-60">构建你的数字存在与身份。</p>
        </div>
        <button 
          onClick={handleSubmit} 
          className="btn-primary group flex items-center gap-2"
        >
          <Save size={16} className="transition-transform group-hover:scale-110 duration-300" />
          {isSaved ? '配置已保存' : '保存更改'}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Identity Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4"
        >
          <div className="editorial-card p-8 flex flex-col items-center text-center space-y-8 sticky top-32">
            <div className="relative group">
              <div className="w-40 h-40 rounded-none border border-border p-1 bg-background relative overflow-hidden transition-all duration-700 group-hover:border-brand-primary/50">
                <img 
                  src={formData.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Admin"} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-primary rounded-none flex items-center justify-center text-white shadow-xl">
                <AtSign size={14} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold tracking-tight">{formData.name || '未命名用户'}</h3>
              <p className="text-[0.65rem] font-bold text-muted-foreground tracking-widest uppercase">视觉身份预览</p>
            </div>
            
            <div className="w-12 h-[1px] bg-border mx-auto" />
            
            <p className="text-xs text-muted-foreground leading-loose italic px-4">
              "{formData.bio || '无声胜有声。'}"
            </p>
          </div>
        </motion.div>

        {/* Right Side: Configuration Forms */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-8 space-y-12"
        >
          {/* Personal Information */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <User size={20} className="text-brand-primary" />
              <h2 className="font-display text-xl font-bold tracking-tight">身份信息</h2>
              <div className="h-[1px] flex-1 bg-border/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[0.65rem] font-bold text-muted-foreground tracking-widest uppercase">显示名称</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="例如：夏了个天"
                  className="w-full bg-transparent border-b border-border py-3 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-primary transition-colors placeholder:opacity-20"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[0.65rem] font-bold text-muted-foreground tracking-widest uppercase">头像地址 (URL)</label>
                <input 
                  name="avatar" 
                  value={formData.avatar} 
                  onChange={handleChange} 
                  placeholder="HTTPS://..."
                  className="w-full bg-transparent border-b border-border py-3 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-primary transition-colors placeholder:opacity-20"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-[0.65rem] font-bold text-muted-foreground tracking-widest uppercase">个人简介</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  placeholder="分享你的哲学或简介..."
                  className="w-full bg-transparent border border-border p-4 h-32 text-sm font-medium leading-loose focus:outline-none focus:border-brand-primary transition-colors custom-scrollbar"
                />
              </div>
            </div>
          </section>

          {/* Social Connectivity */}
          <section className="space-y-8 pt-8">
            <div className="flex items-center gap-4">
              <Globe size={20} className="text-brand-primary" />
              <h2 className="font-display text-xl font-bold tracking-tight">社交网络</h2>
              <div className="h-[1px] flex-1 bg-border/50" />
            </div>

            <div className="space-y-8">
              {[
                { name: 'github', label: 'GitHub 主页', placeholder: 'GITHUB.COM/USERNAME' },
                { name: 'twitter', label: 'Twitter 账号', placeholder: 'TWITTER.COM/USERNAME' },
                { name: 'linkedin', label: 'LinkedIn 主页', placeholder: 'LINKEDIN.COM/IN/USERNAME' }
              ].map((social) => (
                <div key={social.name} className="flex items-center gap-8 group">
                  <div className="w-32 hidden md:block">
                     <label className="text-[0.6rem] font-bold text-muted-foreground tracking-widest uppercase">{social.label}</label>
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      name={social.name} 
                      value={formData[social.name]} 
                      onChange={handleChange} 
                      placeholder={social.placeholder}
                      className="w-full bg-transparent border-b border-border py-3 text-xs font-bold tracking-widest focus:outline-none focus:border-brand-primary transition-colors placeholder:opacity-20"
                    />
                    <LinkIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/20 group-focus-within:text-brand-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
