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

  const demoAccounts = [
    { role: 'Citizen', label: 'Priya Sharma (Citizen)', email: 'priya.sharma@email.com', color: 'badge-reported' },
    { role: 'Officer', label: 'Rajan Kumar (Roads Dept)', email: 'rajan.kumar@civic.gov.in', color: 'badge-assigned' },
    { role: 'Admin', label: 'Administrator', email: 'admin@civic.gov.in', color: 'badge-inprogress' }
  ];

  return (
    <div className="min-h-screen flex selection:bg-[#C47A32]/20" style={{ background: 'var(--bg)' }}>
      {/* Left panel - Decorative Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[440px] flex-shrink-0 bg-gradient-to-br from-[#0B2742] via-[#12345B] to-[#0B2742] text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#C47A32]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <Link to="/" className="inline-block mb-1 hover:opacity-90 transition-opacity" style={{ textDecoration: 'none' }}>
            <span className="civicwatch-logo text-2xl font-black text-white">
              Civic<span style={{ color: 'var(--saffron)' }}>Watch</span>
            </span>
          </Link>
          <div className="text-xs text-white/50 font-mono tracking-wider uppercase mb-12">
            Municipal Services Portal
          </div>

          <h2 className="text-3xl font-extrabold leading-tight mb-4 font-display">
            Track and resolve civic issues with verified accountability.
          </h2>
          <p className="text-sm leading-relaxed text-white/70 mb-10">
            Every reported issue is directly assigned to the responsible ward officer, with photo proof required for closure.
          </p>

          <div className="space-y-4">
            {[
              'Report civic problems in under 60s',
              'Real-time transparent status explanations',
              'Citizen-verified resolution before ticket closes',
              'Direct ward officer accountability'
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-[#3F6B52] text-white shrink-0">
                  ✓
                </span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-xs text-white/40 flex justify-between">
          <span>RV University · CS3301</span>
          <span>Phase 2 Production</span>
        </div>
      </div>

      {/* Right panel - Login Card */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <CivicLogo size="lg" />
            </Link>
            <p className="text-xs text-[#66727A] mt-1">Municipal Issue Management</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5D7D4] p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-[#12345B] tracking-tight">Welcome back</h2>
              <p className="text-sm text-[#66727A] mt-1">Sign in to your CivicWatch account</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 animate-fadeIn">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="form-label text-xs uppercase tracking-wider text-[#66727A]">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input rounded-lg text-sm transition-all focus:border-[#12345B]"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="form-label text-xs uppercase tracking-wider text-[#66727A] mb-0">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  className="form-input rounded-lg text-sm transition-all focus:border-[#12345B]"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full justify-center text-sm py-3 rounded-lg font-bold shadow-md hover:bg-[#0B2742] transition-all cursor-pointer mt-2"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </form>

            <div className="text-center text-xs text-[#66727A] mt-6 pt-5 border-t border-[#E7E6E1]">
              New citizen user?{' '}
              <Link to="/register" className="font-bold text-[#12345B] hover:text-[#C47A32] transition-colors" style={{ textDecoration: 'none' }}>
                Create an account →
              </Link>
            </div>
          </div>

          {/* Quick Demo Credentials Pill Selector */}
          <div className="mt-6 p-4 rounded-xl bg-[#EFEDE8] border border-[#D5D7D4]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E9BAA]">
                ⚡ Quick Demo Sign-In
              </span>
              <span className="text-[10px] text-[#66727A] font-mono">Password: password</span>
            </div>
            <div className="space-y-1.5">
              {demoAccounts.map(d => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => { setEmail(d.email); setPassword('password'); setError(''); }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white border border-[#D5D7D4] hover:border-[#12345B] hover:bg-slate-50 transition-all flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className={`badge ${d.color} text-[10px]`}>{d.role}</span>
                    <span className="font-medium text-[#12345B] group-hover:text-[#C47A32]">{d.label}</span>
                  </div>
                  <span className="text-[10px] text-[#8E9BAA] font-mono">Click to autofill</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
