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
    <div className="space-y-10 pb-32">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6"
      >
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight mb-2 text-gradient">系统偏好</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] opacity-40">Identity & Digital Presence</p>
        </div>
        <button 
          onClick={handleSubmit} 
          className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-primary text-primary-foreground shadow-primary/20 hover:scale-105 active:scale-95'}`}
        >
          {isSaved ? <Check size={18} strokeWidth={3} /> : <Save size={18} strokeWidth={2.5} />}
          {isSaved ? 'PREFERENCES SAVED' : 'SAVE CHANGES'}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        {/* Left Side: Identity Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-4"
        >
          <div className="glass-card p-10 rounded-[3rem] flex flex-col items-center text-center space-y-8 sticky top-32 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl group-hover:bg-primary/30 transition-all duration-700" />
              <div className="w-44 h-44 rounded-[3rem] border-4 border-background overflow-hidden bg-muted/20 relative z-10 p-1.5 shadow-2xl">
                <img 
                  src={formData.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Admin"} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover rounded-[2.5rem] transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm rounded-[2.5rem]">
                  <Camera size={28} className="text-white" />
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-2xl border-4 border-background z-20">
                <AtSign size={18} strokeWidth={3} />
              </div>
            </div>
            
            <div className="space-y-2 relative z-10 w-full">
              <h3 className="font-display text-3xl font-black tracking-tighter truncate group-hover:text-primary transition-colors">{formData.name || 'Anonymous User'}</h3>
              <p className="text-[0.65rem] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-30 mt-1 italic">Living Visual Identity</p>
            </div>
            
            <div className="w-16 h-1 rounded-full bg-primary/10 mx-auto" />
            
            <p className="text-xs font-semibold text-muted-foreground/60 leading-loose italic px-6 tracking-tight relative z-10">
              "{formData.bio || 'Your story begins here. Write a bio that resonates with your vision and philosophy.'}"
            </p>
          </div>
        </motion.div>

        {/* Right Side: Configuration Blocks */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-8 space-y-12"
        >
          {/* Identity Block */}
          <section className="glass-card p-10 rounded-[3rem] space-y-10 border-border/20 shadow-xl">
            <div className="flex items-center gap-4 border-b border-border/30 pb-6">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <User size={20} strokeWidth={2.5} />
              </div>
              <h2 className="font-display text-2xl font-black tracking-tight">Core Identity</h2>
              <div className="h-[1px] flex-1 bg-border/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[0.65rem] font-black text-muted-foreground/40 tracking-[0.2em] uppercase">Display Denomination</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="e.g. Alex Summer"
                  className="w-full bg-muted/20 border-b-2 border-border/50 focus:border-primary py-3 text-xl font-black tracking-tight focus:outline-none transition-all placeholder:opacity-5"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[0.65rem] font-black text-muted-foreground/40 tracking-[0.2em] uppercase">Visual Artifact (URL)</label>
                <input 
                  name="avatar" 
                  value={formData.avatar} 
                  onChange={handleChange} 
                  placeholder="HTTPS://CLOUDFRONT.NET/AVATAR.PNG"
                  className="w-full bg-muted/20 border-b-2 border-border/50 focus:border-primary py-3 text-sm font-bold tracking-tight focus:outline-none transition-all placeholder:opacity-5"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-[0.65rem] font-black text-muted-foreground/40 tracking-[0.2em] uppercase">Personal Manifest / Bio</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  placeholder="Share the philosophy behind your digital footprint..."
                  className="w-full bg-muted/20 border-2 border-border/50 rounded-[2rem] p-6 h-40 text-xs font-semibold leading-relaxed focus:outline-none focus:border-primary transition-all custom-scrollbar shadow-inner placeholder:opacity-10"
                />
              </div>
            </div>
          </section>

          {/* Social Block */}
          <section className="glass-card p-10 rounded-[3rem] space-y-10 border-border/20 shadow-xl">
            <div className="flex items-center gap-4 border-b border-border/30 pb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Globe size={20} strokeWidth={2.5} />
              </div>
              <h2 className="font-display text-2xl font-black tracking-tight">Social Convergence</h2>
              <div className="h-[1px] flex-1 bg-border/20" />
            </div>

            <div className="space-y-8 px-2">
              {[
                { name: 'github', label: 'GitHub Ecosystem', placeholder: 'GITHUB.COM/USERNAME', icon: <Github size={18} /> },
                { name: 'twitter', label: 'Twitter Node', placeholder: 'TWITTER.COM/USERNAME', icon: <AtSign size={18} /> },
                { name: 'linkedin', label: 'LinkedIn Linkage', placeholder: 'LINKEDIN.COM/IN/USERNAME', icon: <LinkIcon size={18} /> }
              ].map((social) => (
                <div key={social.name} className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 group">
                  <div className="w-40 shrink-0 flex items-center gap-3">
                     <div className="text-muted-foreground/30 group-focus-within:text-indigo-500 transition-colors">
                        {social.icon}
                     </div>
                     <label className="text-[0.6rem] font-black text-muted-foreground/40 tracking-[0.15em] uppercase">{social.label}</label>
                  </div>
                  <div className="flex-1 w-full relative">
                    <input 
                      name={social.name} 
                      value={formData[social.name]} 
                      onChange={handleChange} 
                      placeholder={social.placeholder}
                      className="w-full bg-transparent border-b-2 border-border/30 py-3 text-xs font-bold tracking-[0.1em] focus:outline-none focus:border-indigo-500 transition-all placeholder:opacity-5 uppercase"
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-all">
                       <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-glow shadow-indigo-500/50" />
                    </div>
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
