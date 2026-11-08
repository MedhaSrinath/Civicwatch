import { useState } from 'react';
import { Link } from 'react-router-dom';

function CivicLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };
  return (
    <span className={`civicwatch-logo ${sizes[size]} tracking-tight font-extrabold`}>
      Civic<span style={{ color: 'var(--saffron)' }}>Watch</span>
    </span>
  );
}

export function LandingPage() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeTab, setActiveTab] = useState<'all' | 'roads' | 'sanitation' | 'lighting'>('all');

  return (
    <div className="min-h-screen selection:bg-[#C47A32]/20" style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      {/* ── Top Alert Banner ────────────────────────────────────────── */}
      <div className="bg-[#0B2742] text-white text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="pulse-dot"></span>
            <span className="font-semibold text-emerald-400">Civic Services Portal Active:</span>
            <span className="text-white/80">Direct Ward Officer Assignment & Live Resolution Verification</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-white/60">
            <span>Bengaluru Central & East</span>
            <span>•</span>
            <span className="font-mono text-white/80">Toll Free: 1800-CIVIC-WATCH</span>
          </div>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#D5D7D4] transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <CivicLogo size="md" />
            <div className="hidden md:flex items-center gap-6 text-[13.5px] font-medium text-[#66727A]">
              <a href="#how-it-works" className="hover:text-[#12345B] transition-colors">How It Works</a>
              <a href="#issues" className="hover:text-[#12345B] transition-colors">Report Categories</a>
              <a href="#resolved" className="hover:text-[#12345B] transition-colors">Verified Resolutions</a>
              <a href="#departments" className="hover:text-[#12345B] transition-colors">Departments</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-secondary btn-sm px-4 py-2 text-xs font-semibold" style={{ textDecoration: 'none' }}>
              Official Login
            </Link>
            <Link to="/register" className="btn btn-saffron btn-sm glow-saffron px-4 py-2 text-xs font-bold" style={{ textDecoration: 'none' }}>
              + Report an Issue
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden hero-gradient border-b border-[#D5D7D4] pt-12 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#C47A32]/10 text-[#A6621A] border border-[#C47A32]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C47A32]"></span>
                Municipal Transparency Engine
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#12345B] leading-[1.08] mb-6">
                Know <span className="underline decoration-[#C47A32] decoration-wavy decoration-2">Why</span>,<br />
                Not Just What.
              </h1>

              <p className="text-base sm:text-lg text-[#66727A] leading-relaxed max-w-xl mb-8">
                Empowering citizens to report civic failures in their ward, track exact status explanations at every step, and verify photo proof before any ticket is closed.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  to="/register"
                  className="btn btn-saffron glow-saffron px-6 py-3 text-sm font-bold shadow-md hover:scale-[1.02] transition-all"
                  style={{ textDecoration: 'none' }}
                >
                  🚀 Report Civic Issue Now
                </Link>
                <Link
                  to="/login"
                  className="btn btn-secondary px-6 py-3 text-sm font-semibold hover:border-[#12345B] transition-all"
                  style={{ textDecoration: 'none' }}
                >
                  Track Existing Ticket →
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#D5D7D4]/60">
                <div>
                  <div className="text-2xl font-black text-[#12345B] font-display">60 sec</div>
                  <div className="text-xs text-[#66727A] mt-0.5">Quick Photo Submission</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#3F6B52] font-display">100%</div>
                  <div className="text-xs text-[#66727A] mt-0.5">Direct Officer Routing</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#C47A32] font-display">Citizen</div>
                  <div className="text-xs text-[#66727A] mt-0.5">Verified Closure Only</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Resolution Showcase Card */}
            <div className="lg:col-span-5">
              <div className="glass-card rounded-xl p-6 relative">
                {/* Live Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#D5D7D4]">
                  <div className="flex items-center gap-2">
                    <span className="complaint-id text-xs font-bold">CW-2024-09842</span>
                    <span className="badge badge-resolved text-[10px]">RESOLVED</span>
                  </div>
                  <span className="text-[11px] text-[#8E9BAA] font-mono">Ward 104 · 2h ago</span>
                </div>

                {/* Complaint Title & Location */}
                <div className="my-4">
                  <h3 className="font-bold text-base text-[#12345B] mb-1">
                    Severe Pothole on 100ft Road
                  </h3>
                  <p className="text-xs text-[#66727A] flex items-center gap-1">
                    <span>📍</span> Near Indiranagar Metro Station, 2nd Stage
                  </p>
                </div>

                {/* Before / After Interactive Visual Mockup */}
                <div className="relative rounded-lg overflow-hidden border border-[#D5D7D4] h-52 bg-[#0B2742] mb-4">
                  {/* Before Side (Simulated damaged road) */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-4 text-white"
                    style={{
                      background: 'linear-gradient(rgba(11,39,66,0.3), rgba(11,39,66,0.9)), url("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80") center/cover'
                    }}
                  >
                    <div className="bg-red-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded w-max mb-1 uppercase tracking-wider">
                      Reported Evidence
                    </div>
                    <div className="text-xs text-white/90">Deep crater causing dangerous traffic diversions.</div>
                  </div>

                  {/* After Side (Simulated asphalt repair overlay) */}
                  <div
                    className="absolute inset-y-0 right-0 flex flex-col justify-end p-4 text-white border-l-2 border-white shadow-2xl"
                    style={{
                      width: `${100 - sliderPos}%`,
                      background: 'linear-gradient(rgba(63,107,82,0.4), rgba(11,39,66,0.9)), url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80") center/cover'
                    }}
                  >
                    <div className="bg-[#3F6B52] text-white text-[10px] font-bold px-2 py-0.5 rounded w-max mb-1 uppercase tracking-wider">
                      Officer Fix Evidence
                    </div>
                    <div className="text-xs text-white/90">Fresh asphalt layered, rolled & inspected.</div>
                  </div>

                  {/* Split Controller Slider */}
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    className="absolute inset-x-4 bottom-2 opacity-0 hover:opacity-100 cursor-ew-resize z-20 w-full"
                    title="Slide to compare Before / After"
                  />
                  <div
                    className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono pointer-events-none"
                  >
                    ↔ Drag to compare Before / After
                  </div>
                </div>

                {/* USP Callout Inside Card */}
                <div className="p-3 rounded bg-[#EFEDE8] border-l-4 border-[#12345B] text-xs">
                  <div className="font-bold text-[#12345B] text-[11px] uppercase tracking-wider mb-0.5">
                    CivicWatch Status Transparency:
                  </div>
                  <div className="text-[#17212B]">
                    "Officer Rajan Kumar patched the asphalt and leveled the curb. Verified by Citizen Priya on 08 Nov."
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Key Issue Categories Grid ─────────────────────────────────── */}
      <section id="issues" className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-widest text-[#C47A32] mb-2">
            Coverage & Categories
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12345B] tracking-tight">
            What Civic Issues Can You Report?
          </h2>
          <p className="text-sm text-[#66727A] mt-3">
            Every issue is directly dispatched to the designated engineering or health officer without departmental middlemen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Potholes & Road Cavities',
              desc: 'Craters, collapsed manhole perimeters, loose asphalt and sudden road sinks.',
              dept: 'Roads & Infrastructure',
              icon: '🕳️',
              color: 'from-amber-500/10 to-transparent',
              borderColor: 'hover:border-amber-500'
            },
            {
              title: 'Garbage & Debris Dumps',
              desc: 'Uncollected domestic waste piles, roadside debris dumps, and blocked bins.',
              dept: 'Sanitation & Solid Waste',
              icon: '🗑️',
              color: 'from-emerald-500/10 to-transparent',
              borderColor: 'hover:border-emerald-500'
            },
            {
              title: 'Streetlights & Dark Spots',
              desc: 'Damaged poles, non-functional sodium lamps, flickering bulbs and dark junctions.',
              dept: 'Electrical Engineering',
              icon: '💡',
              color: 'from-yellow-500/10 to-transparent',
              borderColor: 'hover:border-yellow-500'
            },
            {
              title: 'Drainage & Sewage Overflow',
              desc: 'Blocked stormwater drains, stagnant sewage water, and monsoon backflow.',
              dept: 'Stormwater & Drainage',
              icon: '🌊',
              color: 'from-blue-500/10 to-transparent',
              borderColor: 'hover:border-blue-500'
            },
            {
              title: 'Water Main Pipe Leaks',
              desc: 'High-pressure pipeline ruptures, leaking feeder valves and untreated overflows.',
              dept: 'Water Supply Board',
              icon: '💧',
              color: 'from-cyan-500/10 to-transparent',
              borderColor: 'hover:border-cyan-500'
            },
            {
              title: 'Crumbling Footpaths & Curbs',
              desc: 'Broken pedestrian slabs, missing curb railings, and dangerous open hazards.',
              dept: 'Public Works (PWD)',
              icon: '🚧',
              color: 'from-rose-500/10 to-transparent',
              borderColor: 'hover:border-rose-500'
            }
          ].map((cat, i) => (
            <div
              key={i}
              className={`stat-card card-hover-lift p-6 relative overflow-hidden bg-white border border-[#D5D7D4] rounded-xl flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#F6F5F1] flex items-center justify-center text-2xl shadow-inner">
                  {cat.icon}
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-1 rounded bg-[#12345B]/5 text-[#12345B]">
                  {cat.dept}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#12345B] mb-2">{cat.title}</h3>
                <p className="text-xs text-[#66727A] leading-relaxed mb-6">{cat.desc}</p>
              </div>
              <Link
                to="/register"
                className="text-xs font-bold text-[#C47A32] hover:text-[#A6621A] flex items-center gap-1.5 transition-colors pt-3 border-t border-[#E7E6E1]"
                style={{ textDecoration: 'none' }}
              >
                Report in this category <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works (Step by Step Pipeline) ────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-[#EFEDE8] border-y border-[#D5D7D4]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C47A32]">
              Accountability Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12345B] tracking-tight mt-2">
              From Report to Verified Fix in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Photo & Location',
                desc: 'Citizen captures evidence photo and provides ward landmark in under 60 seconds.',
                badge: 'Citizen Action',
                color: 'bg-[#12345B]'
              },
              {
                step: '02',
                title: 'Direct Assignment',
                desc: 'Admin directly assigns both the responsible municipal department and field officer.',
                badge: 'Admin Control',
                color: 'bg-[#C47A32]'
              },
              {
                step: '03',
                title: 'Field Action & Proof',
                desc: 'Assigned officer provides progress updates and uploads resolution evidence photo.',
                badge: 'Officer Action',
                color: 'bg-[#A2762D]'
              },
              {
                step: '04',
                title: 'Citizen Verification',
                desc: 'Citizen inspects the resolution. If satisfied, they confirm closure; if not, they dispute and reopen.',
                badge: 'Verified Closure',
                color: 'bg-[#3F6B52]'
              }
            ].map((s, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-[#D5D7D4] shadow-sm relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-display text-[#12345B]/30">{s.step}</span>
                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${s.color}`}>
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#12345B] mb-2">{s.title}</h3>
                  <p className="text-xs text-[#66727A] leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-[#E7E6E1] text-[11px] text-[#8E9BAA] font-mono">
                  {idx < 3 ? 'Stage ' + (idx + 1) + ' → Auto Forward' : 'Final Verified Outcome'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Performance Metrics Strip ───────────────────────────── */}
      <section className="bg-[#0B2742] text-white py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            <div className="pt-4 lg:pt-0">
              <div className="text-4xl lg:text-5xl font-black font-display text-white mb-2">2,847</div>
              <div className="text-xs uppercase tracking-wider text-white/60 font-semibold">Total Issues Reported</div>
              <div className="text-[11px] text-emerald-400 mt-1 font-mono">↑ 14% this month</div>
            </div>
            <div className="pt-4 lg:pt-0">
              <div className="text-4xl lg:text-5xl font-black font-display text-emerald-400 mb-2">98.2%</div>
              <div className="text-xs uppercase tracking-wider text-white/60 font-semibold">Verified Resolution Rate</div>
              <div className="text-[11px] text-white/50 mt-1 font-mono">Zero unconfirmed closures</div>
            </div>
            <div className="pt-4 lg:pt-0">
              <div className="text-4xl lg:text-5xl font-black font-display text-[#C47A32] mb-2">4.6 d</div>
              <div className="text-xs uppercase tracking-wider text-white/60 font-semibold">Average Turnaround</div>
              <div className="text-[11px] text-white/50 mt-1 font-mono">From report to inspection</div>
            </div>
            <div className="pt-4 lg:pt-0">
              <div className="text-4xl lg:text-5xl font-black font-display text-white mb-2">18</div>
              <div className="text-xs uppercase tracking-wider text-white/60 font-semibold">Active Municipal Wards</div>
              <div className="text-[11px] text-emerald-400 mt-1 font-mono">100% Ward Officer Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recently Resolved Live Feed ─────────────────────────────────── */}
      <section id="resolved" className="py-20 max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#C47A32] mb-1">
              Public Ledger
            </div>
            <h2 className="text-3xl font-extrabold text-[#12345B] tracking-tight">
              Recently Resolved in Your Neighborhood
            </h2>
          </div>
          <div className="flex gap-2">
            {(['all', 'roads', 'sanitation', 'lighting'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs rounded-full capitalize font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-[#12345B] text-white shadow-sm'
                    : 'bg-white text-[#66727A] border border-[#D5D7D4] hover:bg-[#F6F5F1]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 'CW-2024-09801',
              title: 'Clogged storm drain cleared before monsoon',
              dept: 'Sanitation & Drainage',
              location: '8th Main, Malleshwaram',
              days: 2,
              status: 'Closed & Verified',
              citizenFeedback: 'Water drains smoothly now. Thanks to officer Sunita.',
              priority: 'high'
            },
            {
              id: 'CW-2024-09789',
              title: 'Replaced dead streetlight pole and timer switch',
              dept: 'Electricity & Lighting',
              location: '14th Cross, HSR Layout Sector 2',
              days: 3,
              status: 'Closed & Verified',
              citizenFeedback: 'Night visibility restored for pedestrians.',
              priority: 'medium'
            },
            {
              id: 'CW-2024-09765',
              title: 'Garbage accumulation cleared outside market gate',
              dept: 'Sanitation Department',
              location: 'Gandhi Bazaar Circle',
              days: 1,
              status: 'Closed & Verified',
              citizenFeedback: 'Sanitation truck cleared the spot and sanitized the curb.',
              priority: 'high'
            }
          ].map(issue => (
            <div key={issue.id} className="stat-card p-6 bg-white border border-[#D5D7D4] rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="complaint-id text-[11px] font-bold">{issue.id}</span>
                  <span className={`badge badge-${issue.priority} text-[10px]`}>{issue.priority.toUpperCase()}</span>
                </div>
                <h3 className="font-bold text-base text-[#12345B] mb-2 leading-snug">{issue.title}</h3>
                <div className="text-xs text-[#66727A] mb-4 flex items-center gap-1">
                  <span>📍</span> {issue.location}
                </div>
                <div className="p-3 rounded bg-[#F6F5F1] text-xs text-[#17212B] italic mb-4 border border-[#E7E6E1]">
                  "{issue.citizenFeedback}"
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E7E6E1] text-xs">
                <span className="badge badge-resolved text-[10px] font-bold">✓ {issue.status}</span>
                <span className="text-[#8E9BAA] font-mono">Resolved in {issue.days}d</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ready to take action CTA Strip ───────────────────────────── */}
      <section className="bg-gradient-to-r from-[#12345B] to-[#0B2742] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display mb-4 tracking-tight">
            Spot a civic issue in your ward right now?
          </h2>
          <p className="text-white/80 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Take a quick photo, drop the location, and let CivicWatch automatically route it to the exact responsible officer with complete status tracking.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn btn-saffron glow-saffron px-8 py-3.5 text-sm font-bold shadow-lg"
              style={{ textDecoration: 'none' }}
            >
              Report Issue in 60 Seconds
            </Link>
            <Link
              to="/login"
              className="btn btn-secondary px-8 py-3.5 text-sm font-semibold hover:bg-white/90"
              style={{ textDecoration: 'none' }}
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#0B2742] text-white border-t border-white/10 pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="text-xl font-black mb-3">
                Civic<span style={{ color: 'var(--saffron)' }}>Watch</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed max-w-sm mb-4">
                Full-Stack Civic Complaint Management Platform. Built for CS3301 Full Stack Development at RV University.
              </p>
              <div className="text-xs text-white/40">
                Connected to live MongoDB Atlas Cluster with JWT Authentication and Multi-Role Access Control.
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3">Quick Navigation</div>
              <ul className="space-y-2 text-xs text-white/60">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#issues" className="hover:text-white transition-colors">Complaint Categories</a></li>
                <li><a href="#resolved" className="hover:text-white transition-colors">Resolved Ledger</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Official & Citizen Login</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3">Evaluation Roles</div>
              <ul className="space-y-2 text-xs text-white/60 font-mono">
                <li>Citizen: priya.sharma@email.com</li>
                <li>Officer: rajan.kumar@civic.gov.in</li>
                <li>Admin: admin@civic.gov.in</li>
                <li className="text-[#C47A32]">Password: password</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
            <div>© 2024 CivicWatch · RV University CS3301 Full Stack Development</div>
            <div className="flex gap-4">
              <span>React 18</span>
              <span>•</span>
              <span>Express.js</span>
              <span>•</span>
              <span>MongoDB Atlas</span>
              <span>•</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
