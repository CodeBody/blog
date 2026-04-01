import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { formatDate } from '../../utils';
import { Pagination } from '../../components/common/Pagination';
import { Search } from 'lucide-react';

export default function Home() {
  const location = useLocation();
  const isAllArticles = location.pathname === '/articles';
  
  const { articles } = useBlog();
  const [email, setEmail] = useState('');
  
  // Pagination & Search State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    setCurrentPage(1);
    // Reset scroll when searching or navigating
    if (isAllArticles) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchQuery, location.pathname]);

  const publishedArticles = articles.filter(a => a.status === 'published');
  
  const filteredArticles = isAllArticles 
    ? publishedArticles.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : publishedArticles;

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const displayedArticles = isAllArticles 
    ? filteredArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : publishedArticles.slice(0, 6);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed ${email} successfully!`);
    setEmail('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-in-out">
      {/* Hero Section */}
      {!isAllArticles && (
      <section className="min-h-screen flex flex-col justify-center relative pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-3xl">
          <h1 className="font-display text-[clamp(3.5rem,8vw,6rem)] font-[800] tracking-[-0.02em] leading-[1.1] mb-6">
            Crafting digital <br />
            <span className="gradient-text pb-2">experiences.</span>
          </h1>
          <p className="text-[clamp(1.1rem,2vw,1.4rem)] text-muted-foreground font-normal max-w-2xl mb-10 leading-relaxed">
            Hi, I'm Alex. A passionate developer writing about coding, design, and everything in between.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#articles" className="btn-primary" onClick={(e) => {
               e.preventDefault();
               document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
            }}>
              Read my thoughts
            </a>
            <a href="#newsletter" className="btn-secondary" onClick={(e) => {
               e.preventDefault();
               document.getElementById('newsletter').scrollIntoView({ behavior: 'smooth' });
            }}>
              Get in touch
            </a>
          </div>
        </div>
        </div>
        
        {/* Glow Effects Background */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 bg-[radial-gradient(circle,var(--brand-primary)_0%,transparent_70%)] animate-float"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-40 bg-[radial-gradient(circle,var(--brand-secondary)_0%,transparent_70%)] animate-float [animation-delay:-5s]"></div>
        </div>
      </section>
      )}

      {/* Articles Section */}
      <section id="articles" className={`py-24 relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full ${isAllArticles ? 'pt-32' : ''}`}>
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-end border-b border-border pb-4 mb-12 gap-6">
          <h2 className="font-display text-[2.5rem] font-bold tracking-tight">
            {isAllArticles ? 'All Articles' : 'Latest Updates'}
          </h2>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {isAllArticles && (
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-muted/30 border border-border rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                />
              </div>
            )}
            
            {!isAllArticles ? (
              <Link to="/articles" className="text-brand-secondary font-medium text-[0.95rem] hover:text-brand-primary hover:underline transition-colors whitespace-nowrap mb-1">
                View all articles →
              </Link>
            ) : (
              <Link to="/" className="text-brand-secondary font-medium text-[0.95rem] hover:text-brand-primary hover:underline transition-colors whitespace-nowrap mb-1">
                ← Back to Home
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayedArticles.length > 0 ? displayedArticles.map((article, index) => (
             <article 
              key={article.id} 
              className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden transition-all duration-bounce hover:-translate-y-2 hover:border-border-hover hover:shadow-md"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={`/article/${article.id}`} className="block relative w-full pt-[60%] overflow-hidden">
                {/* Uploaded cover or fallback pattern */}
                <img 
                  src={article.coverImage || `https://images.unsplash.com/photo-${1500000000000 + (parseInt(article.id) * 1234 || 1)}?auto=format&fit=crop&w=800&q=80`} 
                  alt={article.title}
                  onError={(e) => {
                    // Fallback to random pattern generator if unsplash fails mapping
                    e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${article.id}&backgroundColor=0a0a0c,131316`;
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-bounce group-hover:scale-105"
                  loading="lazy"
                />
                {article.tags[0] && (
                  <div className="absolute top-4 left-4 bg-[#0a0a0c]/70 backdrop-blur-md text-white px-3 py-1 text-xs font-semibold tracking-wider uppercase border border-white/10 rounded-full">
                    {article.tags[0]}
                  </div>
                )}
              </Link>
              
              <div className="p-7 flex-1 flex flex-col">
                <div className="flex gap-4 text-[0.85rem] text-muted mb-3 font-medium">
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                  <span>{Math.ceil(article.content.length / 1000)} min read</span>
                </div>
                
                <h3 className="font-display text-[1.3rem] font-bold mb-3 leading-snug">
                  <Link to={`/article/${article.id}`} className="bg-[image:linear-gradient(var(--text-primary),var(--text-primary))] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px] hover:text-foreground">
                    {article.title}
                  </Link>
                </h3>
                
                <p className="text-[0.95rem] text-muted-foreground line-clamp-3 leading-relaxed">
                  {article.abstract}
                </p>
              </div>
            </article>
          )) : (
            <div className="col-span-full text-center py-20 text-muted-foreground text-lg">
              No articles found.
            </div>
          )}
        </div>

        {isAllArticles && filteredArticles.length > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-24 max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <div className="bg-glass backdrop-blur-xl border border-border rounded-2xl relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between p-12 lg:p-16 gap-10">
          <div className="absolute inset-0 bg-[image:var(--gradient-glow)] pointer-events-none"></div>
          
          <div className="flex-1 relative z-10 text-center md:text-left">
            <h2 className="font-display text-[2rem] font-bold tracking-tight mb-2">Stay in the loop</h2>
            <p className="text-muted-foreground text-[1.05rem]">
              Get occasional emails about new articles, side projects, and tech insights. No spam, ever.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex-1 relative z-10 flex w-full max-w-md gap-3">
             <input 
              type="email" 
              placeholder="alex@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              aria-label="Email Address"
              className="flex-1 px-6 py-4 rounded-lg border border-border bg-background text-foreground tracking-wide font-medium placeholder:text-muted focus:outline-none focus:border-brand-primary transition-colors duration-300"
            />
            <button type="submit" className="btn-primary translate-y-0 h-auto">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
