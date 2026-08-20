import { useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectForm from './pages/ProjectForm';
import Skills from './pages/Skills';
import Experience from './pages/Experience';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import Requests from './pages/Requests';
import Account from './pages/Account';
import { getStoredAuth, ADMIN_ROLES, STAFF_ROLES } from './utils/api';

// Listens for the `auth:unauthorized` event the API layer fires on a 401 and
// redirects inside the router — no full-page reload, so app state survives.
function AuthWatcher() {
  const navigate = useNavigate();
  useEffect(() => {
    const onUnauthorized = (e) => {
      // Mark handled so the API layer skips its hard-redirect fallback.
      e.preventDefault();
      if (window.location.pathname !== '/login') navigate('/login', { replace: true });
    };
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, [navigate]);
  return null;
}

// Guards every admin route: no token or a non-staff role means back to /login.
function ProtectedLayout() {
  const auth = getStoredAuth();

  if (!auth?.token || !STAFF_ROLES.includes(auth?.user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 pb-16 pt-20 sm:px-8 lg:pt-8">
        <Outlet />
      </main>
    </div>
  );
}

// Admin/superadmin-only guard (analytics). Editors are redirected home.
function AdminRoute({ children }) {
  const auth = getStoredAuth();
  if (!ADMIN_ROLES.includes(auth?.user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Super-admin-only guard for account management.
function SuperAdminRoute({ children }) {
  const auth = getStoredAuth();
  if (auth?.user?.role !== 'superadmin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthWatcher />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id" element={<ProjectForm />} />
          <Route path="skills" element={<Skills />} />
          <Route path="experience" element={<Experience />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="account" element={<Account />} />
          <Route
            path="analytics"
            element={
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            }
          />
          <Route
            path="requests"
            element={
              <SuperAdminRoute>
                <Requests />
              </SuperAdminRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
