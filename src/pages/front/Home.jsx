import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlog } from '../../context/BlogContext';
import { formatDate } from '../../utils';
import { Pagination } from '../../components/common/Pagination';
import { Search } from 'lucide-react';

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const textReveal = {
  hidden: { y: "120%", rotateZ: 2, opacity: 0 },
  show: { 
    y: "0%", 
    rotateZ: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 20, mass: 1 } 
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

const ArticleCard = ({ article, index }) => (
  <motion.article 
    key={article.id} 
    initial={{ opacity: 0, y: 50, rotateX: 5 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay: (index % 3) * 0.15, ease: [0.16, 1, 0.3, 1] }}
    className="group flex flex-col bg-background-secondary border border-border rounded-xl flex-hidden overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-2"
  >
    <Link to={`/article/${article.id}`} className="block relative w-full pt-[65%] overflow-hidden border-b border-border">
      <motion.img 
        src={article.coverImage || `https://images.unsplash.com/photo-${1500000000000 + (parseInt(article.id) * 1234 || 1)}?auto=format&fit=crop&w=800&q=80`} 
        alt={article.title}
        onError={(e) => {
          e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${article.id}&backgroundColor=ffffff,f7f7f7&textColor=1a1a1a`;
        }}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-500 pointer-events-none"></div>
      {article.categoryName && (
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 text-xs font-sans tracking-widest border border-border rounded-sm">
          {article.categoryName}
        </div>
      )}
    </Link>
    
    <div className="flex-1 flex flex-col p-7">
      <div className="flex justify-between items-center text-[0.8rem] text-muted-foreground tracking-widest font-sans mb-4 border-b border-border pb-3">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span>{Math.ceil(article.content.length / 1000)} MIN READ</span>
      </div>
      
      <h3 className="font-display text-[1.3rem] font-bold mb-3 leading-[1.4] tracking-wider relative">
        <Link to={`/article/${article.id}`} className="hover:text-brand-primary transition-colors">
          {article.title}
        </Link>
      </h3>
      
      <p className="text-[0.95rem] text-muted-foreground line-clamp-3 leading-loose font-sans font-normal">
        {article.abstract}
      </p>
    </div>
  </motion.article>
);

export default function Home() {
  const location = useLocation();
  const { categoryId } = useParams();
  
  const isAllArticles = location.pathname === '/articles';
  const isCategoryFilter = !!categoryId;
  
  const { articles, categories } = useBlog();
  const [email, setEmail] = useState('');
  
  // Pagination & Search State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    setCurrentPage(1);
    // Reset scroll when searching or navigating
    if (isAllArticles || isCategoryFilter) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchQuery, location.pathname, categoryId]);

  const publishedArticles = articles.filter(a => a.status === 'published').map(a => ({
    ...a,
    categoryName: categories.find(c => String(c.id) === String(a.categoryId))?.name || 'Uncategorized'
  }));
  
  const filteredArticles = isAllArticles || isCategoryFilter
    ? publishedArticles.filter(a => {
        if (categoryId && a.categoryId !== categoryId) return false;
        
        if (searchQuery) {
          return a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 a.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return true;
      })
    : publishedArticles;

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const displayedArticles = isAllArticles || isCategoryFilter
    ? filteredArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : publishedArticles.slice(0, 6);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`订阅成功！已将 ${email} 加入列表。`);
    setEmail('');
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      {!isAllArticles && !isCategoryFilter && (
      <section className="min-h-screen flex flex-col justify-center relative pt-20 pb-16 overflow-hidden">
        
        {/* Artistic Atmospheric Background Image with Cinematic Scale */}
        <div className="absolute top-0 right-0 w-full lg:w-3/5 h-full z-0 select-none pointer-events-none mix-blend-multiply opacity-80 dark:opacity-30 overflow-hidden">
          <motion.img 
            initial={{ scale: 1.5, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2600&auto=format&fit=crop" 
            alt="Mountains" 
            className="w-full h-full object-cover"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)'
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full relative z-10 flex flex-col items-start">
          <div className="border-l-[3px] border-foreground pl-8 max-w-4xl relative">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: "3rem" }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-[-3px] w-[3px] bg-brand-primary"
            ></motion.div>
            
            <motion.h1 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="font-display text-[clamp(2.8rem,5vw,5rem)] font-bold tracking-[0.05em] leading-[1.3] mb-8 text-foreground"
            >
              <div className="overflow-hidden pb-2">
                <motion.div variants={textReveal} className="origin-bottom-left">构建优雅的</motion.div>
              </div>
              <div className="overflow-hidden pb-4">
                <motion.div variants={textReveal} className="origin-bottom-left">数字体验。</motion.div>
              </div>
            </motion.h1>
            
            <motion.div 
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-[clamp(1rem,1.5vw,1.15rem)] text-muted-foreground font-sans font-normal max-w-xl mb-12 flex flex-col gap-3 leading-[1.8] tracking-widest transition-colors duration-500"
            >
              <p>你好，我是 夏了个天。</p>
              <p>一名深耕于代码与设计交汇处的独立开发者。在这里记录技术实践、审美反思，以及对于数字世界的种种思考。</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <a href="#articles" className="btn-primary" onClick={(e) => {
                 e.preventDefault();
                 document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
              }}>
                阅读笔记
              </a>
              <a href="#newsletter" className="btn-secondary" onClick={(e) => {
                 e.preventDefault();
                 document.getElementById('newsletter').scrollIntoView({ behavior: 'smooth' });
              }}>
                建立联系
              </a>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* Articles Section */}
      <section id="articles" className={`py-24 relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full ${(isAllArticles || isCategoryFilter) ? 'pt-32' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap sm:flex-nowrap justify-between items-end border-b-2 border-foreground pb-6 mb-16 gap-6"
        >
          <h2 className="font-display text-[2rem] font-bold tracking-[0.1em]">
            {isCategoryFilter 
              ? `分类群像: ${categories?.find(c => String(c.id) === categoryId)?.name || ''}` 
              : (isAllArticles ? '全部文章' : '近期更新')}
          </h2>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {(isAllArticles || isCategoryFilter) && (
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-all rounded-none tracking-wider font-sans"
                />
              </div>
            )}
            
            {!(isAllArticles || isCategoryFilter) ? (
              <Link to="/articles" className="text-muted-foreground font-sans font-medium hover:text-foreground transition-colors whitespace-nowrap mb-1 tracking-widest text-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-foreground hover:after:w-full after:transition-all after:duration-300">
                浏览全部专栏 →
              </Link>
            ) : (
              <Link to="/" className="text-muted-foreground font-sans font-medium hover:text-foreground transition-colors whitespace-nowrap mb-1 tracking-widest text-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-foreground hover:after:w-full after:transition-all after:duration-300">
                ← 返回首页
              </Link>
            )}
          </div>
        </motion.div>

        {isAllArticles ? (
          /* Grouped by Category View */
          <div className="space-y-24">
            {categories.map((category) => {
              const categoryArticles = filteredArticles.filter(
                (a) => String(a.categoryId) === String(category.id)
              );
              
              if (categoryArticles.length === 0) return null;

              return (
                <div key={category.id} className="space-y-10">
                  <div className="flex items-center gap-4">
                    <h3 className="font-display text-[1.5rem] font-bold tracking-[0.15em] text-foreground border-l-4 border-brand-primary pl-4">
                      {category.name}
                    </h3>
                    <div className="h-[1px] flex-1 bg-border/50"></div>
                    <span className="text-xs font-sans tracking-widest text-muted-foreground uppercase">
                      {categoryArticles.length} Articles
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                    {categoryArticles.map((article, index) => (
                      <ArticleCard key={article.id} article={article} index={index} />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {filteredArticles.length === 0 && (
              <div className="text-center py-20 text-muted-foreground text-lg tracking-widest font-sans">
                未找到相关内容。
              </div>
            )}
          </div>
        ) : (
          /* Original Flat Grid View (Recent Updates or Category Filter) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {displayedArticles.length > 0 ? displayedArticles.map((article, index) => (
               <ArticleCard key={article.id} article={article} index={index} />
            )) : (
              <div className="col-span-full text-center py-20 text-muted-foreground text-lg tracking-widest font-sans">
                未找到相关内容。
              </div>
            )}
          </div>
        )}

        {isAllArticles && filteredArticles.length > 0 && searchQuery === '' && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 border-t border-border pt-12"
          >
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          </motion.div>
        )}
      </section>

      {/* Newsletter Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        id="newsletter" 
        className="py-24 max-w-6xl mx-auto px-6 lg:px-8 w-full mt-12 border-t border-border"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display text-[2rem] font-bold tracking-[0.1em] mb-5">订阅更新</h2>
            <p className="text-muted-foreground text-[1.05rem] font-sans leading-loose tracking-wider">
              第一时间获取技术探讨与设计随想。<br/>坚守极简主义，绝无冗余邮件。
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex-1 flex w-full max-w-md gap-0 shadow-sm">
             <input 
              type="email" 
              placeholder="YOUR.EMAIL@EXAMPLE.COM" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              aria-label="Email Address"
              className="flex-1 px-5 py-4 border border-border border-r-0 bg-transparent text-foreground tracking-widest font-sans text-sm placeholder:text-muted focus:outline-none focus:border-foreground transition-colors duration-300 rounded-none uppercase"
            />
            <button type="submit" className="px-8 py-4 bg-foreground text-background font-sans font-medium tracking-[0.2em] text-sm uppercase focus:outline-none hover:bg-brand-primary hover:text-white border border-foreground transition-all duration-300 whitespace-nowrap">
              立即接入
            </button>
          </form>
        </div>
      </motion.section>
    </div>
  );
}
