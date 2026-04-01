import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { Plus, Edit3, Trash2, Eye, Search, AlertCircle, BarChart3, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { formatDate } from '../../utils';

export default function Dashboard() {
  const { articles, deleteArticle } = useBlog();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      deleteArticle(id);
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleBatchDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} articles?`)) {
      selectedIds.forEach(id => deleteArticle(id));
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(a => a.id));
    }
  };

  // Calculate Stats
  const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
  const publishedCount = articles.filter(a => a.status === 'published').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Overview</h1>
          <p className="text-muted-foreground text-sm">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedIds.length > 0 && (
            <Button variant="danger" onClick={handleBatchDelete} className="whitespace-nowrap flex-1 sm:flex-none shadow-lg shadow-red-500/20">
              <Trash2 size={16} className="mr-2" />
              Delete ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => navigate('/admin/article/new')} className="whitespace-nowrap flex-1 sm:flex-none shadow-glow">
            <Plus size={16} className="mr-2" />
            New Article
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><FileText size={48} /></div>
           <CardContent className="p-6">
             <p className="text-sm font-medium text-muted-foreground mb-1">Total Articles</p>
             <h3 className="text-3xl font-bold font-display">{articles.length}</h3>
           </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 text-emerald-500 opacity-10 group-hover:opacity-20 transition-opacity"><CheckCircle2 size={48} /></div>
           <CardContent className="p-6">
             <p className="text-sm font-medium text-muted-foreground mb-1">Published</p>
             <h3 className="text-3xl font-bold font-display text-emerald-600 dark:text-emerald-400">{publishedCount}</h3>
           </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 text-brand-primary opacity-10 group-hover:opacity-20 transition-opacity"><BarChart3 size={48} /></div>
           <CardContent className="p-6">
             <p className="text-sm font-medium text-muted-foreground mb-1">Total Page Views</p>
             <h3 className="text-3xl font-bold font-display">{totalViews.toLocaleString()}</h3>
           </CardContent>
        </Card>
      </div>

      {/* Main Table Content */}
      <Card className="border-border/40 shadow-xl shadow-black/5 bg-background/50 backdrop-blur-xl">
        <CardHeader className="pb-4 border-b border-border/40 px-6 pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Content Management</CardTitle>
            <div className="flex items-center gap-2 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm bg-background border-border/50 focus:border-brand-primary rounded-full w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[0.75rem] text-muted-foreground uppercase tracking-wider bg-muted/10 border-b border-border/40">
                <tr>
                  <th scope="col" className="p-4 w-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filtered.length && filtered.length > 0}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Date</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((article) => (
                  <tr key={article.id} className="border-b border-border/30 hover:bg-muted/30 transition-all duration-300 group">
                    <td className="p-4 w-4 pl-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(article.id)}
                          onChange={() => toggleSelect(article.id)}
                          className="w-4 h-4 rounded border-muted-foreground/30 bg-transparent text-brand-primary focus:ring-brand-primary focus:ring-2 cursor-pointer transition-colors"
                        />
                      </div>
                    </td>
                    <th scope="row" className="px-6 py-5 font-semibold text-foreground max-w-md truncate">
                      <Link to={`/admin/article/edit/${article.id}`} className="hover:text-brand-primary transition-colors">
                        {article.title}
                      </Link>
                    </th>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider ${article.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-muted-foreground whitespace-nowrap text-[0.85rem] font-medium">
                      {formatDate(article.date)}
                    </td>
                    <td className="px-6 py-5 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300 ease-out">
                        <Button variant="ghost" size="icon" title="Preview" onClick={() => window.open(`/article/${article.id}`, '_blank')} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => navigate(`/admin/article/edit/${article.id}`)} className="h-8 w-8 text-muted-foreground hover:text-brand-primary hover:bg-brand-primary/10 rounded-full">
                          <Edit3 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(article.id)} className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full mb-0">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                       <div className="flex flex-col items-center justify-center space-y-3">
                         <AlertCircle className="h-8 w-8 text-muted" />
                         <p>No articles found</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
