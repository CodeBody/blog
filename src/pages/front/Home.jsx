import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlog } from '../../context/BlogContext';
import { formatDate } from '../../utils';
import { Pagination } from '../../components/common/Pagination';
import { Search, FileText } from 'lucide-react';

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
    className="group flex flex-col bg-background-secondary border border-border rounded-xl flex-hidden overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
  >
    <div className="flex-1 flex flex-col p-7">
      <div className="flex justify-between items-center text-[0.8rem] text-muted-foreground tracking-widest font-sans mb-4 border-b border-border pb-3">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span>{Math.ceil(article.content.length / 1000)} 分钟阅读</span>
      </div>
      
      <h3 className="font-display text-[1.3rem] font-bold mb-3 leading-[1.4] tracking-wider relative">
        <Link to={`/article/${article.id}`} className="hover:text-brand-primary transition-colors">
          {article.title}
        </Link>
      </h3>
      
      <p className="text-[0.95rem] text-muted-foreground line-clamp-3 leading-loose font-sans font-normal">
        {article.content.replace(/[#*`]/g, '').substring(0, 150)}...
      </p>
    </div>
  </motion.article>
);

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { articles, totalArticles, categories, fetchArticles, fetchCategories, showToast } = useBlog();
  
  const isAllArticles = location.pathname === '/articles';
  const isCategoryFilter = !!categoryId;

  const [email, setEmail] = useState('');
  
  // Pagination & Search State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 9;
  const totalPages = isAllArticles || isCategoryFilter
    ? Math.ceil(totalArticles / ITEMS_PER_PAGE)
    : 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAllArticles && !isCategoryFilter) {
        // Home page: Only fetch the first 6 for recent updates
        fetchArticles(1, 6);
      } else {
        // All Articles or Category: Fetch with standard size and search query
        fetchArticles(currentPage, ITEMS_PER_PAGE, categoryId, searchQuery);
      }
    }, 300);
    fetchCategories();
    return () => clearTimeout(timer);
  }, [location.pathname, categoryId, currentPage, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
    // Reset scroll when searching or navigating
    if (isAllArticles || isCategoryFilter) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchQuery, location.pathname, categoryId]);

  const displayedArticles = articles.map(a => ({
    ...a,
    categoryName: categories.find(c => String(c.id) === String(a.categoryId))?.name || 'Uncategorized'
  }));

  const handleSubscribe = (e) => {
    e.preventDefault();
    showToast(`订阅成功！已将 ${email} 加入列表。`, 'success');
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
            src="/assets/images/hero-mountains.jpg" 
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

        {(isAllArticles || isCategoryFilter) && (
          <div className="mb-12 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-center gap-3 min-w-max">
              <button
                onClick={() => navigate('/articles')}
                className={`px-6 py-2 border rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                  !categoryId 
                    ? 'bg-foreground text-background border-foreground shadow-[4px_4px_0_rgba(0,0,0,0.1)]' 
                    : 'bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground'
                }`}
              >
                全部 <span className="ml-2 opacity-40 font-mono italic">{categories.reduce((acc, c) => acc + (c.articleCount || 0), 0)}</span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className={`px-6 py-2 border rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                    String(categoryId) === String(cat.id)
                      ? 'bg-brand-primary text-white border-brand-primary shadow-[4px_4px_0_rgba(var(--brand-primary-rgb),0.2)]'
                      : 'bg-transparent text-muted-foreground border-border hover:border-brand-primary hover:text-brand-primary'
                  }`}
                >
                  {cat.name} <span className="ml-2 opacity-40 font-mono italic">{cat.articleCount || 0}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {displayedArticles.length > 0 ? displayedArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
          )) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full py-32 text-center flex flex-col items-center justify-center gap-8 bg-background-secondary/50 backdrop-blur-md border border-border/60 rounded-[3rem] shadow-premium mt-8"
            >
              <div className="w-24 h-24 rounded-[2.5rem] bg-foreground/5 flex items-center justify-center relative shadow-inner group transition-all duration-500 hover:scale-110 hover:-rotate-6">
                <FileText size={40} className="relative z-10 text-muted-foreground/30 group-hover:text-foreground transition-colors" />
                <div className="absolute inset-0 bg-foreground/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-display font-black uppercase tracking-[0.4em] text-foreground/60">虚位以待</h3>
                <p className="text-sm font-medium text-muted-foreground/40 max-w-sm mx-auto leading-relaxed px-6">
                  {searchQuery 
                    ? `未发现与 "${searchQuery}" 相关的思绪火花，请尝试其他关键词。` 
                    : `暂无相关博文内容，创作者正在酝酿新的灵感。`}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {(isAllArticles || isCategoryFilter) && totalPages > 1 && searchQuery === '' && (
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
              placeholder="您的邮箱地址" 
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
