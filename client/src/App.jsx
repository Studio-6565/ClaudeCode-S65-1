import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PortalLayout from './components/PortalLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Crew from './pages/Crew';
import CrewDetail from './pages/CrewDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Schedule from './pages/Schedule';
import Invoices from './pages/Invoices';

import PortalLogin from './pages/portal/PortalLogin';
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalProjects from './pages/portal/PortalProjects';
import PortalProjectDetail from './pages/portal/PortalProjectDetail';
import PortalSchedule from './pages/portal/PortalSchedule';
import PortalAvailability from './pages/portal/PortalAvailability';

function AdminRoute({ children }) {
  const { adminUser } = useAuth();
  if (!adminUser) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function CrewRoute({ children }) {
  const { crewUser } = useAuth();
  if (!crewUser) return <Navigate to="/portal" replace />;
  return <PortalLayout>{children}</PortalLayout>;
}

function AppRoutes() {
  const { adminUser, crewUser } = useAuth();
  return (
    <Routes>
      {/* Admin */}
      <Route path="/login" element={adminUser ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/clients" element={<AdminRoute><Clients /></AdminRoute>} />
      <Route path="/clients/:id" element={<AdminRoute><ClientDetail /></AdminRoute>} />
      <Route path="/crew" element={<AdminRoute><Crew /></AdminRoute>} />
      <Route path="/crew/:id" element={<AdminRoute><CrewDetail /></AdminRoute>} />
      <Route path="/projects" element={<AdminRoute><Projects /></AdminRoute>} />
      <Route path="/projects/:id" element={<AdminRoute><ProjectDetail /></AdminRoute>} />
      <Route path="/schedule" element={<AdminRoute><Schedule /></AdminRoute>} />
      <Route path="/invoices" element={<AdminRoute><Invoices /></AdminRoute>} />

      {/* Crew Portal */}
      <Route path="/portal" element={crewUser ? <Navigate to="/portal/dashboard" replace /> : <PortalLogin />} />
      <Route path="/portal/dashboard" element={<CrewRoute><PortalDashboard /></CrewRoute>} />
      <Route path="/portal/projects" element={<CrewRoute><PortalProjects /></CrewRoute>} />
      <Route path="/portal/projects/:id" element={<CrewRoute><PortalProjectDetail /></CrewRoute>} />
      <Route path="/portal/schedule" element={<CrewRoute><PortalSchedule /></CrewRoute>} />
      <Route path="/portal/availability" element={<CrewRoute><PortalAvailability /></CrewRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
