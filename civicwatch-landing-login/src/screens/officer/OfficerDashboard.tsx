import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import type { Complaint } from '../../types';
import { Navbar } from '../../components/Navbar';
import { CivicMap } from '../../components/CivicMap';
import toast from 'react-hot-toast';

export function OfficerDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [mapComplaints, setMapComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  // Status update modal state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<'In Progress' | 'Resolved'>('In Progress');
  const [remarks, setRemarks] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignedComplaints();
    fetchMapComplaints();
  }, []);

  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get('/complaints');
      setComplaints(res.data);
    } catch (err) {
      toast.error('Failed to load assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchMapComplaints = async () => {
    try {
      const res = await API.get('/complaints/map');
      setMapComplaints(res.data);
    } catch (err) {
      console.error('Failed to load officer map complaints', err);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    if (newStatus === 'Resolved' && !remarks.trim()) {
      toast.error('Please provide resolution remarks explaining the work done');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('status', newStatus);
      formData.append('remarks', remarks);
      if (resolutionPhoto) {
        formData.append('resolutionPhoto', resolutionPhoto);
      }

      await API.put(`/complaints/${selectedComplaint._id}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(`Complaint updated to ${newStatus}`);
      setSelectedComplaint(null);
      setRemarks('');
      setResolutionPhoto(null);
      fetchAssignedComplaints();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update complaint status');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (filter === 'all') return true;
    return c.status.toLowerCase() === filter.toLowerCase();
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
    active: complaints.filter(c => ['In Progress', 'Assigned', 'Reopened'].includes(c.status)).length,
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
              Field Operations Portal
            </div>
            <h1 className="text-3xl font-black text-[#12345B] tracking-tight font-display">
              Officer Work Queue
            </h1>
            <p className="text-xs text-[#66727A] mt-1">
              Review assigned civic complaints, update progress notes, and upload photo proof before resolving
            </p>
          </div>
        </div>

        {/* ── Metric Tiles ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-[#D5D7D4] p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-bold text-[#8E9BAA]">Assigned to Me</div>
              <div className="text-3xl font-black text-[#12345B] mt-1 font-display">{counts.total}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#12345B]/10 text-[#12345B] flex items-center justify-center text-lg">
              🎯
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5D7D4] p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-bold text-[#8E9BAA]">Active / Pending Action</div>
              <div className="text-3xl font-black text-[#A2762D] mt-1 font-display">{counts.active}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-lg">
              ⚡
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5D7D4] p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-bold text-[#8E9BAA]">Resolved (Awaiting Citizen)</div>
              <div className="text-3xl font-black text-emerald-700 mt-1 font-display">{counts.resolved}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-lg">
              ✓
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5D7D4] p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-bold text-[#8E9BAA]">Closed & Verified</div>
              <div className="text-3xl font-black text-[#66727A] mt-1 font-display">{counts.closed}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-700 flex items-center justify-center text-lg">
              🏁
            </div>
          </div>
        </div>

        {/* ── Status Tab Bar ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#D5D7D4] p-3 mb-6 flex items-center gap-1 overflow-x-auto shadow-xs">
          {['all', 'assigned', 'in progress', 'reopened', 'resolved', 'closed'].map((t) => {
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

        {/* ── Complaint Cards List ─────────────────────────────────────── */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#D5D7D4]">
            <div className="w-8 h-8 border-2 border-[#12345B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <div className="text-xs text-[#8E9BAA] font-mono">Loading assigned complaints...</div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#D5D7D4] text-center py-16 px-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F6F5F1] text-2xl flex items-center justify-center mx-auto mb-3">
              🎉
            </div>
            <h3 className="text-base font-bold text-[#12345B] mb-1">Queue is clear!</h3>
            <p className="text-xs text-[#66727A]">
              {filter === 'all'
                ? 'No complaints currently assigned to you.'
                : `No complaints found with status "${filter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map(complaint => (
              <div
                key={complaint._id}
                className="bg-white rounded-2xl border border-[#D5D7D4] p-6 hover:border-[#12345B] shadow-xs transition-all"
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
                    {complaint.status === 'Reopened' && (
                      <span className="badge badge-escalated text-[10px] animate-pulse">
                        ⚠️ Citizen Disputed Resolution
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#8E9BAA] font-mono">
                    Reported on {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#12345B] mb-2">{complaint.title}</h3>
                <p className="text-xs text-[#66727A] line-clamp-2 leading-relaxed mb-4">{complaint.description}</p>

                {/* Metadata tags */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#66727A] mb-4">
                  <span>📍 {complaint.location}</span>
                  <span>📂 {typeof complaint.category === 'object' ? complaint.category.name : 'Uncategorized'}</span>
                  <span>👤 {complaint.citizen?.name} ({complaint.citizen?.email})</span>
                </div>

                {/* Status explanation */}
                <div className="p-3 rounded-xl bg-[#F6F5F1] border-l-4 border-[#12345B] text-xs flex items-start gap-2 mb-5">
                  <span className="font-bold text-[#12345B] shrink-0 text-[11px] uppercase tracking-wide">Status:</span>
                  <span className="text-[#17212B]">{complaint.statusExplanation}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E7E6E1]">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm text-xs rounded-lg cursor-pointer"
                    onClick={() => navigate(`/complaint/${complaint._id}`)}
                  >
                    View Full Evidence & Timeline →
                  </button>

                  {complaint.status !== 'Closed' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm text-xs rounded-lg font-bold cursor-pointer"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setNewStatus(complaint.status === 'Assigned' || complaint.status === 'Reopened' ? 'In Progress' : 'Resolved');
                        setRemarks(complaint.resolutionRemarks || '');
                      }}
                    >
                      Update Status / Upload Proof →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Officer Assigned Complaints Field Map ───────────────────── */}
        <div className="mt-12">
          <CivicMap
            complaints={mapComplaints}
            height="440px"
            showLegend={true}
            title="Your Assigned Complaints – Field Operations Map"
            subtitle="Geographic view of civic issues assigned to you across wards. Plan field repairs efficiently."
          />
        </div>

        {/* Modal for Status Update */}
        {selectedComplaint && (
          <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
            <div className="modal rounded-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-[#12345B]">
                    Update Complaint Status
                  </h3>
                  <span className="complaint-id text-xs mt-1">{selectedComplaint.complaintId}</span>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
                  onClick={() => setSelectedComplaint(null)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="form-label text-xs uppercase tracking-wider text-[#66727A]">
                    Target Status *
                  </label>
                  <select
                    className="form-input rounded-lg text-sm"
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as 'In Progress' | 'Resolved')}
                    required
                  >
                    <option value="In Progress">In Progress (Field crew dispatched / work ongoing)</option>
                    <option value="Resolved">Resolved (Work completed, ready for citizen verification)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs uppercase tracking-wider text-[#66727A]">
                    Resolution / Progress Remarks *
                  </label>
                  <textarea
                    className="form-input rounded-lg text-sm"
                    rows={4}
                    placeholder={newStatus === 'Resolved' ? 'Describe the work executed to fix the problem...' : 'Describe current progress made...'}
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    required
                  />
                  <span className="text-[11px] text-[#8E9BAA] mt-1 block">
                    This transparent reason will be immediately visible to the citizen and admin.
                  </span>
                </div>

                {newStatus === 'Resolved' && (
                  <div>
                    <label className="form-label text-xs uppercase tracking-wider text-[#66727A]">
                      Resolution Proof Photograph (Optional)
                    </label>
                    <input
                      type="file"
                      className="form-input rounded-lg text-sm"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setResolutionPhoto(e.target.files[0]);
                        }
                      }}
                    />
                    <span className="text-[11px] text-[#8E9BAA] mt-1 block">
                      Upload evidence showing the completed repair for citizen inspection.
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E6E1]">
                  <button
                    type="button"
                    className="btn btn-secondary px-4 py-2 text-xs rounded-lg cursor-pointer"
                    onClick={() => setSelectedComplaint(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-5 py-2 text-xs font-bold rounded-lg cursor-pointer"
                    disabled={submitting}
                  >
                    {submitting ? 'Updating...' : 'Save & Notify Citizen'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
