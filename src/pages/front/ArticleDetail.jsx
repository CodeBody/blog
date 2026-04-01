import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, Calendar, Eye, Heart, Bookmark } from 'lucide-react';
import { useBlog } from '../../context/BlogContext';
import { formatDate } from '../../utils';
import { Button } from '../../components/common/Button';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles } = useBlog();
  const [article, setArticle] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const found = articles.find(a => a.id === id && a.status === 'published');
    if (found) {
      setArticle(found);
    } else {
      navigate('/404');
    }
  }, [id, articles, navigate]);

  if (!article) return <div className="animate-pulse space-y-4 max-w-3xl mx-auto mt-12"><div className="h-4 bg-muted w-1/4 rounded"></div><div className="h-10 bg-muted w-3/4 rounded"></div><div className="h-64 bg-muted w-full rounded"></div></div>;

  return (
    <article className="max-w-3xl mx-auto px-6 lg:px-8 w-full pt-32 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group">
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to latest insights
        </Link>
        
        <div className="flex gap-2 mb-6">
          {article.tags.map(tag => (
            <span key={tag} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary/10 text-primary border-transparent uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        {article.coverImage && (
          <div className="w-full aspect-video sm:aspect-[2/1] rounded-2xl overflow-hidden mb-10 border border-border shadow-md bg-muted relative group">
            <img src={article.coverImage} alt={article.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
          </div>
        )}

        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-[800] tracking-[-0.02em] leading-tight mb-8">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border py-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={16} />
            <span>{article.views.toLocaleString()} views</span>
          </div>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
      </div>

      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center sm:flex-row flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Enjoyed this article? Leave a like or save it for later.
        </p>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => setLiked(!liked)}
            className={`rounded-full transition-all ${liked ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700' : 'hover:text-red-600'}`}
          >
            <Heart size={20} className={`mr-2 ${liked ? 'fill-current' : ''}`} />
            {liked ? 'Liked' : 'Like'}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setSaved(!saved)}
            className={`rounded-full transition-all ${saved ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' : ''}`}
          >
            <Bookmark size={20} className={`mr-2 ${saved ? 'fill-current' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </article>
  );
}
