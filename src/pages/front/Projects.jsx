import React, { useState, useEffect } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { FaGithub as Github } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useBlog } from '../../context/BlogContext';
import { Pagination } from '../../components/common/Pagination';

export default function Projects() {
  const { projects, totalProjects, fetchProjects, loading } = useBlog();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects(currentPage, ITEMS_PER_PAGE, searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery]);

  const totalPages = Math.ceil(totalProjects / ITEMS_PER_PAGE);
  const displayedProjects = projects;


  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 lg:px-8 w-full animate-in fade-in slide-in-from-bottom-6 duration-700 ease-in-out">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] font-[800] tracking-tight leading-tight mb-6">
            精选 <span className="text-transparent bg-clip-text bg-[image:var(--gradient-brand)]">项目.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            我构建的项目合集，从实验性小工具到全功能开源应用。
          </p>
        </div>
        
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card/50 backdrop-blur-md border border-border/60 shadow-sm rounded-2xl text-[0.95rem] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
          />
        </div>
      </div>

      {displayedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedProjects.map((project, index) => (
          <div 
            key={project.id} 
            className="group relative flex flex-col bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-glow"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Soft background gradient fill */}
            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            
            <div className="p-8 flex-1 relative z-10 flex flex-col">
              <h3 className="text-2xl font-bold font-display mb-3 group-hover:text-brand-primary transition-colors">{project.title}</h3>
              <p className="text-muted-foreground leading-relaxed flex-1 mb-8">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags && project.tags.split(',').map(tag => (
                  <span key={tag} className="px-3 py-1 bg-muted/50 border border-border/50 text-xs font-semibold rounded-full lowercase tracking-wider text-muted-foreground">
                    {tag.trim()}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 mt-auto">
                <a href={project.githubUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group/link">
                  <Github size={18} className="group-hover/link:-translate-y-0.5 transition-transform" /> 代码仓库
                </a>
                <a href={project.demoUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-primary transition-colors group/link">
                  <ExternalLink size={18} className="group-hover/link:-translate-y-0.5 transition-transform" /> 在线演示
                </a>
              </div>
            </div>
          </div>
        ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-32 text-center flex flex-col items-center justify-center gap-8 bg-card/30 backdrop-blur-md border border-border/40 rounded-[3rem] shadow-premium"
        >
          <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center relative shadow-inner group transition-all duration-500 hover:scale-110 hover:rotate-6">
            <Search size={40} className="relative z-10 text-primary/40 group-hover:text-primary transition-colors" />
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-display font-black uppercase tracking-[0.4em] text-foreground/60">未发现项目</h3>
            <p className="text-sm font-medium text-muted-foreground/40 max-w-xs mx-auto leading-relaxed">
              {searchQuery 
                ? `尝试更换搜索关键词，寻找其他灵感空间` 
                : `该领域尚待探索，新项目即将在此启航`}
            </p>
          </div>
        </motion.div>
      )}

      {projects.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
