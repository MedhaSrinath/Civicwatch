import { useState } from 'react';
import type { Screen } from '../types';

export function LoginPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    if (!email || !password) { setError('Please enter both email and password.'); return; }
    if (email === 'admin@civic.gov.in') navigate('admin-dashboard');
    else if (email.endsWith('@civic.gov.in')) navigate('officer-dashboard');
    else navigate('citizen-dashboard');
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center px-12 w-96 flex-shrink-0" style={{ background: 'var(--navy-dark)' }}>
        <div className="civicwatch-logo text-xl mb-1" style={{ color: '#fff' }}>
          Civic<span style={{ color: 'var(--saffron)' }}>Watch</span>
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
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <div className="civicwatch-logo text-2xl">Civic<span style={{ color: 'var(--saffron)' }}>Watch</span></div>
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)' }}>Welcome back</h2>
          <p className="text-sm mb-7" style={{ color: 'var(--text-secondary)' }}>Sign in to your CivicWatch account</p>

          {error && (
            <div className="mb-4 p-3 rounded text-sm" style={{ background: 'var(--red-bg)', border: '1px solid rgba(155,65,65,0.25)', color: 'var(--red)' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Enter your password" value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }} />
          </div>

          <div className="flex justify-end mb-5">
            <span className="text-sm cursor-pointer hover:underline" style={{ color: 'var(--navy)' }}>Forgot password?</span>
          </div>

          <button className="btn btn-primary w-full justify-center text-sm py-2.5 mb-4" onClick={handleLogin}>
            Sign In
          </button>

          <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            New to CivicWatch?{' '}
            <span className="font-semibold cursor-pointer hover:underline" style={{ color: 'var(--navy)' }} onClick={() => navigate('register')}>
              Create an account
            </span>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Demo Credentials</div>
            <div className="space-y-2 text-xs">
              {[
                { role: 'Citizen', cls: 'badge-reported', email: 'priya.sharma@email.com' },
                { role: 'Officer', cls: 'badge-assigned', email: 'rajan.kumar@civic.gov.in' },
                { role: 'Admin', cls: 'badge-inprogress', email: 'admin@civic.gov.in' },
              ].map(d => (
                <div key={d.role} className="flex items-center gap-2">
                  <span className={`badge ${d.cls}`}>{d.role}</span>
                  <button className="hover:underline" style={{ color: 'var(--navy)' }}
                    onClick={() => { setEmail(d.email); setPassword('password'); setError(''); }}>
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
