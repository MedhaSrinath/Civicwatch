import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CivicLogo } from './CivicLogo';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#D5D7D4] shadow-xs">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" style={{ textDecoration: 'none' }} className="hover:opacity-95 transition-opacity">
            <CivicLogo size="md" />
          </Link>

          {user && (
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                to={getDashboardPath()}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors ${
                  location.pathname === getDashboardPath()
                    ? 'bg-[#12345B] text-white'
                    : 'text-[#66727A] hover:text-[#12345B] hover:bg-slate-100'
                }`}
                style={{ textDecoration: 'none' }}
              >
                Dashboard
              </Link>

              {user.role === 'citizen' && (
                <Link
                  to="/report"
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors ${
                    location.pathname === '/report'
                      ? 'bg-[#C47A32] text-white'
                      : 'text-[#C47A32] hover:bg-[#C47A32]/10'
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  + Report Issue
                </Link>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#12345B] text-white text-xs font-bold flex items-center justify-center font-display shadow-sm">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-[#12345B] leading-tight">{user.name}</div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#8E9BAA]">
                    <span className={`badge ${user.role === 'admin' ? 'badge-inprogress' : user.role === 'officer' ? 'badge-assigned' : 'badge-reported'} text-[9px] py-0 px-1.5`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm text-xs font-semibold hover:border-red-400 hover:text-red-700 transition-colors"
                title="Sign out of your account"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-secondary btn-sm text-xs font-semibold" style={{ textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-saffron btn-sm glow-saffron text-xs font-bold" style={{ textDecoration: 'none' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
