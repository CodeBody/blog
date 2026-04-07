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
  fetchAdminProjects,
  fetchAdminProjectById,
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
  createUser,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
  createArticle, 
  updateArticleApi, 
  deleteArticleApi, 
  fetchArticleById,
  fetchAdminArticleById,
  fetchAdminArticles,
  fetchAdminProfile,
  fetchProjects,
  fetchDashboardStats 
} from '../utils/api';

const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [projects, setProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState({});
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalArticles, setTotalArticles] = useState(0);
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    fetchProfileData();
  }, []);


  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const fetchUsers = async () => {
    const usrs = await fetchAllUsers();
    setUsers(usrs || []);
  };

  const fetchArticlesData = async (page = 1, size = 50, catId = null, keyword = '') => {
    setLoading(true);
    const data = await fetchArticles(page, size, catId, keyword);
    setArticles(data.records || []);
    setTotalArticles(data.total || 0);
    setLoading(false);
  };

  const fetchAdminSingleArticle = async (id) => {
    setLoading(true);
    const data = await fetchAdminArticleById(id);
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

  const fetchProjectsData = async (page = 1, size = 6, title = '') => {
    setLoading(true);
    const data = await fetchProjects(page, size, title);
    setProjects(data.records || []);
    setTotalProjects(data.total || 0);
    setLoading(false);
  };

  const addProject = async (project) => {
    const res = await createProjectApi(project);
    if(res.code === 200) await fetchProjectsData();
    return res;
  };

  const updateProjectAction = async (project) => {
    const res = await updateProjectApi(project);
    if(res.code === 200) await fetchProjectsData();
    return res;
  };

  const deleteProjectAction = async (id) => {
    const res = await deleteProjectApi(id);
    if(res.code === 200) await fetchProjectsData();
    return res;
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
      articles, totalArticles, categories, tags, projects, totalProjects, users, profile, dashboardStats, loading,

      addArticle, updateArticle, deleteArticle,
      addCategory, updateCategory, deleteCategory,
      addTag, updateTag, deleteTag,
      addUser, updateUser, deleteUser,
      fetchUsers, 
      fetchArticles: fetchArticlesData,
      fetchAdminArticles: async (page = 1, size = 5, catId = null) => {
        setLoading(true);
        const data = await fetchAdminArticles(page, size, catId);
        setArticles(data.records || []);
        setTotalArticles(data.total || 0);
        setLoading(false);
      },
      fetchCategories: fetchCategoriesData,
      fetchTags: fetchTagsData,
      fetchProjects: fetchProjectsData,
      fetchAdminProjects: async (page = 1, size = 10, title = '') => {
        setLoading(true);
        const data = await fetchAdminProjects(page, size, title);
        setProjects(data.records || []);
        setTotalProjects(data.total || 0);
        setLoading(false);
      },
      addProject,
      updateProject: updateProjectAction,
      deleteProject: deleteProjectAction,
      fetchProfile: fetchProfileData,
      fetchDashboardData,
      updateProfile,
      fetchSingleArticle,
      fetchAdminSingleArticle,
      toasts,
      showToast
    }}>
      {children}
    </BlogContext.Provider>
  );
};
