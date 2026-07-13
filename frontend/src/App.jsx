// App.jsx — Main App Component with Routing
// This is the root component that defines all the pages/routes in our app

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import AIInsights from './pages/AIInsights';
import Loader from './components/Common/Loader';
import './App.css';

/**
 * ProtectedRoute — A wrapper that prevents unauthenticated users from
 * accessing certain pages. If not logged in, redirect to /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While checking auth status, show a loading spinner
  if (loading) return <Loader />;

  // If not logged in, redirect to login page
  if (!isAuthenticated) return <Navigate to="/login" />;

  // If logged in, show the requested page inside the Layout (sidebar + content)
  return <Layout>{children}</Layout>;
};

/**
 * PublicRoute — A wrapper for login/register pages.
 * If already logged in, redirect to dashboard instead.
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;

  // If already logged in, go to dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" />;

  // Otherwise show the login/register page
  return children;
};

/**
 * App — The main component that sets up all routes
 */
function App() {
  return (
    <Routes>
      {/* Public routes — accessible without login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected routes — require login */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-insights"
        element={
          <ProtectedRoute>
            <AIInsights />
          </ProtectedRoute>
        }
      />

      {/* Default route — redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
