import React from 'react';
import { useBlog } from '../../context/BlogContext';
import { Mail } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Card, CardContent } from '../../components/common/Card';

export default function About() {
  const { profile } = useBlog();

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 w-full pt-32 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-border shrink-0 shadow-lg">
          <img 
            src={profile?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Alex"} 
            alt={profile?.name}
            className="w-full h-full object-cover bg-muted"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="font-display font-[800] text-[clamp(2.5rem,5vw,4rem)] tracking-[-0.02em] leading-tight mb-4">
            Hi, I'm <span className="gradient-text pb-2">{profile?.name.split(' ')[0]}</span>.
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
            {profile?.bio || 'Building things for the web.'}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
            {profile?.socials?.github && (
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="p-3 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                <FaGithub size={20} />
              </a>
            )}
            {profile?.socials?.twitter && (
              <a href={profile.socials.twitter} target="_blank" rel="noreferrer" className="p-3 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                <FaTwitter size={20} />
              </a>
            )}
            {profile?.socials?.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-muted rounded-full hover:bg-[#0A66C2] hover:text-white transition-all">
                <FaLinkedin size={20} />
              </a>
            )}
            <a href="mailto:hello@example.com" className="p-3 bg-muted rounded-full hover:bg-red-500 hover:text-white transition-all">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="font-display text-3xl font-bold tracking-tight mb-6 flex items-center gap-3">
             <span className="bg-glass border border-border text-foreground w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm">🚀</span>
             What I Do
          </h2>
          <Card className="border-border bg-glass backdrop-blur-md shadow-sm hover:border-border-hover transition-colors rounded-2xl">
            <CardContent className="p-8 prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
              <p>
                I specialize in front-end development, UX design, and modern web architectures. My goal is to bridge the gap between aesthetics and functionality, crafting fast, accessible, and delightful user experiences.
              </p>
              <p>
                When I'm not coding, I'm usually writing on this blog, contributing to open source, or exploring new design trends. I strongly believe in the power of the web to connect people and ideas.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
           <h2 className="font-display text-3xl font-bold tracking-tight mb-6 flex items-center gap-3">
             <span className="bg-glass border border-border text-foreground w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm">🛠️</span>
             Core Technologies
          </h2>
          <div className="flex flex-wrap gap-3">
            {['React 18', 'Vite', 'Tailwind CSS v3', 'TypeScript', 'Next.js', 'Figma', 'Node.js', 'GraphQL'].map(tech => (
              <span key={tech} className="px-4 py-2 border border-border bg-card rounded-full text-sm font-medium hover:bg-background-secondary hover:border-foreground transition-colors cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
