import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import type { Complaint } from '../../types';
import { Navbar } from '../../components/Navbar';
import toast from 'react-hot-toast';

export function OfficerDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main className="main-content flex-1" style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '28px 24px' }}>
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Officer Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage and resolve civic complaints assigned to your department
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Assigned to Me</div>
            <div className="text-2xl font-bold mt-1" style={{ color: 'var(--navy)' }}>{complaints.length}</div>
          </div>
          <div className="stat-card">
            <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Active / In Progress</div>
            <div className="text-2xl font-bold mt-1" style={{ color: 'var(--amber)' }}>
              {complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Reopened').length}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Resolved</div>
            <div className="text-2xl font-bold mt-1" style={{ color: 'var(--green)' }}>
              {complaints.filter(c => c.status === 'Resolved').length}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Closed by Citizen</div>
            <div className="text-2xl font-bold mt-1" style={{ color: 'var(--text-secondary)' }}>
              {complaints.filter(c => c.status === 'Closed').length}
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="tab-bar mb-6 overflow-x-auto">
          {['all', 'assigned', 'in progress', 'reopened', 'resolved', 'closed'].map((t) => (
            <div
              key={t}
              className={`tab-item capitalize whitespace-nowrap ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t} {t === 'all' ? `(${complaints.length})` : `(${complaints.filter(c => c.status.toLowerCase() === t).length})`}
            </div>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            Loading assigned complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="card text-center py-12 px-6">
            <div className="text-base font-semibold mb-2" style={{ color: 'var(--navy)' }}>
              No complaints found
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {filter === 'all'
                ? 'No civic complaints have been assigned to you yet.'
                : `No complaints with status "${filter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map(complaint => (
              <div key={complaint._id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="complaint-id">{complaint.complaintId}</span>
                    <span className={`badge ${getStatusBadgeClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <span className={`badge ${getPriorityBadgeClass(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                    {complaint.status === 'Reopened' && (
                      <span className="badge badge-escalated">Disputed by Citizen</span>
                    )}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Reported on {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--navy)' }}>
                  {complaint.title}
                </h3>

                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {complaint.description}
                </p>

                {/* Location + Category */}
                <div className="flex flex-wrap items-center gap-4 text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                  <span>📍 {complaint.location}</span>
                  <span>📂 {typeof complaint.category === 'object' ? complaint.category.name : 'Uncategorized'}</span>
                  <span>👤 {complaint.citizen?.name} ({complaint.citizen?.email})</span>
                </div>

                {/* Status explanation */}
                <div
                  className="p-2.5 rounded text-xs mb-4 flex items-start gap-2"
                  style={{ background: 'var(--bg-warm)', borderLeft: '3px solid var(--navy)' }}
                >
                  <span className="font-bold text-xs" style={{ color: 'var(--navy)' }}>Status:</span>
                  <span style={{ color: 'var(--text)' }}>{complaint.statusExplanation}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => navigate(`/complaint/${complaint._id}`)}
                  >
                    View Full Details & History
                  </button>

                  {complaint.status !== 'Closed' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setNewStatus(complaint.status === 'Assigned' || complaint.status === 'Reopened' ? 'In Progress' : 'Resolved');
                        setRemarks(complaint.resolutionRemarks || '');
                      }}
                    >
                      Update Status / Resolve →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Status Update */}
        {selectedComplaint && (
          <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>
                    Update Complaint Status
                  </h3>
                  <span className="complaint-id text-xs mt-1">{selectedComplaint.complaintId}</span>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 text-lg"
                  onClick={() => setSelectedComplaint(null)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateStatus}>
                <div className="form-group">
                  <label className="form-label">New Status *</label>
                  <select
                    className="form-input"
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as 'In Progress' | 'Resolved')}
                    required
                  >
                    <option value="In Progress">In Progress (Work ongoing)</option>
                    <option value="Resolved">Resolved (Work completed, ready for citizen verification)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Progress / Resolution Remarks *</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder={newStatus === 'Resolved' ? 'Explain what action was taken to fix the issue...' : 'Describe what progress has been made...'}
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    required
                  />
                  <span className="text-xs mt-1 block" style={{ color: 'var(--text-muted)' }}>
                    This explanation will be visible to the citizen and admin for transparency.
                  </span>
                </div>

                {newStatus === 'Resolved' && (
                  <div className="form-group">
                    <label className="form-label">Resolution Photograph (Optional)</label>
                    <input
                      type="file"
                      className="form-input"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setResolutionPhoto(e.target.files[0]);
                        }
                      }}
                    />
                    <span className="text-xs mt-1 block" style={{ color: 'var(--text-muted)' }}>
                      Upload a photo showing the completed work as evidence.
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedComplaint(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Updating...' : 'Save & Update Status'}
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
