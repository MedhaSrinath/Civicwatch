import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './screens/LandingPage';
import { LoginPage } from './screens/LoginPage';
import { RegisterPage } from './screens/RegisterPage';

// Placeholder dashboards until implemented in subsequent steps
import { CitizenDashboard } from './screens/citizen/CitizenDashboard';
import { ReportIssuePage } from './screens/citizen/ReportIssuePage';
import { ComplaintDetailPage } from './screens/citizen/ComplaintDetailPage';
import { OfficerDashboard } from './screens/officer/OfficerDashboard';
import { AdminDashboard } from './screens/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Citizen routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <CitizenDashboard />
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <ReportIssuePage />
            </ProtectedRoute>
          } />
          <Route path="/complaint/:id" element={
            <ProtectedRoute>
              <ComplaintDetailPage />
            </ProtectedRoute>
          } />

          {/* Officer routes */}
          <Route path="/officer" element={
            <ProtectedRoute allowedRoles={['officer']}>
              <OfficerDashboard />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
