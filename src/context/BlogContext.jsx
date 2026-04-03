import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultProfile } from '../data/mockData';
import { fetchArticles, createArticle, updateArticleApi, deleteArticleApi } from '../utils/api';

const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    // Fetch real articles and categories from backend API
    const loadData = async () => {
      const { fetchCategories } = await import('../utils/api');
      const cats = await fetchCategories();
      setCategories(cats);

      const data = await fetchArticles();
      setArticles(data);
    };
    loadData();

    const storedProfile = localStorage.getItem('blog_profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      setProfile(defaultProfile);
      localStorage.setItem('blog_profile', JSON.stringify(defaultProfile));
    }
  }, []);

  const addArticle = async (newArticle) => {
    try {
      const res = await createArticle(newArticle);
      if(res.code === 200) {
        // Re-fetch to ensure true synchronization with Database
        const data = await fetchArticles(); 
        setArticles(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateArticle = async (updatedArticle) => {
    try {
      const res = await updateArticleApi(updatedArticle);
      if(res.code === 200) {
        const data = await fetchArticles();
        setArticles(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteArticle = async (id) => {
    try {
      const res = await deleteArticleApi(id);
      if(res.code === 200) {
        const data = await fetchArticles();
        setArticles(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('blog_profile', JSON.stringify(updatedProfile));
  };

  return (
    <BlogContext.Provider value={{ articles, categories, profile, addArticle, updateArticle, deleteArticle, updateProfile }}>
      {children}
    </BlogContext.Provider>
  );
};
