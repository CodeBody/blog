import React, { useState, useEffect } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { FaGithub as Github } from 'react-icons/fa';
import { Pagination } from '../../components/common/Pagination';

const mockProjects = [
  {
    id: 1,
    title: 'AI Markdown Editor',
    description: 'A beautifully designed, local-first markdown editor with built-in AI completion and dark mode support.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'OpenAI'],
    github: '#',
    demo: '#',
    color: 'from-blue-500/20 to-purple-500/20'
  },
  {
    id: 2,
    title: 'Glassmorphism UI Kit',
    description: 'A comprehensive collection of accessible, modern UI components tailored for atmospheric web applications.',
    tags: ['Next.js', 'Framer Motion', 'Radix UI'],
    github: '#',
    demo: '#',
    color: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    id: 3,
    title: 'Blog CMS Platform',
    description: 'A minimalist headless CMS blog powered by React and Markdown, entirely client-side rendered for edge deployments.',
    tags: ['React Router', 'MDX', 'Tailwind CSS'],
    github: '#',
    demo: '#',
    color: 'from-orange-500/20 to-red-500/20'
  },
  {
    id: 4,
    title: 'Atmospheric Dashboard',
    description: 'An expansive and premium web dashboard with glassmorphic cards, data visualizations, and glowing effects.',
    tags: ['React', 'CSS3', 'Recharts'],
    github: '#',
    demo: '#',
    color: 'from-gray-500/20 to-slate-500/20'
  },
  ...Array.from({ length: 32 }).map((_, i) => ({
    id: i + 5,
    title: `Experimental Concept ${i + 1}`,
    description: `A highly conceptual side project exploring new rendering patterns in web technologies. Iteration #${i + 1} focused on performance limits.`,
    tags: ['WebGL', 'Rust', 'Wasm', 'Vite'],
    github: '#',
    demo: '#',
    color: 'from-muted/20 to-border/30'
  }))
];

export default function Projects() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery]);

  const filteredProjects = mockProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const displayedProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 lg:px-8 w-full animate-in fade-in slide-in-from-bottom-6 duration-700 ease-in-out">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] font-[800] tracking-tight leading-tight mb-6">
            Selected <span className="text-transparent bg-clip-text bg-[image:var(--gradient-brand)]">Projects.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A collection of things I've built. Ranging from tiny experimental tools to fully-featured open source applications.
          </p>
        </div>
        
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
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
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-muted/50 border border-border/50 text-xs font-semibold rounded-full lowercase tracking-wider text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 mt-auto">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group/link">
                  <Github size={18} className="group-hover/link:-translate-y-0.5 transition-transform" /> Repository
                </a>
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-primary transition-colors group/link">
                  <ExternalLink size={18} className="group-hover/link:-translate-y-0.5 transition-transform" /> Live Demo
                </a>
              </div>
            </div>
          </div>
        ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 border border-border/50 rounded-3xl">
          <p className="text-lg text-muted-foreground">No projects found matching "{searchQuery}"</p>
        </div>
      )}

      {filteredProjects.length > 0 && (
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
