import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CivicLogo } from '../components/CivicLogo';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(name, email, password, phone);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          Join CivicWatch as a Citizen
        </h2>
        <p className="text-sm leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Create an account to report civic issues in your neighborhood, track their resolution in real time, and verify fixes.
        </p>
        {['Quick 60-second sign up', 'Direct department accountability', 'Transparent status updates'].map(f => (
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
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)' }}>Create an account</h2>
          <p className="text-sm mb-7" style={{ color: 'var(--text-secondary)' }}>Sign up as a citizen to report issues</p>

          {error && (
            <div className="mb-4 p-3 rounded text-sm" style={{ background: 'var(--red-bg)', border: '1px solid rgba(155,65,65,0.25)', color: 'var(--red)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Priya Sharma"
                value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
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
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="9876543210"
                value={phone}
                onChange={e => { setPhone(e.target.value); setError(''); }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full justify-center text-sm py-2.5 mb-4"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--navy)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
