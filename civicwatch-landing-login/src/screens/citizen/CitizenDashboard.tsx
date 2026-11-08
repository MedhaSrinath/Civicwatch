import { Navbar } from '../../components/Navbar';

export function CitizenDashboard() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="main-content">
        <h1 className="section-title">Citizen Dashboard</h1>
      </div>
    </div>
  );
}
