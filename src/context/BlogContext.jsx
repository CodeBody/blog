import React, { createContext, useContext, useState, useEffect } from 'react';

import { 
  fetchArticles, 
  fetchCategories, 
  createCategory,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
  fetchTags,
  createTag,
  updateTag as updateTagApi,
  deleteTag as deleteTagApi,
  fetchAllUsers,
  createUser,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
  createArticle, 
  updateArticleApi, 
  deleteArticleApi, 
  fetchAdminProfile,
  fetchDashboardStats 
} from '../utils/api';

const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState({});
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const usrs = await fetchAllUsers();
    setUsers(usrs || []);
  };

  const fetchArticlesData = async (page = 1, size = 50, catId = null) => {
    setLoading(true);
    const data = await fetchArticles(page, size, catId);
    setArticles(data);
    setLoading(false);
  };

  const fetchSingleArticle = async (id) => {
    setLoading(true);
    const data = await fetchArticleById(id);
    if (data) {
      setArticles(prev => {
        const index = prev.findIndex(a => a.id === data.id);
        if (index > -1) {
          const newArticles = [...prev];
          newArticles[index] = data;
          return newArticles;
        }
        return [...prev, data];
      });
    }
    setLoading(false);
    return data;
  };

  const fetchCategoriesData = async () => {
    const cats = await fetchCategories();
    setCategories(cats || []);
  };

  const fetchTagsData = async () => {
    const tgs = await fetchTags();
    setTags(tgs || []);
  };

  const fetchDashboardData = async () => {
    const stats = await fetchDashboardStats();
    setDashboardStats(stats);
  };

  const fetchProfileData = async () => {
    const adminProfile = await fetchAdminProfile();
    if (adminProfile) {
      setProfile(adminProfile);
    } else {
      const storedProfile = localStorage.getItem('blog_profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        setProfile({});
      }
    }
  };

  // Article Handlers
  const addArticle = async (newArticle) => {
    const res = await createArticle(newArticle);
    if(res.code === 200) await fetchArticlesData();
    return res;
  };

  const updateArticle = async (updatedArticle) => {
    const res = await updateArticleApi(updatedArticle);
    if(res.code === 200) await fetchArticlesData();
    return res;
  };

  const deleteArticle = async (id) => {
    const res = await deleteArticleApi(id);
    if(res.code === 200) await fetchArticlesData();
    return res;
  };

  // Category Handlers
  const addCategory = async (category) => {
    const res = await createCategory(category);
    if(res.code === 200) await fetchCategoriesData();
    return res;
  };

  const updateCategory = async (category) => {
    const res = await updateCategoryApi(category);
    if(res.code === 200) await fetchCategoriesData();
    return res;
  };

  const deleteCategory = async (id) => {
    const res = await deleteCategoryApi(id);
    if(res.code === 200) await fetchCategoriesData();
    return res;
  };

  // Tag Handlers
  const addTag = async (tag) => {
    const res = await createTag(tag);
    if(res.code === 200) await fetchTagsData();
    return res;
  };

  const updateTag = async (tag) => {
    const res = await updateTagApi(tag);
    if(res.code === 200) await fetchTagsData();
    return res;
  };

  const deleteTag = async (id) => {
    const res = await deleteTagApi(id);
    if(res.code === 200) await fetchTagsData();
    return res;
  };

  // User Handlers
  const addUser = async (user) => {
    const res = await createUser(user);
    if(res.code === 200) await fetchUsers();
    return res;
  };

  const updateUser = async (user) => {
    const res = await updateUserApi(user);
    if(res.code === 200) await fetchUsers();
    return res;
  };

  const deleteUser = async (id) => {
    const res = await deleteUserApi(id);
    if(res.code === 200) await fetchUsers();
    return res;
  };

  const updateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('blog_profile', JSON.stringify(updatedProfile));
  };

  return (
    <BlogContext.Provider value={{ 
      articles, categories, tags, users, profile, dashboardStats, loading,
      addArticle, updateArticle, deleteArticle,
      addCategory, updateCategory, deleteCategory,
      addTag, updateTag, deleteTag,
      addUser, updateUser, deleteUser,
      fetchUsers, 
      fetchArticles: fetchArticlesData,
      fetchCategories: fetchCategoriesData,
      fetchTags: fetchTagsData,
      fetchProfile: fetchProfileData,
      fetchDashboardData,
      updateProfile,
      fetchSingleArticle
    }}>
      {children}
    </BlogContext.Provider>
  );
};
