import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useBlog } from '../../context/BlogContext';
import Toast from '../common/Toast';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { profile } = useBlog();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light'; // Default to dark for this template
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const navLinks = [
    { name: '灵感星系', path: '/planet' },
    { name: '博文', path: '/' },
    { name: '项目', path: '/projects' },
    { name: '关于', path: '/about' },
    { name: '联系', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-glass backdrop-blur-md border-b border-border shadow-sm' : 'py-5 bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="shrink-0 flex items-center">
            <span className="font-display text-[1.5rem] font-[800] tracking-[-0.03em] bg-foreground text-transparent bg-clip-text transition-all duration-300 hover:gradient-text">
              {profile?.name || '夏了个天.'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[0.95rem] font-medium py-2 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[image:var(--gradient-brand)] after:transition-all after:duration-300 hover:after:w-full hover:text-foreground transition-colors ${location.pathname === link.path && link.path !== '#' ? 'text-foreground after:w-full' : 'text-muted-foreground'}`}
              >
                {link.name}
              </Link>
            ))}
            <button onClick={toggleTheme} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-background-secondary transition-all">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            <button onClick={toggleTheme} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-background-secondary transition-all">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-foreground p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border absolute w-full left-0 top-full">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
  const { profile } = useBlog();
  return (
    <footer className="border-t border-border mt-auto w-full bg-card pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-16 gap-8">
          <div className="text-center md:text-left">
            <a href="#" className="font-display text-[1.5rem] font-[800] tracking-[-0.03em] bg-foreground text-transparent bg-clip-text hover:gradient-text transition-all duration-300">
              {profile?.name ? profile.name.split(' ')[0] + '.' : 'CodeBody.'}
            </a>
            <p className="text-muted-foreground text-[0.95rem] mt-2">
              用心设计并建造。
            </p>
          </div>
          <div className="flex space-x-6">
            {profile?.socials?.github && (
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:-translate-y-1 hover:text-foreground transition-all duration-300">
                <span className="sr-only">GitHub</span>
                <FaGithub size={24} />
              </a>
            )}
            {profile?.socials?.twitter && (
              <a href={profile.socials.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:-translate-y-1 hover:text-foreground transition-all duration-300">
                <span className="sr-only">Twitter</span>
                <FaTwitter size={24} />
              </a>
            )}
             {profile?.socials?.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:-translate-y-1 hover:text-foreground transition-all duration-300">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin size={24} />
              </a>
            )}
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-[0.9rem] text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {profile?.name ? profile.name.split(' ')[0] : 'CodeBody'}. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
};

export default function FrontendLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header />
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      {location.pathname !== '/planet' && <Footer />}
      <Toast />
    </div>
  );
}
