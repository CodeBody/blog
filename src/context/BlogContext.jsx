import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultProfile } from '../data/mockData';
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
  fetchAdminProfile 
} from '../utils/api';

const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState({});

  const loadData = async () => {
    const [cats, arts, tgs, usrs, adminProfile] = await Promise.all([
      fetchCategories(),
      fetchArticles(),
      fetchTags(),
      fetchAllUsers(),
      fetchAdminProfile()
    ]);

    setCategories(cats || []);
    setArticles(arts || []);
    setTags(tgs || []);
    setUsers(usrs || []);

    if (adminProfile) {
      setProfile(adminProfile);
    } else {
      const storedProfile = localStorage.getItem('blog_profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        setProfile(defaultProfile);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Article Handlers
  const addArticle = async (newArticle) => {
    const res = await createArticle(newArticle);
    if(res.code === 200) await loadData();
    return res;
  };

  const updateArticle = async (updatedArticle) => {
    const res = await updateArticleApi(updatedArticle);
    if(res.code === 200) await loadData();
    return res;
  };

  const deleteArticle = async (id) => {
    const res = await deleteArticleApi(id);
    if(res.code === 200) await loadData();
    return res;
  };

  // Category Handlers
  const addCategory = async (category) => {
    const res = await createCategory(category);
    if(res.code === 200) await loadData();
    return res;
  };

  const updateCategory = async (category) => {
    const res = await updateCategoryApi(category);
    if(res.code === 200) await loadData();
    return res;
  };

  const deleteCategory = async (id) => {
    const res = await deleteCategoryApi(id);
    if(res.code === 200) await loadData();
    return res;
  };

  // Tag Handlers
  const addTag = async (tag) => {
    const res = await createTag(tag);
    if(res.code === 200) await loadData();
    return res;
  };

  const updateTag = async (tag) => {
    const res = await updateTagApi(tag);
    if(res.code === 200) await loadData();
    return res;
  };

  const deleteTag = async (id) => {
    const res = await deleteTagApi(id);
    if(res.code === 200) await loadData();
    return res;
  };

  // User Handlers
  const addUser = async (user) => {
    const res = await createUser(user);
    if(res.code === 200) await loadData();
    return res;
  };

  const updateUser = async (user) => {
    const res = await updateUserApi(user);
    if(res.code === 200) await loadData();
    return res;
  };

  const deleteUser = async (id) => {
    const res = await deleteUserApi(id);
    if(res.code === 200) await loadData();
    return res;
  };

  const updateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('blog_profile', JSON.stringify(updatedProfile));
  };

  return (
    <BlogContext.Provider value={{ 
      articles, categories, tags, users, profile, 
      addArticle, updateArticle, deleteArticle,
      addCategory, updateCategory, deleteCategory,
      addTag, updateTag, deleteTag,
      addUser, updateUser, deleteUser,
      updateProfile, reloadData: loadData 
    }}>
      {children}
    </BlogContext.Provider>
  );
};
