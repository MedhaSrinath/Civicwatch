import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import type { Complaint } from '../../types';
import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  // Citizen feedback form state
  const [feedbackRemarks, setFeedbackRemarks] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/complaints/${id}`);
      setComplaint(res.data);
    } catch (err: any) {
      toast.error('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (action: 'confirmed' | 'disputed') => {
    if (action === 'disputed' && !feedbackRemarks.trim()) {
      toast.error('Please provide remarks explaining why the resolution is unsatisfactory');
      return;
    }

    try {
      setFeedbackLoading(true);
      const res = await API.put(`/complaints/${id}/feedback`, {
        feedback: action,
        remarks: feedbackRemarks
      });
      setComplaint(res.data);
      toast.success(action === 'confirmed' ? 'Resolution confirmed! Complaint closed.' : 'Resolution disputed. Complaint reopened.');
      setFeedbackRemarks('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

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

  const getBackPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'officer') return '/officer';
    return '/dashboard';
  };

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const serverBase = apiUrl.replace('/api', '');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading complaint details...</div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="card p-8 text-center">
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>Complaint Not Found</h2>
            <Link to={getBackPath()} className="btn btn-primary btn-sm">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const isCitizen = user?.role === 'citizen';
  const canProvideFeedback = isCitizen && complaint.status === 'Resolved';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main className="main-content flex-1" style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '28px 24px' }}>
        {/* Navigation link */}
        <Link to={getBackPath()} className="text-xs hover:underline flex items-center gap-1 mb-4" style={{ color: 'var(--navy)', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>

        {/* Complaint Header */}
        <div className="card p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="complaint-id text-sm">{complaint.complaintId}</span>
              <span className={`badge ${getStatusBadgeClass(complaint.status)} text-xs`}>
                {complaint.status}
              </span>
              <span className={`badge ${getPriorityBadgeClass(complaint.priority)} text-xs`}>
                {complaint.priority} Priority
              </span>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Submitted on {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
            {complaint.title}
          </h1>

          {/* USP: Transparent Status Explanation */}
          <div
            className="p-4 rounded text-sm mb-4"
            style={{ background: 'var(--bg-warm)', borderLeft: '4px solid var(--navy)' }}
          >
            <div className="font-bold text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
              Current Status Explanation
            </div>
            <div style={{ color: 'var(--text)', lineHeight: 1.5 }}>
              {complaint.statusExplanation}
            </div>
          </div>

          {/* Meta details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t text-xs" style={{ borderColor: 'var(--border-light)' }}>
            <div>
              <span className="font-bold block" style={{ color: 'var(--text-muted)' }}>CATEGORY</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                {typeof complaint.category === 'object' ? complaint.category.name : 'General'}
              </span>
            </div>
            <div>
              <span className="font-bold block" style={{ color: 'var(--text-muted)' }}>LOCATION</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                {complaint.location}
              </span>
            </div>
            <div>
              <span className="font-bold block" style={{ color: 'var(--text-muted)' }}>ASSIGNED TO</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                {complaint.assignedOfficer ? `${complaint.assignedOfficer.name} (${complaint.department?.name || 'Department'})` : 'Not yet assigned'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Complaint Details + Evidence */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--navy)' }}>
                Issue Description
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                {complaint.description}
              </p>

              {/* Citizen Photo Evidence */}
              {complaint.photo && (
                <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Citizen Photo Evidence
                  </h3>
                  <img
                    src={`${serverBase}/uploads/${complaint.photo}`}
                    alt="Citizen evidence"
                    className="max-h-72 rounded border object-cover"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              )}
            </div>

            {/* Resolution Information (if any) */}
            {(complaint.resolutionRemarks || complaint.resolutionPhoto) && (
              <div className="card p-6" style={{ borderLeft: '4px solid var(--green)' }}>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--green)' }}>
                  Officer Resolution Details
                </h2>

                {complaint.resolutionRemarks && (
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase block" style={{ color: 'var(--text-muted)' }}>
                      Remarks
                    </span>
                    <p className="text-sm mt-1" style={{ color: 'var(--text)' }}>
                      {complaint.resolutionRemarks}
                    </p>
                  </div>
                )}

                {complaint.resolutionPhoto && (
                  <div>
                    <span className="text-xs font-bold uppercase block mb-2" style={{ color: 'var(--text-muted)' }}>
                      Resolution Photograph
                    </span>
                    <img
                      src={`${serverBase}/uploads/${complaint.resolutionPhoto}`}
                      alt="Resolution evidence"
                      className="max-h-72 rounded border object-cover"
                      style={{ borderColor: 'var(--border)' }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Citizen Feedback Form (when status is Resolved) */}
            {canProvideFeedback && (
              <div className="card p-6" style={{ background: 'var(--surface)', border: '2px solid var(--navy)' }}>
                <h2 className="text-base font-bold mb-2" style={{ color: 'var(--navy)' }}>
                  Verify Resolution
                </h2>
                <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                  The assigned officer has marked this issue as resolved. Please review the work and either confirm the closure or dispute if not satisfied.
                </p>

                <div className="form-group">
                  <label className="form-label">Feedback Remarks (Required if disputing)</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Provide details on whether the work was done satisfactorily or what still remains..."
                    value={feedbackRemarks}
                    onChange={e => setFeedbackRemarks(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="btn btn-success"
                    disabled={feedbackLoading}
                    onClick={() => handleFeedback('confirmed')}
                  >
                    ✓ Confirm Resolution (Close Complaint)
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={feedbackLoading}
                    onClick={() => handleFeedback('disputed')}
                  >
                    ✗ Dispute Resolution (Reopen)
                  </button>
                </div>
              </div>
            )}

            {/* Citizen Feedback Display (if already submitted) */}
            {complaint.citizenFeedback && (
              <div className="card p-5" style={{ background: complaint.citizenFeedback === 'confirmed' ? 'var(--green-bg)' : 'var(--red-bg)' }}>
                <div className="text-xs font-bold uppercase mb-1" style={{ color: complaint.citizenFeedback === 'confirmed' ? 'var(--green)' : 'var(--red)' }}>
                  Citizen Verification: {complaint.citizenFeedback.toUpperCase()}
                </div>
                {complaint.citizenFeedbackRemarks && (
                  <p className="text-xs" style={{ color: 'var(--text)' }}>
                    "{complaint.citizenFeedbackRemarks}"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Status Timeline */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--navy)' }}>
                Lifecycle Timeline
              </h2>

              <div className="space-y-6">
                {complaint.statusHistory && complaint.statusHistory.length > 0 ? (
                  complaint.statusHistory.map((step, idx) => (
                    <div key={idx} className="timeline-step">
                      <div className="timeline-dot timeline-dot-done">✓</div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: 'var(--navy)' }}>
                          {step.status}
                        </div>
                        <div className="text-xs mt-1" style={{ color: 'var(--text)' }}>
                          {step.explanation}
                        </div>
                        {step.remarks && (
                          <div className="text-xs mt-1 italic" style={{ color: 'var(--text-secondary)' }}>
                            "{step.remarks}"
                          </div>
                        )}
                        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          {new Date(step.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          {step.changedBy && ` · by ${step.changedBy.name}`}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>No history available</div>
                )}
              </div>
            </div>

            {/* Reporting citizen info (for officer/admin) */}
            {user?.role !== 'citizen' && (
              <div className="card p-5 text-xs">
                <div className="font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--navy)' }}>
                  Reporting Citizen
                </div>
                <div><strong>Name:</strong> {complaint.citizen.name}</div>
                <div><strong>Email:</strong> {complaint.citizen.email}</div>
                {complaint.citizen.phone && <div><strong>Phone:</strong> {complaint.citizen.phone}</div>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
