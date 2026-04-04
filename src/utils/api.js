export const fetchArticles = async (page = 1, size = 50, categoryId = null) => {
  try {
    let url = `/api/articles?page=${page}&size=${size}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 200) {
      return data.data.records.map(adaptArticle);
    }
  } catch (error) {
    console.error('Fetch articles error:', error);
  }
  return [];
};

export const fetchArticleById = async (id) => {
  try {
    const res = await fetch(`/api/articles/${id}`);
    const data = await res.json();
    if (data.code === 200) {
      return adaptArticle(data.data);
    }
  } catch (error) {
    console.error('Fetch article by id error:', error);
  }
  return null;
};

export const fetchCategories = async () => {
  try {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
    console.error('Fetch categories error:', error);
  }
  return [];
};

export const createCategory = async (category) => {
  const res = await fetch('/api/admin/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  return res.json();
};

export const updateCategory = async (category) => {
  const res = await fetch(`/api/admin/categories/${category.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  return res.json();
};

export const deleteCategory = async (id) => {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const fetchTags = async () => {
  try {
    const res = await fetch('/api/admin/tags');
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
    console.error('Fetch tags error:', error);
  }
  return [];
};

export const createTag = async (tag) => {
  const res = await fetch('/api/admin/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tag)
  });
  return res.json();
};

export const updateTag = async (tag) => {
  const res = await fetch(`/api/admin/tags/${tag.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tag)
  });
  return res.json();
};

export const deleteTag = async (id) => {
  const res = await fetch(`/api/admin/tags/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const fetchAllUsers = async () => {
  try {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
    console.error('Fetch users error:', error);
  }
  return [];
};

export const createUser = async (user) => {
  const res = await fetch('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return res.json();
};

export const updateUser = async (user) => {
  const res = await fetch(`/api/admin/users/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`/api/admin/users/${id}`, {
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
    categoryId: article.categoryId || 20001, // Use selection if available
    tagIds: []
  };
  const res = await fetch('/api/admin/articles', {
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
    categoryId: article.categoryId
  };
  const res = await fetch(`/api/admin/articles/${article.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const deleteArticleApi = async (id) => {
  const res = await fetch(`/api/admin/articles/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const fetchDashboardStats = async () => {
  try {
    const res = await fetch('/api/admin/dashboard/stats');
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
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
    console.error('Fetch admin profile error:', error);
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
    return res.json();
  } catch (error) {
    console.error('Login API error:', error);
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
