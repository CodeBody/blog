import React from 'react';
import { useBlog } from '../../context/BlogContext';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  FileText, 
  CheckCircle2, 
  Eye, 
  TrendingUp, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

export default function Dashboard() {
  const { articles, categories } = useBlog();

  // Stats calculation
  const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.length - publishedCount;

  // Chart Data: Articles per Category
  const categoryData = categories.map(cat => ({
    name: cat.name,
    value: articles.filter(a => String(a.categoryId) === String(cat.id)).length
  })).filter(d => d.value > 0);

  // Mock Trend Data (Articles created over last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const trendData = last7Days.map(date => ({
    date: date.split('-').slice(1).join('/'),
    views: Math.floor(Math.random() * 500) + 100, // Mocked for demo
    articles: (articles || []).filter(a => a.date?.startsWith(date)).length
  }));

  const COLORS = ['#6366F1', '#A855F7', '#EC4899', '#3B82F6'];

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-display font-black tracking-tight mb-2 text-gradient">控制台</h1>
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] opacity-40">System Overview & Live Insights</p>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '文章总数', value: (articles || []).length, icon: <FileText size={20}/>, trend: '+12% 从上月' },
          { label: '已发布内容', value: (articles || []).filter(a => a.status === 'published').length, icon: <CheckCircle2 size={20}/>, trend: '稳定运行中' },
          { label: '全站累计访问', value: totalViews.toLocaleString(), icon: <Eye size={20}/>, trend: '+8.4% 增长' },
          { label: '草稿箱', value: (articles || []).length - (articles || []).filter(a => a.status === 'published').length, icon: <BarChart3 size={20}/>, trend: '待发布内容' }
        ].map((stat, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative glass-card rounded-3xl p-6 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                {stat.icon}
              </div>
              <span className="text-[0.6rem] font-black text-emerald-500 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-display font-black tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Trend Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="xl:col-span-2 glass-card rounded-[2.5rem] p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl font-black tracking-tight">流量趋势</h2>
              <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-50">实时系统访问动态数据</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-primary">
              <TrendingUp size={16} />
              <span className="text-[0.6rem] font-black uppercase tracking-wider">实时更新</span>
            </div>
          </div>
          <div className="h-[320px] w-full pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                   <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15}/>
                     <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '1rem', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#6366F1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-card rounded-[2.5rem] p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-black tracking-tight">分类分布</h2>
              <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-50">内容权重饼图</p>
            </div>
            <Layers size={20} className="text-muted-foreground opacity-30" />
          </div>
          <div className="h-[300px] w-full flex flex-col items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '1rem' }}
                     itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center opacity-20 py-12">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.2em]">无分类动态数据</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full mt-2">
              {categoryData.slice(0, 4).map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2 overflow-hidden">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-tight truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity List */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="glass-card rounded-[2.5rem] overflow-hidden"
      >
        <div className="px-10 py-8 border-b border-border/40 flex items-center justify-between bg-muted/10">
          <div>
            <h2 className="font-display text-2xl font-black tracking-tight">近期创作</h2>
            <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-50">Latest Editorial Updates</p>
          </div>
          <button className="px-5 py-2 rounded-xl bg-background border border-border/50 text-[0.65rem] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            全部内容 <ArrowUpRight size={14} strokeWidth={2.5} />
          </button>
        </div>
        <div className="divide-y divide-border/20 px-4">
          {articles.slice(0, 5).map((article, idx) => (
            <motion.div 
              key={article.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + (idx * 0.1) }}
              className="px-6 py-6 hover:bg-muted/5 transition-all duration-500 group rounded-3xl"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors truncate">{article.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest font-black opacity-30">
                      {new Date(article.date).toLocaleDateString('cn-ZH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="flex items-center gap-1 text-[0.65rem] font-black text-muted-foreground/30">
                       <Eye size={12} /> {article.views} 访问
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[0.55rem] font-black uppercase tracking-[0.1em] shadow-sm ${article.status === 'published' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                  {article.status === 'published' ? '已发布' : '草稿'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
