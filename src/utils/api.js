export const fetchArticles = async () => {
  try {
    const res = await fetch('/api/articles?page=1&size=50');
    const data = await res.json();
    if (data.code === 200) {
      return data.data.records.map(adaptArticle);
    }
  } catch (error) {
    console.error('Fetch articles error:', error);
  }
  return [];
};

export const fetchCategories = async () => {
  try {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
    console.error('Fetch categories error:', error);
  }
  return [];
};
export const createArticle = async (article) => {
  const payload = {
    title: article.title,
    content: matchAbstractFromContent(article.content),
    status: article.status === 'published' ? 1 : 0,
    authorId: 10001, // Mock fallback
    categoryId: 20001, // Mock fallback
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
    tags: ["React"], // Minimal stub 
    views: item.views || 0,
    status: item.status === 1 ? 'published' : 'draft',
    categoryId: String(item.categoryId)
  };
};
