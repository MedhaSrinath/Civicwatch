import type { Screen } from '../types';

function CivicLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };
  return (
    <span className={`civicwatch-logo ${sizes[size]}`}>
      Civic<span style={{ color: 'var(--saffron)' }}>Watch</span>
    </span>
  );
}

export function LandingPage({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <CivicLogo size="md" />
            <div style={{ display: 'flex', gap: 24 }}>
              <a href="#how-it-works" style={{ fontSize: 13.5, color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}>How It Works</a>
              <a href="#resolved" style={{ fontSize: 13.5, color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}>Recently Resolved</a>
              <a href="#departments" style={{ fontSize: 13.5, color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}>Departments</a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('login')}>Login</button>
            <button className="btn btn-saffron btn-sm" style={{ fontWeight: 600 }} onClick={() => navigate('register')}>
              Report an Issue
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>

          {/* Left — copy */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: 18 }}>
              Municipal Issue Reporting Platform
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.025em', color: 'var(--navy)', marginBottom: 20 }}>
              Report.<br />Track.<br />Resolve.
            </h1>
            <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 420 }}>
              Report civic problems in your ward, track their progress through the right department, and verify that issues are actually resolved.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
              <button className="btn btn-saffron" onClick={() => navigate('register')}>Report an Issue</button>
              <button className="btn btn-outline" onClick={() => navigate('login')}>Sign In</button>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--green)' }}>✓</span> Report instantly with photos
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--green)' }}>✓</span> Real-time tracking
              </div>
            </div>
          </div>

          {/* Right — Before / After */}
          <div style={{ position: 'relative' }}>
            {/* Before/After comparison */}
            <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', height: 360, position: 'relative' }}>
              {/* Before (left) */}
              <div style={{ flex: 1, background: 'var(--bg)', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>Before CivicWatch</div>
                <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  • Report issues with phone calls<br/>
                  • No tracking or visibility<br/>
                  • Unclear status for days<br/>
                  • No confirmation of resolution
                </div>
              </div>

              {/* After (right) */}
              <div style={{ flex: 1, background: 'var(--navy)', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase' }}>With CivicWatch</div>
                <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                  • Report in 60 seconds with app<br/>
                  • Live status updates<br/>
                  • Department accountability<br/>
                  • Verified closure
                </div>
              </div>

              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.5)', transform: 'translateX(-50%)', zIndex: 4 }} />
            </div>

            {/* Label */}
            <div style={{ position: 'absolute', bottom: -14, right: 12, fontSize: 11, fontWeight: 600, color: '#fff', background: 'var(--navy)', padding: '4px 10px', borderRadius: 3, letterSpacing: '0.02em', fontFamily: 'var(--font-mono)' }}>
              CivicWatch · tracked this resolution
            </div>
          </div>
        </div>
      </section>

      {/* ── Issue Types ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border-light)', padding: '36px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 22 }}>
            Report issues related to
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {[
              { icon: <PotholeIcon />, label: 'Potholes' },
              { icon: <GarbageIcon />, label: 'Garbage' },
              { icon: <LightIcon />, label: 'Streetlights' },
              { icon: <DrainIcon />, label: 'Drainage' },
              { icon: <WaterIcon />, label: 'Water Leakage' },
              { icon: <RoadIcon />, label: 'Damaged Roads' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16, background: 'var(--surface)', borderRadius: 4, border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.12s' }} className="issue-pill">
                <div style={{ color: 'var(--navy)', fontSize: 28 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', textAlign: 'center' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-light)', padding: '64px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 56, alignItems: 'start' }}>

            {/* Steps */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: 16 }}>Process</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 32, lineHeight: 1.2, color: 'var(--navy)' }}>How CivicWatch works</h2>
              
              {[
                { step: 1, title: 'Report Issue', desc: 'Take a photo, add location & details in 60 seconds' },
                { step: 2, title: 'Auto-Route', desc: 'CivicWatch routes to the right department instantly' },
                { step: 3, title: 'Track Live', desc: 'Get real-time updates on status & progress' },
                { step: 4, title: 'Verify & Close', desc: 'Confirm resolution and rate department response' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="hiw-step" style={{ marginBottom: 28 }}>
                  <div className="timeline-dot timeline-dot-active" style={{ minWidth: 28 }}>{step}</div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>{title}</h3>
                    <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ paddingTop: 56 }}>
              {[
                { value: '2,847', label: 'Issues Reported' },
                { value: '1,274', label: 'Resolved' },
                { value: '4.6 days', label: 'Avg. Resolution' },
              ].map((s, i) => (
                <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)', marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Statistics ──────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--navy-dark)', padding: '44px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { value: '2,847', label: 'Issues Reported' },
              { value: '1,274', label: 'Issues Resolved' },
              { value: '4.6 days', label: 'Average Resolution Time' },
              { value: '18', label: 'Departments & Wards Covered' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 20, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recently Resolved ───────────────────────────────────────────── */}
      <section id="resolved" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border-light)', padding: '64px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Recent Success</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--navy)' }}>Recently Resolved</h2>
            </div>
            <a href="#" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--navy)', textDecoration: 'none', cursor: 'pointer' }}>View all →</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              {
                id: 'CW-2024-08901',
                title: 'Massive pothole on MG Road',
                dept: 'Roads & Infrastructure',
                daysToResolve: 3,
                status: 'resolved',
                priority: 'high',
              },
              {
                id: 'CW-2024-08887',
                title: 'Garbage accumulation near market',
                dept: 'Sanitation',
                daysToResolve: 2,
                status: 'resolved',
                priority: 'high',
              },
              {
                id: 'CW-2024-08876',
                title: 'Streetlight not working for 2 weeks',
                dept: 'Municipal Services',
                daysToResolve: 6,
                status: 'resolved',
                priority: 'medium',
              },
            ].map((issue) => (
              <div key={issue.id} className="card" style={{ padding: 18, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, color: 'var(--navy)', backgroundColor: 'var(--navy-10)', padding: '3px 8px', borderRadius: 3 }}>
                    {issue.id}
                  </div>
                  <span className={`badge badge-${issue.priority}`} style={{ fontSize: 10 }}>
                    {issue.priority.toUpperCase()}
                  </span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10, lineHeight: 1.4 }}>{issue.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span className="badge badge-resolved">Resolved</span>
                  <span>in {issue.daysToResolve} days</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  {issue.dept}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Departments ─────────────────────────────────────────────────── */}
      <section id="departments" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-light)', padding: '40px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 20 }}>
            Municipal departments covered
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {[
              'Roads & Infrastructure',
              'Water Supply',
              'Sanitation',
              'Electricity',
              'Parks & Recreation',
              'Public Health',
              'Transport',
              'Planning',
            ].map((dept) => (
              <div key={dept} className="dept-tag" style={{ padding: '8px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                {dept}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ background: 'var(--navy-dark)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 1fr', gap: 48, marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                Civic<span style={{ color: 'var(--saffron)' }}>Watch</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                Empowering citizens to report, track, and resolve civic issues with full transparency.
              </p>
            </div>

            {/* Links */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 14 }}>Links</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', cursor: 'pointer' }}>About CivicWatch</a>
                <a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', cursor: 'pointer' }}>How It Works</a>
                <a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', cursor: 'pointer' }}>Privacy Policy</a>
                <a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', cursor: 'pointer' }}>Terms of Service</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 14 }}>Contact</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="mailto:support@civicwatch.in" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', cursor: 'pointer' }}>support@civicwatch.in</a>
                <a href="tel:1800civicwatch" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', cursor: 'pointer' }}>1-800-CIVIC-WATCH</a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>© 2024 CivicWatch. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 20 }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 12, cursor: 'pointer' }}>Twitter</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 12, cursor: 'pointer' }}>LinkedIn</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 12, cursor: 'pointer' }}>GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Civic Issue SVG Icons (line style, navy) ─────────────────────────────────
function PotholeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="14" cy="18" rx="9" ry="5" />
      <path d="M5 18c0-3 4-8 9-8s9 5 9 8" />
      <path d="M10 14c1-2 2-4 4-4" />
    </svg>
  );
}
function GarbageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="10" width="14" height="14" rx="2" />
      <path d="M5 10h18M11 10V7a1 1 0 011-1h4a1 1 0 011 1v3" />
      <path d="M14 14v6M11 14v6M17 14v6" />
    </svg>
  );
}
function LightIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4v2M14 22v2M4 13h2M22 13h2M7 7l1.4 1.4M19.6 18.6l1.4 1.4M7 19l1.4-1.4M19.6 7.4l1.4-1.4" />
      <circle cx="14" cy="13" r="4" />
    </svg>
  );
}
function DrainIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="12" width="20" height="3" rx="1" />
      <path d="M8 12V8M12 12V6M16 12V8M20 12V6" />
      <path d="M6 15c0 4 4 7 8 7s8-3 8-7" />
    </svg>
  );
}
function WaterIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4C14 4 6 12 6 17a8 8 0 0016 0c0-5-8-13-8-13z" />
      <path d="M14 20v-4M12 18h4" />
    </svg>
  );
}
function RoadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22L10 6h8l6 16" />
      <path d="M14 6v16" strokeDasharray="3 2" />
      <path d="M9 14l1.5-3M18 14l-1.5-3" />
    </svg>
  );
}
