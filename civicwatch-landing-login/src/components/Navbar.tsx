import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CivicLogo } from './CivicLogo';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'officer') return '/officer';
    return '/dashboard';
  };

  return (
    <header className="topbar">
      <div className="flex items-center gap-6">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <CivicLogo size="md" />
        </Link>
        {user && (
          <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
            <Link to={getDashboardPath()} className="hover:underline" style={{ color: 'var(--navy)' }}>
              Dashboard
            </Link>
            {user.role === 'citizen' && (
              <Link to="/report" className="hover:underline" style={{ color: 'var(--saffron)' }}>
                + Report Issue
              </Link>
            )}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold" style={{ color: 'var(--navy)' }}>{user.name}</div>
              <div className="text-xs uppercase font-mono" style={{ color: 'var(--text-muted)' }}>
                <span className={`badge badge-${user.role === 'admin' ? 'inprogress' : user.role === 'officer' ? 'assigned' : 'reported'}`}>
                  {user.role}
                </span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-saffron btn-sm" style={{ textDecoration: 'none' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
