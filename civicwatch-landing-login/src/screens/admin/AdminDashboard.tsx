import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import type { Complaint, Department, Category, User, Stats } from '../../types';
import { Navbar } from '../../components/Navbar';
import toast from 'react-hot-toast';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'complaints' | 'stats' | 'users' | 'departments' | 'categories'>('complaints');
  const navigate = useNavigate();

  // Complaints state
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Stats state
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // Departments & Categories
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [officers, setOfficers] = useState<User[]>([]);

  // Modals state
  const [assignModalComplaint, setAssignModalComplaint] = useState<Complaint | null>(null);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Create User Modal state
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('password');
  const [newUserRole, setNewUserRole] = useState<'officer' | 'admin' | 'citizen'>('officer');
  const [newUserDept, setNewUserDept] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');

  // Create Department Modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');

  // Create Category Modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  useEffect(() => {
    fetchMetadata();
    fetchComplaints();
  }, []);

  useEffect(() => {
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const fetchMetadata = async () => {
    try {
      const [deptRes, catRes, userRes] = await Promise.all([
        API.get('/departments'),
        API.get('/categories'),
        API.get('/users?role=officer')
      ]);
      setDepartments(deptRes.data);
      setCategories(catRes.data);
      setOfficers(userRes.data);
    } catch (err) {
      console.error('Failed to load metadata');
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoadingComplaints(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      const res = await API.get(`/complaints?${params.toString()}`);
      setComplaints(res.data);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoadingComplaints(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await API.get('/complaints/stats');
      setStats(res.data);
    } catch (err) {
      toast.error('Failed to load statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const url = userRoleFilter ? `/users?role=${userRoleFilter}` : '/users';
      const res = await API.get(url);
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalComplaint) return;

    try {
      await API.put(`/complaints/${assignModalComplaint._id}/assign`, {
        department: selectedDept || undefined,
        assignedOfficer: selectedOfficer || undefined,
        priority: selectedPriority
      });
      toast.success('Complaint assigned successfully');
      setAssignModalComplaint(null);
      fetchComplaints();
      fetchMetadata();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to assign complaint');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/users', {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
        department: newUserRole === 'officer' && newUserDept ? newUserDept : undefined,
        phone: newUserPhone
      });
      toast.success('User created successfully');
      setShowCreateUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      fetchUsers();
      fetchMetadata();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleToggleUserActive = async (user: User) => {
    try {
      await API.put(`/users/${user._id}`, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (err: any) {
      toast.error('Failed to update user');
    }
  };

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/departments', { name: newDeptName, description: newDeptDesc });
      toast.success('Department created');
      setShowDeptModal(false);
      setNewDeptName('');
      setNewDeptDesc('');
      fetchMetadata();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await API.delete(`/departments/${id}`);
      toast.success('Department deleted');
      fetchMetadata();
    } catch (err) {
      toast.error('Failed to delete department');
    }
  };

  const handleCreateCat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/categories', { name: newCatName, description: newCatDesc });
      toast.success('Category created');
      setShowCatModal(false);
      setNewCatName('');
      setNewCatDesc('');
      fetchMetadata();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDeleteCat = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchMetadata();
    } catch (err) {
      toast.error('Failed to delete category');
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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main className="main-content flex-1" style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '28px 24px' }}>
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Administration Portal</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage complaints, departments, officers, categories, and system analytics
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="tab-bar mb-6 overflow-x-auto">
          {[
            { id: 'complaints', label: 'All Complaints' },
            { id: 'stats', label: 'Analytics & Reports' },
            { id: 'users', label: 'User Management' },
            { id: 'departments', label: 'Departments' },
            { id: 'categories', label: 'Categories' }
          ].map(t => (
            <div
              key={t.id}
              className={`tab-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id as any)}
            >
              {t.label}
            </div>
          ))}
        </div>

        {/* TAB 1: ALL COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div>
            {/* Filters */}
            <div className="card p-4 mb-6 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-bold block mb-1" style={{ color: 'var(--text-muted)' }}>STATUS FILTER</label>
                <select
                  className="form-input text-xs"
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value); }}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                  <option value="Reopened">Reopened</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-bold block mb-1" style={{ color: 'var(--text-muted)' }}>PRIORITY FILTER</label>
                <select
                  className="form-input text-xs"
                  value={priorityFilter}
                  onChange={e => { setPriorityFilter(e.target.value); }}
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="self-end">
                <button className="btn btn-secondary btn-sm" onClick={fetchComplaints}>
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Complaints Table */}
            {loadingComplaints ? (
              <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Loading complaints...</div>
            ) : complaints.length === 0 ? (
              <div className="card text-center py-12 px-6">
                <div className="text-base font-semibold" style={{ color: 'var(--navy)' }}>No complaints found</div>
              </div>
            ) : (
              <div className="card overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title & Location</th>
                      <th>Citizen</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map(c => (
                      <tr key={c._id}>
                        <td>
                          <span className="complaint-id">{c.complaintId}</span>
                        </td>
                        <td>
                          <div className="font-semibold text-xs" style={{ color: 'var(--navy)' }}>{c.title}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>📍 {c.location}</div>
                        </td>
                        <td>
                          <div className="text-xs">{c.citizen?.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.citizen?.email}</div>
                        </td>
                        <td>
                          <span className="text-xs">
                            {typeof c.category === 'object' ? c.category.name : 'General'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getPriorityBadgeClass(c.priority)}`}>
                            {c.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td>
                          {c.assignedOfficer ? (
                            <div>
                              <div className="text-xs font-semibold">{c.assignedOfficer.name}</div>
                              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.department?.name}</div>
                            </div>
                          ) : (
                            <span className="text-xs italic" style={{ color: 'var(--amber)' }}>Unassigned</span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => navigate(`/complaint/${c._id}`)}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setAssignModalComplaint(c);
                                setSelectedDept(c.department ? (typeof c.department === 'object' ? c.department._id : c.department) : '');
                                setSelectedOfficer(c.assignedOfficer ? (typeof c.assignedOfficer === 'object' ? c.assignedOfficer._id : c.assignedOfficer) : '');
                                setSelectedPriority(c.priority || 'Medium');
                              }}
                            >
                              Assign
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ANALYTICS & STATS */}
        {activeTab === 'stats' && (
          <div>
            {loadingStats || !stats ? (
              <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Loading analytics...</div>
            ) : (
              <div className="space-y-6">
                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  <div className="stat-card">
                    <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Total</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: 'var(--navy)' }}>{stats.total}</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Pending</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: 'var(--navy)' }}>{stats.pending}</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Assigned</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: 'var(--navy)' }}>{stats.assigned}</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>In Progress</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: 'var(--amber)' }}>{stats.inProgress}</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Resolved</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: 'var(--green)' }}>{stats.resolved}</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Closed</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: 'var(--text-secondary)' }}>{stats.closed}</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Reopened</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: 'var(--red)' }}>{stats.reopened}</div>
                  </div>
                </div>

                {/* Department performance table */}
                <div className="card p-6">
                  <h2 className="text-base font-bold mb-4" style={{ color: 'var(--navy)' }}>
                    Department Performance Breakdown
                  </h2>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Total Complaints</th>
                        <th>Resolved / Closed</th>
                        <th>Resolution Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.departmentStats && stats.departmentStats.length > 0 ? (
                        stats.departmentStats.map(d => {
                          const rate = d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 0;
                          return (
                            <tr key={d._id}>
                              <td className="font-semibold">{d.name}</td>
                              <td>{d.total}</td>
                              <td style={{ color: 'var(--green)' }}>{d.resolved}</td>
                              <td>
                                <div className="flex items-center gap-3">
                                  <div className="progress-bar flex-1" style={{ width: 120 }}>
                                    <div className="progress-fill" style={{ width: `${rate}%` }} />
                                  </div>
                                  <span className="text-xs font-mono font-bold">{rate}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-6" style={{ color: 'var(--text-muted)' }}>
                            No department data available yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <select
                  className="form-input text-xs w-48"
                  value={userRoleFilter}
                  onChange={e => { setUserRoleFilter(e.target.value); }}
                >
                  <option value="">All Roles</option>
                  <option value="citizen">Citizens</option>
                  <option value="officer">Officers</option>
                  <option value="admin">Admins</option>
                </select>
                <button className="btn btn-secondary btn-sm" onClick={fetchUsers}>Filter</button>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setShowCreateUserModal(true)}>
                + Create User / Officer
              </button>
            </div>

            {loadingUsers ? (
              <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Loading users...</div>
            ) : (
              <div className="card overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td className="font-semibold text-xs">{u.name}</td>
                        <td className="text-xs font-mono">{u.email}</td>
                        <td>
                          <span className={`badge badge-${u.role === 'admin' ? 'inprogress' : u.role === 'officer' ? 'assigned' : 'reported'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="text-xs">
                          {typeof u.department === 'object' && u.department ? u.department.name : '—'}
                        </td>
                        <td className="text-xs">{u.phone || '—'}</td>
                        <td>
                          <span className={`badge ${u.isActive !== false ? 'badge-resolved' : 'badge-high'}`}>
                            {u.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleToggleUserActive(u)}
                          >
                            {u.isActive !== false ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div>
            <div className="flex justify-end mb-4">
              <button className="btn btn-primary btn-sm" onClick={() => setShowDeptModal(true)}>
                + Add Department
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map(d => (
                <div key={d._id} className="card p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold mb-1" style={{ color: 'var(--navy)' }}>{d.name}</h3>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {d.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="flex justify-end border-t pt-3" style={{ borderColor: 'var(--border-light)' }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteDept(d._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CATEGORIES */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-end mb-4">
              <button className="btn btn-primary btn-sm" onClick={() => setShowCatModal(true)}>
                + Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map(c => (
                <div key={c._id} className="card p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold mb-1" style={{ color: 'var(--navy)' }}>{c.name}</h3>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {c.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="flex justify-end border-t pt-3" style={{ borderColor: 'var(--border-light)' }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCat(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ASSIGN MODAL */}
        {assignModalComplaint && (
          <div className="modal-overlay" onClick={() => setAssignModalComplaint(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>
                  Assign Complaint & Set Priority
                </h3>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setAssignModalComplaint(null)}>✕</button>
              </div>

              <div className="mb-4 p-3 rounded text-xs" style={{ background: 'var(--bg)' }}>
                <span className="complaint-id mb-1">{assignModalComplaint.complaintId}</span>
                <div className="font-semibold text-sm mt-1">{assignModalComplaint.title}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>📍 {assignModalComplaint.location}</div>
              </div>

              <form onSubmit={handleAssign}>
                {/* Department */}
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    className="form-input"
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(d => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Direct Officer Assignment */}
                <div className="form-group">
                  <label className="form-label">Assign Officer Directly *</label>
                  <select
                    className="form-input"
                    value={selectedOfficer}
                    onChange={e => setSelectedOfficer(e.target.value)}
                    required
                  >
                    <option value="">Select Officer</option>
                    {officers
                      .filter(o => !selectedDept || (typeof o.department === 'object' ? o.department?._id === selectedDept : o.department === selectedDept))
                      .map(o => (
                        <option key={o._id} value={o._id}>
                          {o.name} ({o.email})
                        </option>
                      ))}
                  </select>
                  <span className="text-xs mt-1 block" style={{ color: 'var(--text-muted)' }}>
                    Admin directly assigns both department and officer.
                  </span>
                </div>

                {/* Priority */}
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-input"
                    value={selectedPriority}
                    onChange={e => setSelectedPriority(e.target.value as any)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setAssignModalComplaint(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Assign & Notify Officer</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE USER MODAL */}
        {showCreateUserModal && (
          <div className="modal-overlay" onClick={() => setShowCreateUserModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>Create New User</h3>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowCreateUserModal(false)}>✕</button>
              </div>

              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" value={newUserName} onChange={e => setNewUserName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input type="password" className="form-input" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className="form-input" value={newUserRole} onChange={e => setNewUserRole(e.target.value as any)}>
                    <option value="officer">Officer</option>
                    <option value="admin">Administrator</option>
                    <option value="citizen">Citizen</option>
                  </select>
                </div>
                {newUserRole === 'officer' && (
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select className="form-input" value={newUserDept} onChange={e => setNewUserDept(e.target.value)}>
                      <option value="">Select Department</option>
                      {departments.map(d => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={newUserPhone} onChange={e => setNewUserPhone(e.target.value)} />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateUserModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create User</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE DEPT MODAL */}
        {showDeptModal && (
          <div className="modal-overlay" onClick={() => setShowDeptModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>Add Department</h3>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowDeptModal(false)}>✕</button>
              </div>
              <form onSubmit={handleCreateDept}>
                <div className="form-group">
                  <label className="form-label">Department Name *</label>
                  <input className="form-input" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={newDeptDesc} onChange={e => setNewDeptDesc(e.target.value)} />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDeptModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Department</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE CATEGORY MODAL */}
        {showCatModal && (
          <div className="modal-overlay" onClick={() => setShowCatModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>Add Category</h3>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowCatModal(false)}>✕</button>
              </div>
              <form onSubmit={handleCreateCat}>
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input className="form-input" value={newCatName} onChange={e => setNewCatName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCatModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Category</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
