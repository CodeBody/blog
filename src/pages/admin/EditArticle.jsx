import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import Select from 'react-select';
import MDEditor from '@uiw/react-md-editor';

const TAG_OPTIONS = [
  { value: 'React', label: 'React' },
  { value: 'Vue.js', label: 'Vue.js' },
  { value: 'Angular', label: 'Angular' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'Next.js', label: 'Next.js' },
  { value: 'Nuxt.js', label: 'Nuxt.js' },
  { value: 'Vite', label: 'Vite' },
  { value: 'Webpack', label: 'Webpack' },
  { value: 'CSS', label: 'CSS' },
  { value: 'TailwindCSS', label: 'TailwindCSS' },
  { value: 'HTML DOM', label: 'HTML DOM' },
  { value: 'AI', label: 'AI' },
  { value: 'LLM', label: 'LLM' },
  { value: 'ChatGPT', label: 'ChatGPT' },
  { value: 'Open Source', label: 'Open Source' },
  { value: 'Deep Dive', label: 'Deep Dive' },
  { value: 'Machine Learning', label: 'Machine Learning' },
  { value: 'Prompt Engineering', label: 'Prompt Engineering' },
  { value: 'RAG', label: 'RAG' },
  { value: 'Web3', label: 'Web3' },
];

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles, addArticle, updateArticle, profile } = useBlog();
  
  const isNew = !id;
  const existingArticle = !isNew ? articles.find(a => a.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    tags: [],
    status: 'draft',
    content: '',
    coverImage: ''
  });

  const [colorMode, setColorMode] = useState('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setColorMode(isDark ? 'dark' : 'light');
    
    const observer = new MutationObserver(() => {
      setColorMode(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (existingArticle) {
       setFormData({
         title: existingArticle.title,
         abstract: existingArticle.abstract,
         tags: existingArticle.tags || [],
         status: existingArticle.status,
         content: existingArticle.content,
         coverImage: existingArticle.coverImage || ''
       });
    } else if (!isNew) {
       navigate('/admin');
    }
  }, [existingArticle, isNew, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Title and content are required.");
      return;
    }

    const tagsArray = formData.tags || [];
    
    if (isNew) {
      addArticle({
        id: Date.now().toString(),
        title: formData.title,
        abstract: formData.abstract,
        tags: tagsArray.length > 0 ? tagsArray : ['Blog'],
        status: formData.status,
        content: formData.content,
        coverImage: formData.coverImage,
        author: profile?.name || 'Admin',
        date: new Date().toISOString(),
        views: 0
      });
    } else {
      updateArticle({
        ...existingArticle,
        title: formData.title,
        abstract: formData.abstract,
        tags: tagsArray.length > 0 ? tagsArray : ['Blog'],
        status: formData.status,
        content: formData.content,
        coverImage: formData.coverImage
      });
    }

    navigate('/admin');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max_width = 1200; // max reasonable width for web

        if (width > max_width) {
          height = Math.round((height * max_width) / width);
          width = max_width;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress and convert to base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData(prev => ({ ...prev, coverImage: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">{isNew ? 'Create Article' : 'Edit Article'}</h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={handleSubmit} className="flex-1 sm:flex-none">
            <Save size={16} className="mr-2" />
            Save {formData.status === 'published' ? 'Publish' : 'Draft'}
          </Button>
        </div>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Cover Image</label>
              {formData.coverImage ? (
                <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden group border border-border bg-muted">
                  <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))} className="bg-red-500 hover:bg-red-600 text-white shadow-lg inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                      <X size={16} className="mr-2" /> Remove Cover
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer bg-background hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                    <ImageIcon size={28} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">Click to upload cover image</p>
                    <p className="text-xs mt-1">JPEG, PNG, WEBP (auto-compressed)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Title *</label>
              <Input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Article Title"
                className="text-lg font-medium"
              />
            </div>
            <div className="space-y-2 text-sm z-10">
              <label className="text-sm font-medium">Tags</label>
              <Select 
                isMulti
                name="tags" 
                options={TAG_OPTIONS}
                value={TAG_OPTIONS.filter(option => formData.tags.includes(option.value))}
                onChange={(selected) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    tags: selected ? selected.map(s => s.value) : [] 
                  }));
                }}
                unstyled
                classNames={{
                  control: (state) => `flex min-h-[40px] w-full rounded-md border border-border bg-transparent px-3 py-1.5 text-sm transition-colors cursor-text ${state.isFocused ? 'ring-2 ring-brand-primary ring-offset-2 ring-offset-background' : ''}`,
                  menu: () => "mt-1.5 rounded-md border border-border bg-card text-card-foreground shadow-md z-50 overflow-hidden",
                  menuList: () => "py-1",
                  option: (state) => `relative flex w-full cursor-default select-none items-center py-1.5 px-3 text-sm outline-none transition-colors ${state.isFocused ? 'bg-background text-foreground' : ''} ${state.isSelected ? 'bg-brand-primary/20 text-brand-primary font-medium' : ''} active:bg-brand-primary/30`,
                  multiValue: () => "inline-flex items-center rounded-sm bg-background px-2 py-0.5 text-xs font-semibold text-foreground border border-border mr-1.5 my-0.5",
                  multiValueLabel: () => "mr-1",
                  multiValueRemove: () => "hover:bg-red-500 hover:text-white cursor-pointer rounded-sm px-0.5 aspect-square flex items-center justify-center transition-colors",
                  input: () => "text-foreground m-0 p-0",
                  placeholder: () => "text-muted-foreground inline-flex items-center",
                  valueContainer: () => "flex-wrap gap-y-1 py-0.5",
                  dropdownIndicator: () => "text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer",
                  clearIndicator: () => "text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer",
                  indicatorSeparator: () => "bg-border mx-2 my-2 w-[1px]",
                  noOptionsMessage: () => "text-muted-foreground p-3 text-center text-sm"
                }}
                placeholder="Select or search tags..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
              >
                <option value="draft" className="bg-background text-foreground">Draft</option>
                <option value="published" className="bg-background text-foreground">Published</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Abstract (Short description)</label>
              <Textarea 
                name="abstract" 
                value={formData.abstract} 
                onChange={handleChange} 
                placeholder="A brief summary of the article..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col mt-4" data-color-mode={colorMode}>
            <label className="text-sm font-medium flex justify-between">
              <span>Markdown Content *</span>
              <span className="text-muted-foreground text-xs">Supports GFM, Real-time Preview</span>
            </label>
            <MDEditor
              value={formData.content}
              onChange={(val) => setFormData(prev => ({ ...prev, content: val || '' }))}
              height={500}
              className="mt-1 border border-border overflow-hidden rounded-md shadow-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
