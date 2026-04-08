const getAuthHeader = () => {
  const token = localStorage.getItem('blog_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const fetchWithAuth = async (url, options = {}) => {
  const headers = {
    ...options.headers,
    ...getAuthHeader(),
  };
  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401 || response.status === 403) {
    // 只有请求管理端接口失败时才强制跳转登录页
    if (url.includes('/api/admin/')) {
      localStorage.removeItem('blog_token');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
      return new Promise(() => {});
    }
  }
  
  return response;
};

export const fetchAdminArticles = async (page = 1, size = 10, categoryId = null) => { 
  try { 
    let url = `/api/admin/articles?page=${page}&size=${size}`; 
    if (categoryId) url += `&categoryId=${categoryId}`; 
    const res = await fetchWithAuth(url); 
    const data = await res.json(); 
    if (data.code === 200) { 
      return {
        records: data.data.records.map(adaptArticle),
        total: data.data.total
      }; 
    } 
  } catch (error) { 
  } 
  return { records: [], total: 0 }; 
}; 

export const fetchArticles = async (page = 1, size = 50, categoryId = null, keyword = '') => {
  try {
    let url = `/api/articles?page=${page}&size=${size}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 200) {
      return {
        records: data.data.records.map(adaptArticle),
        total: data.data.total
      };
    }
  } catch (error) {
  }
  return { records: [], total: 0 };
};

export const fetchAdminArticleById = async (id) => {
  try {
    const res = await fetchWithAuth(`/api/admin/articles/${id}`);
    const data = await res.json();
    if (data.code === 200) {
      return adaptArticle(data.data);
    }
  } catch (error) {
  }
  return null;
};

export const fetchArticleById = async (id) => {
  try {
    const res = await fetch(`/api/articles/${id}`);
    const data = await res.json();
    if (data.code === 200) {
      return adaptArticle(data.data);
    }
  } catch (error) {
  }
  return null;
};

export const fetchCategories = async () => {
  try {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
  }
  return [];
};

export const fetchProjects = async (page = 1, size = 6, title = '') => {
  try {
    let url = `/api/projects?page=${page}&size=${size}`;
    if (title) url += `&title=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
  }
  return { records: [], total: 0 };
};

export const fetchAdminProjects = async (page = 1, size = 10, title = '') => {
  try {
    let url = `/api/admin/projects?page=${page}&size=${size}`;
    if (title) url += `&title=${encodeURIComponent(title)}`;
    const res = await fetchWithAuth(url);
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
  }
  return { records: [], total: 0 };
};

export const fetchAdminProjectById = async (id) => {
  try {
    const res = await fetchWithAuth(`/api/admin/projects/${id}`);
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
  }
  return null;
};

export const createProject = async (project) => {
  const res = await fetchWithAuth('/api/admin/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  });
  return res.json();
};

export const updateProject = async (project) => {
  const res = await fetchWithAuth(`/api/admin/projects/${project.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  });
  return res.json();
};

export const deleteProject = async (id) => {
  const res = await fetchWithAuth(`/api/admin/projects/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const createCategory = async (category) => {
  const res = await fetchWithAuth('/api/admin/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  return res.json();
};

export const updateCategory = async (category) => {
  const res = await fetchWithAuth(`/api/admin/categories/${category.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  return res.json();
};

export const deleteCategory = async (id) => {
  const res = await fetchWithAuth(`/api/admin/categories/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const fetchTags = async () => {
  try {
    const res = await fetch('/api/tags');
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
  }
  return [];
};

export const createTag = async (tag) => {
  const res = await fetchWithAuth('/api/admin/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tag)
  });
  return res.json();
};

export const updateTag = async (tag) => {
  const res = await fetchWithAuth(`/api/admin/tags/${tag.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tag)
  });
  return res.json();
};

export const deleteTag = async (id) => {
  const res = await fetchWithAuth(`/api/admin/tags/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const fetchAllUsers = async () => {
  try {
    const res = await fetchWithAuth('/api/admin/users');
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
  }
  return [];
};

export const createUser = async (user) => {
  const res = await fetchWithAuth('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return res.json();
};

export const updateUser = async (user) => {
  const res = await fetchWithAuth(`/api/admin/users/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetchWithAuth(`/api/admin/users/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const createArticle = async (article) => {
  const payload = {
    title: article.title,
    content: matchAbstractFromContent(article.content),
    status: article.status === 'published' ? 1 : 0,
    authorId: 10001, // Mock fallback
    categoryId: article.categoryId || null,
    tagIds: article.tagIds || []
  };
  const res = await fetchWithAuth('/api/admin/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const updateArticleApi = async (article) => {
  const payload = {
    title: article.title,
    content: article.content,
    status: article.status === 'published' ? 1 : 0,
    categoryId: article.categoryId || null,
    tagIds: article.tagIds || []
  };
  const res = await fetchWithAuth(`/api/admin/articles/${article.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const deleteArticleApi = async (id) => {
  const res = await fetchWithAuth(`/api/admin/articles/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const fetchDashboardStats = async () => {
  try {
    const res = await fetchWithAuth('/api/admin/dashboard/stats');
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
  }
  return null;
};

export const fetchAdminProfile = async () => {
  try {
    const res = await fetch('/api/user/admin');
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
  }
  return null;
};

export const loginApi = async (username, password) => {
  try {
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.code === 200 && data.data.token) {
      localStorage.setItem('blog_token', data.data.token);
    }
    return data;
  } catch (error) {
    return { code: 500, message: 'Server error' };
  }
};

const matchAbstractFromContent = (content) => {
  if (!content) return "";
  return content;
};

const adaptArticle = (item) => {
  return {
    id: String(item.id),
    title: item.title,
    abstract: item.content ? item.content.substring(0, 100).replace(/#/g, '').replace(/\\n/g, ' ') + '...' : '',
    content: item.content ? item.content.replace(/\\n/g, '\n') : '',
    author: "Admin", // Fallback for MVP since no Author join is setup
    date: item.publishedAt ? item.publishedAt.replace(' ', 'T') : new Date().toISOString(),
    tags: item.tags || [],
    views: item.views || 0,
    status: item.status === 1 ? 'published' : 'draft',
    categoryId: String(item.categoryId)
  };
};
