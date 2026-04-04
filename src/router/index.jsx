import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Suspense, lazy } from 'react';

// Layouts (Static)
import FrontendLayout from '../components/front/FrontendLayout';
import AdminLayout from '../components/admin/AdminLayout';

// Pages (Lazy)
const Home = lazy(() => import('../pages/front/Home'));
const ArticleDetail = lazy(() => import('../pages/front/ArticleDetail'));
const About = lazy(() => import('../pages/front/About'));
const Projects = lazy(() => import('../pages/front/Projects'));
const Contact = lazy(() => import('../pages/front/Contact'));
const KnowledgePlanetPage = lazy(() => import('../pages/front/KnowledgePlanetPage'));

const Login = lazy(() => import('../pages/admin/Login'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Posts = lazy(() => import('../pages/admin/Posts'));
const Categories = lazy(() => import('../pages/admin/Categories'));
const Tags = lazy(() => import('../pages/admin/Tags'));
const Users = lazy(() => import('../pages/admin/Users'));
const EditArticle = lazy(() => import('../pages/admin/EditArticle'));
const Settings = lazy(() => import('../pages/admin/Settings'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const LazyLoad = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

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
      { index: true, element: <LazyLoad><Home /></LazyLoad> },
      { path: 'articles', element: <LazyLoad><Home /></LazyLoad> },
      { path: 'category/:categoryId', element: <LazyLoad><Home /></LazyLoad> },
      { path: 'article/:id', element: <LazyLoad><ArticleDetail /></LazyLoad> },
      { path: 'planet', element: <LazyLoad><KnowledgePlanetPage /></LazyLoad> },
      { path: 'about', element: <LazyLoad><About /></LazyLoad> },
      { path: 'projects', element: <LazyLoad><Projects /></LazyLoad> },
      { path: 'contact', element: <LazyLoad><Contact /></LazyLoad> },
    ],
  },
  {
    path: '/admin/login',
    element: <LazyLoad><Login /></LazyLoad>,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <LazyLoad><Dashboard /></LazyLoad> },
      { path: 'posts', element: <LazyLoad><Posts /></LazyLoad> },
      { path: 'categories', element: <LazyLoad><Categories /></LazyLoad> },
      { path: 'tags', element: <LazyLoad><Tags /></LazyLoad> },
      { path: 'users', element: <LazyLoad><Users /></LazyLoad> },
      { path: 'article/new', element: <LazyLoad><EditArticle /></LazyLoad> },
      { path: 'article/edit/:id', element: <LazyLoad><EditArticle /></LazyLoad> },
      { path: 'settings', element: <LazyLoad><Settings /></LazyLoad> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});
