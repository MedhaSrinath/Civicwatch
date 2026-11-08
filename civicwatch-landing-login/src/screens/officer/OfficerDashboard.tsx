import { Navbar } from '../../components/Navbar';

export function OfficerDashboard() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="main-content">
        <h1 className="section-title">Officer Dashboard</h1>
      </div>
    </div>
  );
}
