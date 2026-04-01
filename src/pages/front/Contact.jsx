import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { FaGithub as Github, FaTwitter as Twitter, FaLinkedin as Linkedin } from 'react-icons/fa';

export default function Contact() {
  const { profile } = useBlog();
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate network request
    setTimeout(() => {
      setStatus('success');
      e.target.reset();
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 lg:px-8 w-full animate-in fade-in slide-in-from-bottom-6 duration-700 ease-in-out">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left Column: Intro & Socials */}
        <div className="space-y-12">
          <div>
            <h1 className="font-display text-[clamp(3rem,6vw,5rem)] font-[800] tracking-tight leading-tight mb-6">
              Let's <span className="text-transparent bg-clip-text bg-[image:var(--gradient-brand)]">connect.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              I'm currently available for freelance, innovative open-source projects, and discussing the future of AI interfaces. 
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-tight uppercase text-muted-foreground">Find me across the web</h3>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {profile?.socials?.github && (
                <a href={profile.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border/50 hover:border-brand-primary hover:text-brand-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-glow group">
                  <Github size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">GitHub</span>
                </a>
              )}
              {profile?.socials?.twitter && (
                <a href={profile.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border/50 hover:border-[#1DA1F2] hover:text-[#1DA1F2] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(29,161,242,0.2)] group">
                  <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Twitter</span>
                </a>
              )}
              {profile?.socials?.linkedin && (
                <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border/50 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(10,102,194,0.2)] group">
                  <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">LinkedIn</span>
                </a>
              )}
            </div>
            
            <div className="pt-6 flex items-center gap-4 text-muted-foreground">
               <Mail size={20} />
               <a href="mailto:hello@example.com" className="font-medium hover:text-foreground transition-colors">hello@example.com</a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-8 sm:p-10 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-5 transition-opacity duration-1000 pointer-events-none" />
          
          <h2 className="text-2xl font-display font-bold mb-8">Send a message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</label>
              <input 
                id="name"
                type="text" 
                required
                className="w-full px-5 py-4 rounded-xl border border-border/50 bg-background/50 focus:bg-background focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
              <input 
                id="email"
                type="email" 
                required
                className="w-full px-5 py-4 rounded-xl border border-border/50 bg-background/50 focus:bg-background focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
              <textarea 
                id="message"
                required
                rows="4"
                className="w-full px-5 py-4 rounded-xl border border-border/50 bg-background/50 focus:bg-background focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none resize-none"
                placeholder="How can I help you?"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={status === 'submitting' || status === 'success'}
              className="w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 text-white shadow-glow transition-all disabled:opacity-70 disabled:cursor-not-allowed bg-[image:var(--gradient-brand)] hover:opacity-90 active:scale-[0.98]"
            >
              {status === 'idle' && <><Send size={18} /> Send Message</>}
              {status === 'submitting' && <span className="animate-pulse">Sending...</span>}
              {status === 'success' && <><CheckCircle2 size={18} /> Message Sent!</>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
