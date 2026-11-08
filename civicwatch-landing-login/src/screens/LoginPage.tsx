import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CivicLogo } from '../components/CivicLogo';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await login(email, password);

      // Navigate to role-specific dashboard
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'officer') navigate('/officer');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center px-12 w-96 flex-shrink-0" style={{ background: 'var(--navy-dark)' }}>
        <div className="mb-1">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="civicwatch-logo text-xl" style={{ color: '#fff' }}>
              Civic<span style={{ color: 'var(--saffron)' }}>Watch</span>
            </span>
          </Link>
        </div>
        <div className="text-xs mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>Municipal Services Portal</div>
        <h2 className="text-2xl font-bold mb-3 leading-tight" style={{ color: '#fff' }}>
          Track and resolve civic issues with full transparency
        </h2>
        <p className="text-sm leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
          CivicWatch ensures every complaint reaches the right department and is resolved with accountability.
        </p>
        {['Report civic issues instantly', 'Real-time status tracking', 'Verified resolutions'].map(f => (
          <div key={f} className="flex items-center gap-2 text-sm mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--green)', color: '#fff' }}>✓</span>
            {f}
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <CivicLogo size="lg" />
            </Link>
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)' }}>Welcome back</h2>
          <p className="text-sm mb-7" style={{ color: 'var(--text-secondary)' }}>Sign in to your CivicWatch account</p>

          {error && (
            <div className="mb-4 p-3 rounded text-sm" style={{ background: 'var(--red-bg)', border: '1px solid rgba(155,65,65,0.25)', color: 'var(--red)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full justify-center text-sm py-2.5 mb-4"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            New to CivicWatch?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: 'var(--navy)', textDecoration: 'none' }}>
              Create an account
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Demo Credentials</div>
            <div className="space-y-2 text-xs">
              {[
                { role: 'Citizen', cls: 'badge-reported', email: 'priya.sharma@email.com' },
                { role: 'Officer', cls: 'badge-assigned', email: 'rajan.kumar@civic.gov.in' },
                { role: 'Admin', cls: 'badge-inprogress', email: 'admin@civic.gov.in' },
              ].map(d => (
                <div key={d.role} className="flex items-center justify-between">
                  <span className={`badge ${d.cls}`}>{d.role}</span>
                  <button
                    type="button"
                    className="hover:underline font-mono text-xs"
                    style={{ color: 'var(--navy)', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => { setEmail(d.email); setPassword('password'); setError(''); }}
                  >
                    {d.email}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
