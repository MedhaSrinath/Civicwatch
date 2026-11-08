import { Navbar } from '../../components/Navbar';

export function AdminDashboard() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="main-content">
        <h1 className="section-title">Admin Dashboard</h1>
      </div>
    </div>
  );
}
