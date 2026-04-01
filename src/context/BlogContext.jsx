import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultArticles, defaultProfile } from '../data/mockData';

const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    // Hydrate state from localStorage or use defaults
    const storedArticles = localStorage.getItem('blog_articles');
    if (storedArticles) {
      setArticles(JSON.parse(storedArticles));
    } else {
      setArticles(defaultArticles);
      localStorage.setItem('blog_articles', JSON.stringify(defaultArticles));
    }

    const storedProfile = localStorage.getItem('blog_profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      setProfile(defaultProfile);
      localStorage.setItem('blog_profile', JSON.stringify(defaultProfile));
    }
  }, []);

  const addArticle = (newArticle) => {
    const updated = [newArticle, ...articles];
    setArticles(updated);
    localStorage.setItem('blog_articles', JSON.stringify(updated));
  };

  const updateArticle = (updatedArticle) => {
    const updated = articles.map(a => a.id === updatedArticle.id ? updatedArticle : a);
    setArticles(updated);
    localStorage.setItem('blog_articles', JSON.stringify(updated));
  };

  const deleteArticle = (id) => {
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    localStorage.setItem('blog_articles', JSON.stringify(updated));
  };

  const updateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('blog_profile', JSON.stringify(updatedProfile));
  };

  return (
    <BlogContext.Provider value={{ articles, profile, addArticle, updateArticle, deleteArticle, updateProfile }}>
      {children}
    </BlogContext.Provider>
  );
};
