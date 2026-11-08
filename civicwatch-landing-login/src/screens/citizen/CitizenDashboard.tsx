import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import type { Complaint } from '../../types';
import { Navbar } from '../../components/Navbar';
import toast from 'react-hot-toast';

export function CitizenDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get('/complaints');
      setComplaints(res.data);
    } catch (err: any) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesFilter = filter === 'all' || c.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.complaintId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'badge-reported';
      case 'Assigned': return 'badge-assigned';
      case 'In Progress': return 'badge-inprogress';
      case 'Resolved': return 'badge-resolved';
      case 'Closed': return 'badge-closed';
      case 'Reopened': return 'badge-escalated';
      default: return 'badge-reported';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      case 'Low': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  const counts = {
    total: complaints.length,
    active: complaints.filter(c => ['Pending', 'Assigned', 'In Progress', 'Reopened'].includes(c.status)).length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    closed: complaints.filter(c => c.status === 'Closed').length
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#C47A32]/20" style={{ background: '#F4F3EF' }}>
      <Navbar />

      <main className="main-content flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C47A32] mb-1">
              Citizen Portal
            </div>
            <h1 className="text-3xl font-black text-[#12345B] tracking-tight font-display">
              My Civic Complaints
            </h1>
            <p className="text-xs text-[#66727A] mt-1">
              Track real-time progress, officer notes, and verify resolutions before ticket closure
            </p>
          </div>
          <Link
            to="/report"
            className="btn btn-saffron glow-saffron px-5 py-2.5 text-xs font-bold rounded-xl shadow-sm self-start sm:self-auto flex items-center gap-2 cursor-pointer"
            style={{ textDecoration: 'none' }}
          >
            <span>+</span> Report New Issue
          </Link>
        </div>

        {/* ── Bento-Style Stat Metric Cards ────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-[#D5D7D4] p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-bold text-[#8E9BAA]">Total Reported</div>
              <div className="text-3xl font-black text-[#12345B] mt-1 font-display">{counts.total}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#12345B]/10 text-[#12345B] flex items-center justify-center text-lg">
              📋
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5D7D4] p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-bold text-[#8E9BAA]">In Progress / Active</div>
              <div className="text-3xl font-black text-[#A2762D] mt-1 font-display">{counts.active}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-lg">
              ⏳
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5D7D4] p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-bold text-[#8E9BAA]">Awaiting My Verification</div>
              <div className="text-3xl font-black text-emerald-700 mt-1 font-display">{counts.resolved}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-lg">
              🔍
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5D7D4] p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-bold text-[#8E9BAA]">Closed & Verified</div>
              <div className="text-3xl font-black text-[#66727A] mt-1 font-display">{counts.closed}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-700 flex items-center justify-center text-lg">
              ✓
            </div>
          </div>
        </div>

        {/* ── Search & Filter Bar ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#D5D7D4] p-3 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['all', 'pending', 'assigned', 'in progress', 'resolved', 'closed', 'reopened'].map((t) => {
              const isActive = filter === t;
              const count = t === 'all'
                ? complaints.length
                : complaints.filter(c => c.status.toLowerCase() === t).length;

              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#12345B] text-white shadow-xs'
                      : 'text-[#66727A] hover:bg-[#F6F5F1] hover:text-[#12345B]'
                  }`}
                >
                  <span>{t}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#8E9BAA]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Input */}
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search by ID, keyword, or landmark..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#D5D7D4] focus:border-[#12345B] outline-none"
            />
          </div>
        </div>

        {/* ── Complaint Cards List ─────────────────────────────────────── */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#D5D7D4]">
            <div className="w-8 h-8 border-2 border-[#12345B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <div className="text-xs text-[#8E9BAA] font-mono">Fetching complaints from MongoDB Atlas...</div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#D5D7D4] text-center py-16 px-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F6F5F1] text-2xl flex items-center justify-center mx-auto mb-3">
              📝
            </div>
            <h3 className="text-base font-bold text-[#12345B] mb-1">
              {filter === 'all' ? 'No complaints reported yet' : `No complaints found with status "${filter}"`}
            </h3>
            <p className="text-xs text-[#66727A] max-w-sm mx-auto mb-6">
              Spot a pothole, broken streetlight, or garbage heap? Report it in 60 seconds with photos.
            </p>
            {filter === 'all' && (
              <Link to="/report" className="btn btn-saffron glow-saffron px-5 py-2 text-xs font-bold rounded-xl" style={{ textDecoration: 'none' }}>
                Report Your First Issue
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map(complaint => (
              <div
                key={complaint._id}
                onClick={() => navigate(`/complaint/${complaint._id}`)}
                className="bg-white rounded-2xl border border-[#D5D7D4] p-6 hover:border-[#12345B] hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="complaint-id text-xs font-bold">{complaint.complaintId}</span>
                    <span className={`badge ${getStatusBadgeClass(complaint.status)} text-[10px]`}>
                      {complaint.status}
                    </span>
                    <span className={`badge ${getPriorityBadgeClass(complaint.priority)} text-[10px]`}>
                      {complaint.priority}
                    </span>
                    {complaint.status === 'Resolved' && (
                      <span className="badge badge-resolved text-[10px] animate-pulse">
                        Action Required: Verify Resolution
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#8E9BAA] font-mono">
                    Reported {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#12345B] group-hover:text-[#C47A32] transition-colors mb-2">
                  {complaint.title}
                </h3>

                <p className="text-xs text-[#66727A] line-clamp-2 leading-relaxed mb-4">
                  {complaint.description}
                </p>

                {/* USP Callout: Status Explanation */}
                <div className="p-3 rounded-xl bg-[#F6F5F1] border-l-4 border-[#12345B] text-xs flex items-start gap-2 mb-4">
                  <span className="font-bold text-[#12345B] shrink-0 text-[11px] uppercase tracking-wide">
                    Status Reason:
                  </span>
                  <span className="text-[#17212B]">{complaint.statusExplanation}</span>
                </div>

                {/* Footer Metadata */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[#E7E6E1] text-xs text-[#66727A] gap-2">
                  <div className="flex items-center gap-4 text-[11px]">
                    <span>📍 {complaint.location}</span>
                    <span>📂 {typeof complaint.category === 'object' ? complaint.category.name : 'General'}</span>
                    {complaint.assignedOfficer && (
                      <span>👨‍💼 Officer {complaint.assignedOfficer.name}</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#12345B] group-hover:text-[#C47A32] flex items-center gap-1 transition-colors">
                    View Full Evidence & Timeline →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
