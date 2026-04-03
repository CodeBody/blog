import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Frontend
import FrontendLayout from '../components/front/FrontendLayout';
import Home from '../pages/front/Home';
import ArticleDetail from '../pages/front/ArticleDetail';
import About from '../pages/front/About';
import Projects from '../pages/front/Projects';
import Contact from '../pages/front/Contact';
import KnowledgePlanetPage from '../pages/front/KnowledgePlanetPage';

// Admin
import AdminLayout from '../components/admin/AdminLayout';
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import EditArticle from '../pages/admin/EditArticle';
import Settings from '../pages/admin/Settings';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'articles', element: <Home /> },
      { path: 'category/:categoryId', element: <Home /> },
      { path: 'article/:id', element: <ArticleDetail /> },
      { path: 'planet', element: <KnowledgePlanetPage /> },
      { path: 'about', element: <About /> },
      { path: 'projects', element: <Projects /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'article/new', element: <EditArticle /> },
      { path: 'article/edit/:id', element: <EditArticle /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
