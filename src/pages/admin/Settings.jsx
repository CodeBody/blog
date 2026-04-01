import React, { useState, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Save, User, Link as LinkIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';

export default function Settings() {
  const { profile, updateProfile } = useBlog();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    github: '',
    twitter: '',
    linkedin: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        github: profile.socials?.github || '',
        twitter: profile.socials?.twitter || '',
        linkedin: profile.socials?.linkedin || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      bio: formData.bio,
      avatar: formData.avatar,
      socials: {
        github: formData.github,
        twitter: formData.twitter,
        linkedin: formData.linkedin
      }
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Admin Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your blog profile and preferences.</p>
        </div>
        <Button onClick={handleSubmit} className="flex-1 sm:flex-none shadow-glow">
          <Save size={16} className="mr-2" />
          {isSaved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-black/5 bg-background/50 backdrop-blur-xl group">
            <CardHeader>
              <CardTitle className="text-xl font-display">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 pb-8">
              <div className="w-36 h-36 rounded-[2rem] overflow-hidden border-2 border-brand-primary/20 shadow-glow relative group transition-all duration-500 hover:scale-105 hover:border-brand-primary">
                <img 
                  src={formData.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Admin"} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover bg-muted/50 transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="w-full space-y-2 text-center text-sm text-muted-foreground">
                 <p>Avatar visual preview</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-black/5 bg-background/50 backdrop-blur-xl">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-xl font-display flex items-center gap-2">
                  <User size={20} className="text-brand-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Details displayed on your public profile and articles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="e.g. Alex Dev"
                    required
                    className="bg-background border-border/50 focus:border-brand-primary"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium">Avatar Image URL</label>
                  <Input 
                    name="avatar" 
                    value={formData.avatar} 
                    onChange={handleChange} 
                    placeholder="https://example.com/avatar.jpg"
                    className="bg-background border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to use a default placeholder.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Short Bio</label>
                  <Textarea 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange} 
                    placeholder="Tell visitors a bit about yourself..."
                    className="h-24 bg-background border-border/50 focus:border-brand-primary"
                  />
                </div>
              </CardContent>
            </form>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-black/5 bg-background/50 backdrop-blur-xl">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-xl font-display flex items-center gap-2">
                  <LinkIcon size={20} className="text-brand-primary" />
                  Social Links
                </CardTitle>
                <CardDescription>Connect your profiles to build your online presence.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">GitHub Profile</label>
                  <Input 
                    name="github" 
                    value={formData.github} 
                    onChange={handleChange} 
                    placeholder="https://github.com/username"
                    className="bg-background border-border/50 focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Twitter Profile</label>
                  <Input 
                    name="twitter" 
                    value={formData.twitter} 
                    onChange={handleChange} 
                    placeholder="https://twitter.com/username"
                    className="bg-background border-border/50 focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">LinkedIn Profile</label>
                  <Input 
                    name="linkedin" 
                    value={formData.linkedin} 
                    onChange={handleChange} 
                    placeholder="https://linkedin.com/in/username"
                    className="bg-background border-border/50 focus:border-brand-primary transition-colors"
                  />
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
