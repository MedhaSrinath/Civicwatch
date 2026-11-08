import { useState } from 'react';
import { Link } from 'react-router-dom';

function CivicLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };
  return (
    <span className={`civicwatch-logo ${sizes[size]} tracking-tight font-extrabold flex items-center gap-1.5`}>
      <span className="w-6 h-6 rounded-md bg-[#12345B] text-white text-xs flex items-center justify-center font-black">CW</span>
      <span>Civic<span style={{ color: 'var(--saffron)' }}>Watch</span></span>
    </span>
  );
}

export function LandingPage() {
  const [sliderPos, setSliderPos] = useState(50);
  const selectedWard = 'Ward 104 (Indiranagar)';

  const issueCategories = [
    { title: 'Roads & Potholes', icon: '🕳️', count: 142, dept: 'Infrastructure' },
    { title: 'Waste Management', icon: '🗑️', count: 89, dept: 'Sanitation' },
    { title: 'Street Lighting', icon: '💡', count: 64, dept: 'Electricity' },
    { title: 'Drainage & Stormwater', icon: '🌊', count: 53, dept: 'Drainage' },
    { title: 'Water Feeder Pipes', icon: '💧', count: 38, dept: 'Water Supply' },
    { title: 'Pedestrian Footpaths', icon: '🚧', count: 31, dept: 'Public Works' }
  ];

  return (
    <div className="min-h-screen selection:bg-[#C47A32]/20" style={{ background: '#F4F3EF', fontFamily: 'var(--font-body)' }}>

      {/* ── Top Micro-Bar ───────────────────────────────────────────── */}
      <div className="bg-[#0B2742] text-white/90 text-[11px] py-1.5 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-emerald-400">Live Municipal Dashboard:</span>
            <span className="text-white/70">Connected to 18 Wards with Real-time Officer Routing</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-white/60 font-mono text-[10px]">
            <span>Active Ward: {selectedWard}</span>
            <span>•</span>
            <span>Toll-Free: 1800-CIVIC-WATCH</span>
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#D5D7D4]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <CivicLogo size="md" />
            <div className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-[#66727A]">
              <a href="#bento-overview" className="hover:text-[#12345B] transition-colors">Overview</a>
              <a href="#how-it-works" className="hover:text-[#12345B] transition-colors">How It Works</a>
              <a href="#categories" className="hover:text-[#12345B] transition-colors">Categories</a>
              <a href="#live-ledger" className="hover:text-[#12345B] transition-colors">Resolved Ledger</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-xs font-semibold rounded-lg text-[#12345B] hover:bg-[#F6F5F1] transition-all" style={{ textDecoration: 'none' }}>
              Official Login
            </Link>
            <Link to="/register" className="btn btn-saffron glow-saffron px-5 py-2 text-xs font-bold rounded-lg shadow-sm" style={{ textDecoration: 'none' }}>
              + Report an Issue
            </Link>
          </div>
        </div>
      </nav>

      {/* ── BENTO GRID HERO ─────────────────────────────────────────── */}
      <section id="bento-overview" className="pt-10 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-[#12345B]/10 text-[#12345B] border border-[#12345B]/20 mb-3">
            <span>🏛️</span> CS3301 Full Stack Civic Platform · Phase 2 Edition
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#12345B] tracking-tight leading-none font-display">
            The Transparent Civic Operating System.
          </h1>
          <p className="text-sm text-[#66727A] mt-2 max-w-2xl">
            Where citizens don't just see a generic status label—they see the assigned officer, photographic proof of work, and verify resolution before closure.
          </p>
        </div>

        {/* ── The Bento Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

          {/* Tile 1: Main Action & Value (Spans 7 cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-[#D5D7D4] p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C47A32]/10 via-[#12345B]/5 to-transparent rounded-bl-full pointer-events-none"></div>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#8E9BAA] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#C47A32]"></span>
                DIRECT OFFICER ACCOUNTABILITY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#12345B] leading-tight mb-4">
                Report a civic defect in 60s.<br />
                Follow every step transparently.
              </h2>
              <p className="text-xs sm:text-sm text-[#66727A] leading-relaxed max-w-lg mb-6">
                Upload photo evidence, pinpoint your ward landmark, and watch our administrative routing engine assign both the department and the responsible field officer directly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#E7E6E1]">
              <Link
                to="/register"
                className="btn btn-saffron glow-saffron px-6 py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                style={{ textDecoration: 'none' }}
              >
                🚀 Report Incident Now
              </Link>
              <Link
                to="/login"
                className="px-5 py-3 rounded-xl text-xs font-semibold bg-[#F6F5F1] text-[#12345B] hover:bg-[#E7E6E1] transition-colors"
                style={{ textDecoration: 'none' }}
              >
                Track by ID →
              </Link>
            </div>
          </div>

          {/* Tile 2: Live Before / After Resolution Photo Slider (Spans 5 cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-[#D5D7D4] p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="complaint-id text-[11px] font-bold">CW-2024-09842</span>
                <span className="badge badge-resolved text-[10px]">RESOLVED</span>
              </div>
              <span className="text-[11px] font-mono text-[#8E9BAA]">Ward 104</span>
            </div>

            {/* Split Image Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-[#D5D7D4] h-48 bg-[#0B2742]">
              {/* Before Side */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-3 text-white"
                style={{
                  background: 'linear-gradient(rgba(11,39,66,0.3), rgba(11,39,66,0.9)), url("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80") center/cover'
                }}
              >
                <div className="bg-red-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded w-max mb-1 uppercase tracking-wider">
                  Citizen Photo
                </div>
                <div className="text-[11px] text-white/90">Deep crater causing dangerous traffic diversions.</div>
              </div>

              {/* After Side */}
              <div
                className="absolute inset-y-0 right-0 flex flex-col justify-end p-3 text-white border-l-2 border-white shadow-2xl"
                style={{
                  width: `${100 - sliderPos}%`,
                  background: 'linear-gradient(rgba(63,107,82,0.4), rgba(11,39,66,0.9)), url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80") center/cover'
                }}
              >
                <div className="bg-[#3F6B52] text-white text-[9px] font-bold px-2 py-0.5 rounded w-max mb-1 uppercase tracking-wider">
                  Officer Fix Proof
                </div>
                <div className="text-[11px] text-white/90">Fresh asphalt layered & compacted.</div>
              </div>

              {/* Range input slider */}
              <input
                type="range"
                min="10"
                max="90"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-x-2 bottom-2 opacity-0 hover:opacity-100 cursor-ew-resize z-20 w-full"
                title="Slide to compare"
              />
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-mono pointer-events-none">
                ↔ Drag to compare proof
              </div>
            </div>

            <div className="mt-3 text-[11px] text-[#66727A] flex items-center justify-between">
              <span>Verified Closure Rate: <strong className="text-emerald-700">98.2%</strong></span>
              <span className="text-[#12345B] font-semibold">Confirmed by Priya</span>
            </div>
          </div>

          {/* Tile 3: Live On-Duty Officer Card (Spans 4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-[#D5D7D4] p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E9BAA]">Assigned Field Staff</span>
              <span className="badge badge-resolved text-[9px]">ONLINE</span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#12345B] text-white text-base font-bold flex items-center justify-center font-display shadow-sm">
                RK
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#12345B]">Rajan Kumar</h4>
                <div className="text-xs text-[#66727A]">Executive Engineer · Roads Dept</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">● 14 Complaints Resolved this week</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F5F1] text-xs text-[#17212B] border border-[#E7E6E1]">
              <span className="font-bold text-[#12345B]">Active Role:</span> Direct administrative responsibility for Ward 104 & Ward 105 infrastructure.
            </div>
          </div>

          {/* Tile 4: Average Resolution Performance (Spans 4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-[#D5D7D4] p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E9BAA]">Turnaround SLA</span>
              <span className="text-xs font-bold text-[#C47A32]">Target: &lt; 5 Days</span>
            </div>

            <div className="my-2">
              <div className="text-4xl font-black text-[#12345B] font-display">4.6 Days</div>
              <div className="text-xs text-[#66727A] mt-1">Average time from citizen report to verified closure</div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono text-[#8E9BAA]">
                <span>Routing Speed: 1.2h</span>
                <span>Work: 3.4d</span>
              </div>
              <div className="w-full bg-[#E7E6E1] h-2 rounded-full overflow-hidden">
                <div className="bg-[#3F6B52] h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>

          {/* Tile 5: Live Database Status (Spans 4 cols) */}
          <div className="md:col-span-4 bg-[#0B2742] text-white rounded-2xl border border-white/10 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Database Engine</span>
              <span className="pulse-dot"></span>
            </div>

            <div>
              <div className="text-2xl font-bold font-display text-white mb-1">MongoDB Atlas</div>
              <p className="text-xs text-white/70 leading-relaxed">
                Live replica set cluster with JWT auth tokens, salted bcrypt hashing, and Multer binary isolation.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-mono">
              <span>Collection: civicwatch</span>
              <span className="text-emerald-400">Connected ✓</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── CATEGORY QUICK GRID ────────────────────────────────────────── */}
      <section id="categories" className="py-12 px-6 max-w-7xl mx-auto border-t border-[#D5D7D4]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-[#12345B] tracking-tight">Active Issue Categories</h3>
            <p className="text-xs text-[#66727A] mt-1">Reported issues are grouped into six core municipal domains</p>
          </div>
          <Link to="/register" className="text-xs font-bold text-[#C47A32] hover:underline" style={{ textDecoration: 'none' }}>
            Report in any category →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {issueCategories.map((c, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#D5D7D4] p-4 text-center hover:border-[#12345B] hover:shadow-md transition-all cursor-pointer">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="text-xs font-bold text-[#12345B] mb-1">{c.title}</div>
              <div className="text-[10px] text-[#8E9BAA] font-mono">{c.dept}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4-STEP PROTOCOL ──────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 bg-[#EFEDE8] border-y border-[#D5D7D4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C47A32]">Resolution Protocol</span>
            <h2 className="text-3xl font-black text-[#12345B] tracking-tight mt-1">How Complaints Progress</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { num: '01', title: 'Citizen Reports', desc: 'Upload photo and landmark. Ticket status starts at Pending with clear explanation.', tag: 'Citizen' },
              { num: '02', title: 'Admin Assigns', desc: 'Administrator assigns department and specific officer. Status changes to Assigned.', tag: 'Admin' },
              { num: '03', title: 'Officer Resolves', desc: 'Officer updates progress notes, uploads resolution photo, and marks Resolved.', tag: 'Officer' },
              { num: '04', title: 'Citizen Verifies', desc: 'Citizen inspects the fix. Confirm to close, or dispute with remarks to reopen.', tag: 'Verification' }
            ].map((p, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-[#D5D7D4] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-[#12345B]/30 font-display">{p.num}</span>
                    <span className="badge badge-reported text-[9px]">{p.tag}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#12345B] mb-1.5">{p.title}</h4>
                  <p className="text-xs text-[#66727A] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="bg-[#0B2742] text-white pt-12 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            <strong className="text-white">CivicWatch</strong> · CS3301 Full Stack Development · RV University
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-white transition-colors" style={{ textDecoration: 'none' }}>Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors" style={{ textDecoration: 'none' }}>Register</Link>
            <span>•</span>
            <span className="text-emerald-400">Atlas Live ✓</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
