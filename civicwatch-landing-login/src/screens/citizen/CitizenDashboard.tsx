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
            <h1 className="section-title">My Complaints</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Track all your reported civic issues and their resolution progress
            </p>
          </div>
          <Link to="/report" className="btn btn-saffron" style={{ textDecoration: 'none' }}>
            + Report New Issue
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Total Reported</div>
            <div className="text-2xl font-bold mt-1" style={{ color: 'var(--navy)' }}>{complaints.length}</div>
          </div>
          <div className="stat-card">
            <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>In Progress</div>
            <div className="text-2xl font-bold mt-1" style={{ color: 'var(--amber)' }}>
              {complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Resolved</div>
            <div className="text-2xl font-bold mt-1" style={{ color: 'var(--green)' }}>
              {complaints.filter(c => c.status === 'Resolved').length}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Closed</div>
            <div className="text-2xl font-bold mt-1" style={{ color: 'var(--text-secondary)' }}>
              {complaints.filter(c => c.status === 'Closed').length}
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="tab-bar mb-6 overflow-x-auto">
          {['all', 'pending', 'assigned', 'in progress', 'resolved', 'closed', 'reopened'].map((t) => (
            <div
              key={t}
              className={`tab-item capitalize whitespace-nowrap ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t} {t === 'all' ? `(${complaints.length})` : `(${complaints.filter(c => c.status.toLowerCase() === t).length})`}
            </div>
          ))}
        </div>

        {/* Content list */}
        {loading ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            Loading your complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="card text-center py-12 px-6">
            <div className="text-base font-semibold mb-2" style={{ color: 'var(--navy)' }}>
              {filter === 'all' ? 'No complaints reported yet' : `No complaints with status "${filter}"`}
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {filter === 'all'
                ? 'Spot a civic problem? Potholes, broken streetlights, garbage? Report it now.'
                : 'Try changing the filter to view other complaints.'}
            </p>
            {filter === 'all' && (
              <Link to="/report" className="btn btn-saffron" style={{ textDecoration: 'none' }}>
                Report an Issue
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map(complaint => (
              <div
                key={complaint._id}
                className="complaint-card"
                onClick={() => navigate(`/complaint/${complaint._id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="complaint-id">{complaint.complaintId}</span>
                    <span className={`badge ${getStatusBadgeClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <span className={`badge ${getPriorityBadgeClass(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
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

                {/* USP: Know Why, Not Just What */}
                <div
                  className="p-2.5 rounded text-xs mb-3 flex items-start gap-2"
                  style={{ background: 'var(--bg-warm)', borderLeft: '3px solid var(--navy)' }}
                >
                  <span className="font-bold text-xs" style={{ color: 'var(--navy)' }}>Status explanation:</span>
                  <span style={{ color: 'var(--text)' }}>{complaint.statusExplanation}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs pt-3 border-t gap-2" style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-4">
                    <span>📍 {complaint.location}</span>
                    <span>📂 {typeof complaint.category === 'object' ? complaint.category.name : 'Uncategorized'}</span>
                    {complaint.department && (
                      <span>🏢 {complaint.department.name}</span>
                    )}
                  </div>
                  <span className="font-semibold hover:underline" style={{ color: 'var(--navy)' }}>
                    View Details →
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
