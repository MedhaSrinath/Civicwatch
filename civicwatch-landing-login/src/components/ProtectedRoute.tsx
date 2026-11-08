import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('citizen' | 'officer' | 'admin')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="civicwatch-logo text-2xl mb-4">Civic<span style={{ color: 'var(--saffron)' }}>Watch</span></div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if unauthorized
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'officer') return <Navigate to="/officer" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
