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
    <div className="min-h-screen flex selection:bg-[#C47A32]/20" style={{ background: 'var(--bg)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[440px] flex-shrink-0 bg-gradient-to-br from-[#0B2742] via-[#12345B] to-[#0B2742] text-white relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#C47A32]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <Link to="/" className="inline-block mb-1 hover:opacity-90 transition-opacity" style={{ textDecoration: 'none' }}>
            <span className="civicwatch-logo text-2xl font-black text-white">
              Civic<span style={{ color: 'var(--saffron)' }}>Watch</span>
            </span>
          </Link>
          <div className="text-xs text-white/50 font-mono tracking-wider uppercase mb-12">
            Citizen Registration
          </div>

          <h2 className="text-3xl font-extrabold leading-tight mb-4 font-display">
            Join thousands of active citizens making their wards better.
          </h2>
          <p className="text-sm leading-relaxed text-white/70 mb-10">
            Sign up to report civic problems directly to your ward officials, follow resolution timelines in real time, and verify fixes before complaints are closed.
          </p>

          <div className="space-y-4">
            {[
              'Direct citizen feedback and dispute power',
              'Evidence photo tracking for all complaints',
              'Understand the reason behind every status change',
              'Free, public municipal service'
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
          <span>Secure JWT Authentication</span>
          <span>MongoDB Atlas Connected</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <CivicLogo size="lg" />
            </Link>
            <p className="text-xs text-[#66727A] mt-1">Citizen Portal Registration</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5D7D4] p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-[#12345B] tracking-tight">Create your account</h2>
              <p className="text-sm text-[#66727A] mt-1">Register to start reporting civic issues in your neighborhood</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 animate-fadeIn">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="form-label text-xs uppercase tracking-wider text-[#66727A]">Full Name *</label>
                <input
                  type="text"
                  className="form-input rounded-lg text-sm"
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs uppercase tracking-wider text-[#66727A]">Email Address *</label>
                <input
                  type="email"
                  className="form-input rounded-lg text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs uppercase tracking-wider text-[#66727A]">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  className="form-input rounded-lg text-sm"
                  placeholder="9876543210"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(''); }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs uppercase tracking-wider text-[#66727A]">Password *</label>
                  <input
                    type="password"
                    className="form-input rounded-lg text-sm"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    required
                  />
                </div>
                <div>
                  <label className="form-label text-xs uppercase tracking-wider text-[#66727A]">Confirm *</label>
                  <input
                    type="password"
                    className="form-input rounded-lg text-sm"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-saffron glow-saffron w-full justify-center text-sm py-3 rounded-lg font-bold mt-2 cursor-pointer shadow-md"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>

            <div className="text-center text-xs text-[#66727A] mt-6 pt-5 border-t border-[#E7E6E1]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#12345B] hover:text-[#C47A32] transition-colors" style={{ textDecoration: 'none' }}>
                Sign in here →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
